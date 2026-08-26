import {
  normalizeDomain,
  byteaToHash,
  type Hash,
} from '@pact/core';
import { buildLeafProof, rebuildGlobalMerkleTree } from '@/lib/merkle-proofs';
import {
  fetchLedgerDomain,
  fetchLedgerDomains,
  fetchWrapperChecks,
  ledgerConfigured,
  ledgerObjectUrl,
  type LedgerWrapperCheck,
} from '@/lib/ledger';
import { ensureDomainRegisteredAt } from '@/lib/ledger-admin';
import { pactAgeDaysFrom, pactHistoryStartFromConnect } from '@/lib/pact-history';

export type WrapperOpeningStatus =
  | { status: 'none' }
  | { status: 'missing' }
  | {
      status: 'checked';
      hashMatches: boolean;
      dkimKeysOnRecord: boolean;
      ok: boolean;
    };

export interface DomainLeafSummary {
  reporterOrg: string;
  periodStart: number;
  periodEnd: number;
  dkimPassCount: number;
  dkimFailCount: number;
  selectors: string[];
  wrapperDkim: { domain: string; selector: string }[];
  wrapperHashes: string[];
  wrapperOpening: WrapperOpeningStatus;
  wrapperCheckUrl: string | null;
  receivedAt: string | null;
  leafIndex: number;
  leafHash: Hash;
  leafUrl: string | null;
  merkleProof: Hash[];
  merkleProofValid: boolean;
}

export interface DomainCtSummary {
  fingerprint: string;
  issuer: string;
  commonName: string;
  logId: string;
  logIndex: number;
  loggedAt: number;
  notBefore: number;
  notAfter: number;
  leafIndex: number;
  leafHash: Hash;
  leafUrl: string | null;
  merkleProof: Hash[];
  merkleProofValid: boolean;
}

export interface DomainRekorSummary {
  uuid: string;
  identity: string;
  entryKind: string;
  logId: string;
  logIndex: number;
  integratedTime: number;
  leafIndex: number;
  leafHash: Hash;
  leafUrl: string | null;
  merkleProof: Hash[];
  merkleProofValid: boolean;
}

export interface DomainLiveData {
  domain: string;
  connectedSince: string | null;
  domainRegisteredAt: string | null;
  pactHistoryStart: string | null;
  pactAgeDays: number;
  uniqueReporters: number;
  passRate: number | null;
  latestRoot: string | null;
  rootTxHash: string | null;
  rootsContract: string | null;
  rootMatchesPublished: boolean;
  domainLeafCount: number;
  globalTreeLeafCount: number | null;
  anchorType: 'staging' | 'base' | null;
  leaves: DomainLeafSummary[];
  ct: DomainCtSummary[];
  rekor: DomainRekorSummary[];
}

export interface DomainWaitingData {
  domain: string;
  connectedSince: string | null;
  domainRegisteredAt: string | null;
  pactHistoryStart: string | null;
  ct: DomainCtSummary[];
  rekor: DomainRekorSummary[];
  latestRoot: string | null;
  rootTxHash: string | null;
  rootsContract: string | null;
  rootMatchesPublished: boolean;
  globalTreeLeafCount: number | null;
  anchorType: 'staging' | 'base' | null;
}

export type DomainPageState =
  | { status: 'live'; data: DomainLiveData }
  | { status: 'waiting'; data: DomainWaitingData }
  | null;

export interface DomainSummary {
  domain: string;
  domainRegisteredAt?: string | null;
  status: 'waiting' | 'live';
  pactAgeDays?: number;
  leafCount?: number;
  mailCount?: number;
  ctCount?: number;
  rekorCount?: number;
}

function indexStreamCounts(
  rows: { domain: string; count: number; first_logged_at: number }[],
): Map<string, { count: number; first: number }> {
  const map = new Map<string, { count: number; first: number }>();
  for (const row of rows) {
    map.set(row.domain, {
      count: Number(row.count) || 0,
      first: Number(row.first_logged_at) || 0,
    });
  }
  return map;
}

