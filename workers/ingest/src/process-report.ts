import {
  aggregateReportToLeaves,
  buildLeafComponents,
  computeLeafHash,
  leafInputFromAggregation,
  mergeLeafAggregation,
  parseDmarcAggregateReport,
  validateReportSource,
} from '@pact/core';
import {
  findProcessedReport,
  insertProcessedReport,
  loadLeafAggregation,
  upsertDomain,
  upsertLeaf,
} from './ledger.js';
import { type IngestEnv, publishAnchoredRoot } from './publish-root.js';

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

export type { IngestEnv } from './publish-root.js';

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

      // Leaves FK to domains; first valid report upserts so DNS-only operators are not dropped.
      await upsertDomain(env.DB, components.domain);
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

  // Queue retry cannot republish: a redelivered job is already processed, so
  // processed=0 and we never reach here. Cron / POST /v1/root/publish retries.
  if (result.processed > 0) {
    const published = await publishAnchoredRoot(env);
    if (published.status === 'staging') result.errors.push(published.reason);
  }

  return result;
}

export function createProcessor(env: IngestEnv) {
  return (job: ReportJob) => processReportJob(env, job);
}
