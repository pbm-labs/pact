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
  wrapperUrl: string | null;
  wrapperCheckUrl: string | null;
  receivedAt: string | null;
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
  totalFailCount: number;
  uniqueReporters: number;
  passRate: number;
  latestRoot: string | null;
  rootTxHash: string | null;
  rootsContract: string | null;
  rootMatchesPublished: boolean;
  domainLeafCount: number;
  globalTreeLeafCount: number | null;
  anchorType: 'staging' | 'base' | null;
  staging: boolean;
  leaves: DomainLeafSummary[];
}

export interface DomainWaitingData {
  domain: string;
  connectedSince: string | null;
  domainRegisteredAt: string | null;
}

export type DomainPageState =
  | { status: 'live'; data: DomainLiveData }
  | { status: 'waiting'; data: DomainWaitingData }
  | null;

function pactHistoryStartFromLeaves(
  leaves: { period_start: number }[],
  connectedAt: string | null,
): Date {
  const earliest = leaves.reduce((min, l) => {
    const t = Number(l.period_start) * 1000;
    return t < min ? t : min;
  }, Number.POSITIVE_INFINITY);

  if (earliest !== Number.POSITIVE_INFINITY) {
    return new Date(earliest);
  }
  if (connectedAt) return new Date(connectedAt);
  return new Date();
}

function pactAgeDaysFrom(start: Date, asOf = new Date()): number {
  return Math.max(0, (asOf.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export interface DomainSummary {
  domain: string;
  domainRegisteredAt?: string | null;
  status: 'waiting' | 'live';
  pactAgeDays?: number;
  leafCount?: number;
  uniqueReporterCount?: number;
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

  return payload.domains
    .map((row) => {
      const domainLeaves = leavesByDomain.get(row.domain) ?? [];
      const domainRegisteredAt = row.domain_registered_at ?? null;

      if (!domainLeaves.length) {
        return {
          domain: row.domain,
          domainRegisteredAt,
          status: 'waiting' as const,
        };
      }

      const reporters = new Set(domainLeaves.map((l) => l.reporter_org));
      const pactHistoryStart = pactHistoryStartFromLeaves(domainLeaves, row.connected_at);

      return {
        domain: row.domain,
        domainRegisteredAt,
        status: 'live' as const,
        pactAgeDays: pactAgeDaysFrom(pactHistoryStart),
        leafCount: domainLeaves.length,
        uniqueReporterCount: reporters.size,
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
  if (!leaves.length) {
    return {
      status: 'waiting',
      data: {
        domain: normalized,
        connectedSince: payload.domain.connected_at,
        domainRegisteredAt,
      },
    };
  }

  const merkleContext = rebuildGlobalMerkleTree(payload.globalLeaves);
  const totalPassCount = leaves.reduce((s, l) => s + Number(l.dkim_pass_count), 0);
  const totalFailCount = leaves.reduce((s, l) => s + Number(l.dkim_fail_count), 0);
  const reporters = new Set(leaves.map((l) => l.reporter_org));
  const total = totalPassCount + totalFailCount;
  const passRate = total > 0 ? (totalPassCount / total) * 100 : 0;
  const pactHistoryStart = pactHistoryStartFromLeaves(leaves, payload.domain.connected_at);

  const latestRoot = payload.onChain?.root ?? null;
  const computedRoot = merkleContext?.root ?? null;
  const rootMatchesPublished =
    latestRoot !== null &&
    computedRoot !== null &&
    latestRoot.toLowerCase() === computedRoot.toLowerCase();
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
      totalFailCount,
      uniqueReporters: reporters.size,
      passRate,
      latestRoot,
      rootTxHash: payload.onChain?.txHash ?? null,
      rootsContract: payload.onChain?.contract ?? null,
      rootMatchesPublished,
      domainLeafCount: leaves.length,
      globalTreeLeafCount: payload.onChain?.leafCount ?? merkleContext?.tree.size ?? null,
      anchorType: onChain ? 'base' : 'staging',
      staging: !onChain,
      leaves: leaves.map((leaf) => {
        const leafHash = byteaToHash(leaf.leaf_hash);
        const leafIndex = Number(leaf.leaf_index);
        const proof =
          merkleContext != null
            ? buildLeafProof(merkleContext.tree, merkleContext.root, leafIndex, leafHash)
            : {
                leafIndex,
                leafHash,
                proof: [] as Hash[],
                proofValid: false,
              };

        const wrapperHashes = safeJsonArray(leaf.wrapper_hashes);
        const storedWrapper = wrapperHashes.find((hash) =>
          wrapperChecks.has(hash.trim().toLowerCase().replace(/^0x/, '')),
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
          wrapperUrl: storedWrapper ? ledgerObjectUrl('wrappers', storedWrapper) : null,
          wrapperCheckUrl: storedWrapper
            ? ledgerObjectUrl('wrappers', storedWrapper, '/check')
            : null,
          receivedAt: leaf.created_at ?? null,
          leafIndex: proof.leafIndex,
          leafHash: proof.leafHash,
          leafUrl: ledgerObjectUrl('leaves', proof.leafHash),
          merkleProof: proof.proof,
          merkleProofValid: proof.proofValid && rootMatchesPublished,
        };
      }),
    },
  };
}

export { ledgerConfigured };

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