export async function fetchDomainSummaries(): Promise<DomainSummary[]> {
  const payload = await fetchLedgerDomains();
  if (!payload) return [];

  const leavesByDomain = new Map<string, typeof payload.leaves>();
  for (const leaf of payload.leaves) {
    const list = leavesByDomain.get(leaf.domain) ?? [];
    list.push(leaf);
    leavesByDomain.set(leaf.domain, list);
  }
  const ctByDomain = indexStreamCounts(payload.ct);
  const rekorByDomain = indexStreamCounts(payload.rekor);

  return payload.domains
    .map((row) => {
      const domainLeaves = leavesByDomain.get(row.domain) ?? [];
      const domainRegisteredAt = row.domain_registered_at ?? null;
      const mailCount = domainLeaves.length;
      const ctCount = ctByDomain.get(row.domain)?.count ?? 0;
      const rekorCount = rekorByDomain.get(row.domain)?.count ?? 0;
      const leafCount = mailCount + ctCount + rekorCount;
      const pactHistoryStart = pactHistoryStartFromConnect(row.connected_at);

      if (leafCount === 0) {
        return {
          domain: row.domain,
          domainRegisteredAt,
          status: 'waiting' as const,
          mailCount: 0,
          ctCount: 0,
          rekorCount: 0,
          leafCount: 0,
        };
      }

      return {
        domain: row.domain,
        domainRegisteredAt,
        status: 'live' as const,
        pactAgeDays: pactAgeDaysFrom(pactHistoryStart),
        leafCount,
        mailCount,
        ctCount,
        rekorCount,
      };
    })
    .sort((a, b) => {
      if (a.status === 'waiting' && b.status !== 'waiting') return 1;
      if (b.status === 'waiting' && a.status !== 'waiting') return -1;
      const daysA = a.pactAgeDays ?? -1;
      const daysB = b.pactAgeDays ?? -1;
      if (daysB !== daysA) return daysB - daysA;
      const leavesA = a.leafCount ?? 0;
      const leavesB = b.leafCount ?? 0;
      if (leavesB !== leavesA) return leavesB - leavesA;
      return a.domain.localeCompare(b.domain);
    });
}

export async function fetchDomainPageState(domain: string): Promise<DomainPageState> {
  const normalized = normalizeDomain(domain);
  const payload = await fetchLedgerDomain(normalized);
  if (!payload) return null;

  const domainRegisteredAt = await ensureDomainRegisteredAt(
    normalized,
    payload.domain.domain_registered_at,
  );

  const leaves = payload.leaves;
  const merkleContext = rebuildGlobalMerkleTree(payload.globalLeaves);
  const latestRootEarly = payload.onChain?.root ?? null;
  const computedRootEarly = merkleContext?.root ?? null;
  const rootMatchesEarly =
    latestRootEarly !== null &&
    computedRootEarly !== null &&
    latestRootEarly.toLowerCase() === computedRootEarly.toLowerCase();
  const ct = mapCtCerts(payload.ct ?? [], merkleContext, rootMatchesEarly);
  const rekor = mapRekorEntries(payload.rekor ?? [], merkleContext, rootMatchesEarly);
  const hasTraces = leaves.length > 0 || ct.length > 0 || rekor.length > 0;

  if (!hasTraces) {
    const onChain = payload.onChain != null;
    return {
      status: 'waiting',
      data: {
        domain: normalized,
        connectedSince: payload.domain.connected_at,
        domainRegisteredAt,
        pactHistoryStart: null,
        ct,
        rekor,
        latestRoot: latestRootEarly,
        rootTxHash: payload.onChain?.txHash ?? null,
        rootsContract: payload.onChain?.contract ?? null,
        rootMatchesPublished: rootMatchesEarly,
        globalTreeLeafCount: payload.onChain?.leafCount ?? merkleContext?.tree.size ?? null,
        anchorType: onChain ? 'base' : merkleContext ? 'staging' : null,
      },
    };
  }
  const totalPassCount = leaves.reduce((s, l) => s + Number(l.dkim_pass_count), 0);
  const totalFailCount = leaves.reduce((s, l) => s + Number(l.dkim_fail_count), 0);
  const reporters = new Set(leaves.map((l) => l.reporter_org));
  const total = totalPassCount + totalFailCount;
  const passRate = total > 0 ? (totalPassCount / total) * 100 : null;
  const pactHistoryStart = pactHistoryStartFromConnect(payload.domain.connected_at);

  const latestRoot = latestRootEarly;
  const rootMatchesPublished = rootMatchesEarly;
  const onChain = payload.onChain != null;
  const wrapperChecks = await fetchWrapperChecks(
    leaves.flatMap((leaf) => safeJsonArray(leaf.wrapper_hashes)),
  );

  return {
    status: 'live',
    data: {
      domain: normalized,
      connectedSince: payload.domain.connected_at ?? null,
      domainRegisteredAt,
      pactHistoryStart: pactHistoryStart.toISOString(),
      pactAgeDays: pactAgeDaysFrom(pactHistoryStart),
      uniqueReporters: reporters.size,
      passRate,
      latestRoot,
      rootTxHash: payload.onChain?.txHash ?? null,
      rootsContract: payload.onChain?.contract ?? null,
      rootMatchesPublished,
      domainLeafCount: leaves.length + ct.length + rekor.length,
      globalTreeLeafCount: payload.onChain?.leafCount ?? merkleContext?.tree.size ?? null,
      anchorType: onChain ? 'base' : 'staging',
      ct,
      rekor,
      leaves: leaves.map((leaf) => {
        const wrapperHashes = safeJsonArray(leaf.wrapper_hashes);
        const storedWrapper = wrapperHashes.find((hash) =>
          wrapperChecks.has(hash.trim().toLowerCase().replace(/^0x/, '')),
        );
        const proof = leafInclusion(
          Number(leaf.leaf_index),
          byteaToHash(leaf.leaf_hash),
          merkleContext,
          rootMatchesPublished,
        );

        return {
          reporterOrg: leaf.reporter_org,
          periodStart: Number(leaf.period_start),
          periodEnd: Number(leaf.period_end),
          dkimPassCount: Number(leaf.dkim_pass_count),
          dkimFailCount: Number(leaf.dkim_fail_count),
          selectors: safeJsonArray(leaf.selectors),
          wrapperDkim: parseWrapperDkim(leaf.wrapper_dkim),
          wrapperHashes,
          wrapperOpening: combineWrapperOpening(wrapperHashes, wrapperChecks),
          wrapperCheckUrl: storedWrapper
            ? ledgerObjectUrl('wrappers', storedWrapper, '/check')
            : null,
          receivedAt: leaf.created_at ?? null,
          ...proof,
        };
      }),
    },
  };
}

