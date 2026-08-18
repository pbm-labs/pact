import {
  aggregateReportToLeaves,
  buildLeafComponents,
  computeLeafHash,
  leafInputFromAggregation,
  mergeLeafAggregation,
  parseDmarcAggregateReport,
  SparseMerkleTree,
  validateReportSource,
  type Hash,
} from '@pact/core';
import { publishRootOnChain } from './chain.js';
import {
  findProcessedReport,
  getTxHashForRoot,
  insertMerkleRoot,
  insertProcessedReport,
  listLeafHashes,
  loadLeafAggregation,
  upsertLeaf,
} from './ledger.js';

export interface ReportJob {
  envelopeFrom: string;
  rawXml: string;
  receivedAt: string;
  dkimDomains: string[];
  dkimSelector?: string | null;
  dkimDomain?: string | null;
  /** keccak256 of the authenticating RFC822 wrapper */
  wrapperHash?: `0x${string}` | string;
  /** Passing wrapper DKIM d= / s= pairs */
  wrapperDkim?: { domain: string; selector: string }[];
}

export interface ProcessResult {
  processed: number;
  skipped: number;
  rejected: number;
  errors: string[];
}

export interface IngestEnv {
  DB: D1Database;
  CHAIN_RPC_URL: string;
  PUBLISHER_PRIVATE_KEY?: string;
}

function hasWrapperWitness(job: ReportJob): job is ReportJob & {
  wrapperHash: `0x${string}`;
  wrapperDkim: { domain: string; selector: string }[];
} {
  return (
    typeof job.wrapperHash === 'string' &&
    /^0x[0-9a-f]{64}$/i.test(job.wrapperHash) &&
    Array.isArray(job.wrapperDkim) &&
    job.wrapperDkim.length > 0
  );
}

export async function processReportJob(env: IngestEnv, job: ReportJob): Promise<ProcessResult> {
  const result: ProcessResult = { processed: 0, skipped: 0, rejected: 0, errors: [] };

  if (!hasWrapperWitness(job)) {
    result.rejected += 1;
    result.errors.push('wrapper witness missing');
    return result;
  }

  let reports;
  try {
    reports = parseDmarcAggregateReport(job.rawXml);
  } catch (err) {
    result.errors.push(`parse failed: ${String(err)}`);
    result.rejected += 1;
    return result;
  }

  if (!reports.length) {
    result.errors.push('no records in XML');
    result.rejected += 1;
    return result;
  }

  for (const report of reports) {
    if (
      !validateReportSource({
        orgName: report.orgName,
        envelopeFrom: job.envelopeFrom,
        dkimDomains: job.dkimDomains ?? [],
      })
    ) {
      result.rejected += 1;
      result.errors.push(
        `auth failed: ${report.orgName} from ${job.envelopeFrom} dkim=${(job.dkimDomains ?? []).join(',') || 'none'}`,
      );
      continue;
    }

    const already = await findProcessedReport(env.DB, {
      reportId: report.reportId,
      reporterOrg: report.orgName,
      periodStart: Number(report.periodStart),
      periodEnd: Number(report.periodEnd),
      headerFrom: report.domain,
    });
    if (already) {
      result.skipped += 1;
      continue;
    }

    let reportLeavesProcessed = 0;
    for (const agg of aggregateReportToLeaves(report)) {
      const witnessed = {
        ...agg,
        wrapperHashes: [job.wrapperHash],
        wrapperDkim: job.wrapperDkim,
      };
      const existing = await loadLeafAggregation(env.DB, {
        domain: agg.key.domain,
        periodStart: Number(agg.key.periodStart),
        periodEnd: Number(agg.key.periodEnd),
        reporterOrg: agg.key.reporterOrg,
      });
      const mergedAgg = existing ? mergeLeafAggregation(existing, witnessed) : witnessed;
      const leafInput = leafInputFromAggregation(mergedAgg);
      const components = buildLeafComponents(leafInput);
      const leafHash = computeLeafHash(leafInput);

      await upsertLeaf(env.DB, {
        leafHash,
        domain: components.domain,
        periodStart: Number(components.periodStart),
        periodEnd: Number(components.periodEnd),
        reporterOrg: components.reporterOrg,
        dkimPassCount: Number(components.dkimPassCount),
        dkimFailCount: Number(components.dkimFailCount),
        domainHash: components.domainHash,
        reporterHash: components.reporterHash,
        selectorHash: components.selectorHash,
        sourceIpHash: components.sourceIpHash,
        reportHash: components.reportHash,
        wrapperHash: components.wrapperHash,
        wrapperDkimHash: components.wrapperDkimHash,
        selectors: mergedAgg.selectors,
        ipRanges: mergedAgg.sourceIps,
        wrapperHashes: mergedAgg.wrapperHashes,
        wrapperDkim: mergedAgg.wrapperDkim,
      });

      reportLeavesProcessed += 1;
      result.processed += 1;
    }

    if (reportLeavesProcessed > 0) {
      await insertProcessedReport(env.DB, {
        reportId: report.reportId,
        reporterOrg: report.orgName,
        periodStart: Number(report.periodStart),
        periodEnd: Number(report.periodEnd),
        headerFrom: report.domain,
        envelopeSender: job.envelopeFrom,
        dkimDomain: job.dkimDomain ?? job.dkimDomains[0] ?? null,
        dkimSelector: job.dkimSelector ?? null,
        wrapperHash: job.wrapperHash,
        wrapperDkim: job.wrapperDkim,
      });
    }
  }

  if (result.processed > 0) {
    const rootError = await publishAnchoredRoot(env);
    if (rootError) result.errors.push(rootError);
  }

  return result;
}

async function publishAnchoredRoot(env: IngestEnv): Promise<string | null> {
  const leaves = await listLeafHashes(env.DB);
  if (!leaves.length) return null;

  const tree = new SparseMerkleTree();
  for (const leaf of leaves) {
    tree.insert(leaf.leaf_hash as Hash);
  }
  const root = tree.getRoot();

  if (!env.PUBLISHER_PRIVATE_KEY) {
    await insertMerkleRoot(env.DB, {
      rootHash: root,
      leafCount: leaves.length,
      anchorType: 'staging',
    });
    return 'publisher key missing — wrote staging root only';
  }

  const published = await publishRootOnChain({
    rpcUrl: env.CHAIN_RPC_URL,
    privateKey: env.PUBLISHER_PRIVATE_KEY,
    root,
    leafCount: leaves.length,
  });

  if ('error' in published) {
    await insertMerkleRoot(env.DB, {
      rootHash: root,
      leafCount: leaves.length,
      anchorType: 'staging',
    });
    return `on-chain publish: ${published.error}`;
  }

  const txHash =
    'txHash' in published
      ? published.txHash
      : await getTxHashForRoot(env.DB, root);
  await insertMerkleRoot(env.DB, {
    rootHash: root,
    leafCount: leaves.length,
    anchorType: 'base',
    txHash,
  });
  return null;
}

export function createProcessor(env: IngestEnv) {
  return (job: ReportJob) => processReportJob(env, job);
}