export { ledgerConfigured };

function leafInclusion(
  leafIndex: number,
  leafHash: Hash,
  merkleContext: ReturnType<typeof rebuildGlobalMerkleTree>,
  rootMatchesPublished: boolean,
): {
  leafIndex: number;
  leafHash: Hash;
  leafUrl: string | null;
  merkleProof: Hash[];
  merkleProofValid: boolean;
} {
  const proof =
    merkleContext != null
      ? buildLeafProof(merkleContext.tree, merkleContext.root, leafIndex, leafHash)
      : { leafIndex, leafHash, proof: [] as Hash[], proofValid: false };
  return {
    leafIndex: proof.leafIndex,
    leafHash: proof.leafHash,
    leafUrl: ledgerObjectUrl('leaves', proof.leafHash),
    merkleProof: proof.proof,
    merkleProofValid: proof.proofValid && rootMatchesPublished,
  };
}

function mapCtCerts(
  rows: {
    fingerprint: string;
    issuer: string;
    common_name: string;
    log_id: string;
    log_index: number;
    logged_at: number;
    not_before: number;
    not_after: number;
    leaf_index: number;
    leaf_hash: string;
  }[],
  merkleContext: ReturnType<typeof rebuildGlobalMerkleTree>,
  rootMatchesPublished: boolean,
): DomainCtSummary[] {
  return rows.map((row) => ({
    fingerprint: row.fingerprint,
    issuer: row.issuer,
    commonName: row.common_name,
    logId: row.log_id,
    logIndex: Number(row.log_index),
    loggedAt: Number(row.logged_at),
    notBefore: Number(row.not_before),
    notAfter: Number(row.not_after),
    ...leafInclusion(
      Number(row.leaf_index),
      byteaToHash(row.leaf_hash),
      merkleContext,
      rootMatchesPublished,
    ),
  }));
}

function mapRekorEntries(
  rows: {
    uuid: string;
    identity: string;
    entry_kind: string;
    log_id: string;
    log_index: number;
    integrated_time: number;
    leaf_index: number;
    leaf_hash: string;
  }[],
  merkleContext: ReturnType<typeof rebuildGlobalMerkleTree>,
  rootMatchesPublished: boolean,
): DomainRekorSummary[] {
  return rows.map((row) => ({
    uuid: row.uuid,
    identity: row.identity,
    entryKind: row.entry_kind,
    logId: row.log_id,
    logIndex: Number(row.log_index),
    integratedTime: Number(row.integrated_time),
    ...leafInclusion(
      Number(row.leaf_index),
      byteaToHash(row.leaf_hash),
      merkleContext,
      rootMatchesPublished,
    ),
  }));
}

function combineWrapperOpening(
  hashes: string[],
  checks: Map<string, LedgerWrapperCheck>,
): WrapperOpeningStatus {
  if (hashes.length === 0) return { status: 'none' };
  const rows = hashes
    .map((hash) => checks.get(hash.trim().toLowerCase().replace(/^0x/, '')) ?? null)
    .filter((row): row is LedgerWrapperCheck => row != null);
  if (rows.length !== hashes.length) return { status: 'missing' };
  const hashMatches = rows.every((row) => row.hashMatches);
  const dkimKeysOnRecord = rows.every((row) => row.dkimKeysOnRecord);
  return {
    status: 'checked',
    hashMatches,
    dkimKeysOnRecord,
    ok: hashMatches && dkimKeysOnRecord,
  };
}

function safeJsonArray(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function parseWrapperDkim(
  value: string | { domain: string; selector: string }[] | null | undefined,
): { domain: string; selector: string }[] {
  if (Array.isArray(value)) {
    return value.filter((row) => row && typeof row.domain === 'string');
  }
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is { domain: string; selector: string } =>
        Boolean(row) && typeof row === 'object' && typeof (row as { domain?: unknown }).domain === 'string',
    );
  } catch {
    return [];
  }
}
