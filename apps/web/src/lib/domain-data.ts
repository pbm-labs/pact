import { createClient } from '@supabase/supabase-js';
import {
  computeTrustScore,
  normalizeDomain,
  SCORE_ALGORITHM,
  formatScoreForDisplay,
  byteaToHex,
  byteaToHash,
  type Hash,
} from '@pact/core';
import { buildLeafProof, rebuildGlobalMerkleTree } from '@/lib/merkle-proofs';
import { fetchAllRows } from '@/lib/supabase-fetch-all';
import { latestTimestamp } from '@/lib/format-time';
import { ensureDomainRegisteredAt } from '@/lib/supabase-admin';

export interface DomainLeafSummary {
  reporterOrg: string;
  periodStart: number;
  periodEnd: number;
  dkimPassCount: number;
  dkimFailCount: number;
  selectors: string[];
  receivedAt: string | null;
  leafIndex: number;
  leafHash: Hash;
  merkleProof: Hash[];
  merkleProofValid: boolean;
}

export interface DomainLiveData {
  domain: string;
  connectedSince: string | null;
  domainRegisteredAt: string | null;
  pactHistoryStart: string | null;
  trust: ReturnType<typeof computeTrustScore>;
  totalPassCount: number;
  totalFailCount: number;
  uniqueReporters: number;
  passRate: number;
  latestRoot: string | null;
  computedRoot: string | null;
  rootMatchesPublished: boolean;
  domainLeafCount: number;
  globalTreeLeafCount: number | null;
  anchorType: 'staging' | 'base' | null;
  staging: boolean;
  leaves: DomainLeafSummary[];
  lastIngestedAt: string | null;
}

export interface DomainWaitingData {
  domain: string;
  connectedSince: string | null;
  domainRegisteredAt: string | null;
}

export interface DomainDisconnectedData {
  domain: string;
  connectedSince: string | null;
  disconnectedSince: string;
  domainRegisteredAt: string | null;
}

export type DomainPageState =
  | { status: 'live'; data: DomainLiveData }
  | { status: 'waiting'; data: DomainWaitingData }
  | { status: 'disconnected'; data: DomainDisconnectedData }
  | null;

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  if (!url) return null;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!key) return null;
  return createClient(url, key);
}

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

export async function fetchJoinedCount(): Promise<number> {
  try {
    const supabase = getSupabase();
    if (!supabase) return 0;

    const { count, error } = await supabase
      .from('domains')
      .select('*', { count: 'exact', head: true })
      .is('disconnected_at', null);

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function fetchRegisteredDomains(): Promise<string[]> {
  const summaries = await fetchDomainSummaries();
  return summaries.map((s) => s.domain);
}

export interface DomainSummary {
  domain: string;
  connectedSince: string | null;
  domainRegisteredAt?: string | null;
  pactHistoryStart?: string | null;
  status: 'waiting' | 'live';
  /** Raw canonical T — use for sorting only. */
  trustScore?: number;
  trustScoreDisplay?: number;
  trustScoreLabel?: string;
  trustStatus?: 'provisional' | 'activated';
  leafCount?: number;
  passRate?: number;
  uniqueReporterCount?: number;
  lastIngestedAt?: string | null;
}

export async function fetchDomainSummaries(): Promise<DomainSummary[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: domainRows, error: domainError } = await supabase
    .from('domains')
    .select('domain, connected_at, domain_registered_at')
    .is('disconnected_at', null)
    .order('domain', { ascending: true });

  const rowsWithoutReg =
    domainError?.code === '42703'
      ? (
          await supabase
            .from('domains')
            .select('domain, connected_at')
            .is('disconnected_at', null)
            .order('domain', { ascending: true })
        ).data
      : null;

  if ((domainError && !rowsWithoutReg) || (!domainRows?.length && !rowsWithoutReg?.length)) {
    if (domainError && domainError.code !== '42703') return [];
    if (!rowsWithoutReg?.length) return [];
  }

  const effectiveRows = (domainRows ?? rowsWithoutReg ?? []).map((row) => ({
    ...row,
    domain_registered_at:
      'domain_registered_at' in row
        ? (row as { domain_registered_at?: string | null }).domain_registered_at ?? null
        : null,
  }));

  let leaves: Awaited<
    ReturnType<
      typeof fetchAllRows<{
        domain: string;
        dkim_pass_count: number;
        dkim_fail_count: number;
        reporter_org: string;
        period_start: number;
        created_at: string | null;
      }>
    >
  >;
  try {
    leaves = await fetchAllRows((from, to) =>
      supabase
        .from('leaves')
        .select('domain, dkim_pass_count, dkim_fail_count, reporter_org, period_start, created_at')
        .order('leaf_index', { ascending: true })
        .range(from, to),
    );
  } catch {
    return [];
  }

  const leavesByDomain = new Map<string, typeof leaves>();
  for (const leaf of leaves) {
    const list = leavesByDomain.get(leaf.domain) ?? [];
    list.push(leaf);
    leavesByDomain.set(leaf.domain, list);
  }

  return effectiveRows
    .map((row) => {
      const domainLeaves = leavesByDomain.get(row.domain) ?? [];
      const domainRegisteredAt = row.domain_registered_at ?? null;

      if (!domainLeaves.length) {
        return {
          domain: row.domain,
          connectedSince: row.connected_at,
          domainRegisteredAt,
          status: 'waiting' as const,
        };
      }

      const totalPassCount = domainLeaves.reduce((s, l) => s + Number(l.dkim_pass_count), 0);
      const totalFailCount = domainLeaves.reduce((s, l) => s + Number(l.dkim_fail_count), 0);
      const reporters = new Set(domainLeaves.map((l) => l.reporter_org));
      const total = totalPassCount + totalFailCount;
      const passRate = total > 0 ? (totalPassCount / total) * 100 : 0;

      const pactHistoryStart = pactHistoryStartFromLeaves(domainLeaves, row.connected_at);

      const trust = computeTrustScore({
        totalPassCount,
        leafCount: domainLeaves.length,
        reportingOrgsCount: reporters.size,
        pactHistoryStart,
        domainRegisteredAt: domainRegisteredAt ? new Date(domainRegisteredAt) : null,
      });
      const display = formatScoreForDisplay(trust.score);

      return {
        domain: row.domain,
        connectedSince: row.connected_at,
        domainRegisteredAt,
        pactHistoryStart: pactHistoryStart.toISOString(),
        status: 'live' as const,
        trustScore: trust.score,
        trustScoreDisplay: display.displayScore,
        trustScoreLabel: display.label,
        trustStatus: trust.status,
        leafCount: domainLeaves.length,
        passRate,
        uniqueReporterCount: reporters.size,
        lastIngestedAt: latestTimestamp(domainLeaves.map((l) => l.created_at)),
      };
    })
    .sort((a, b) => {
      if (a.status === 'waiting' && b.status !== 'waiting') return 1;
      if (b.status === 'waiting' && a.status !== 'waiting') return -1;
      const scoreA = a.trustScore ?? -1;
      const scoreB = b.trustScore ?? -1;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.domain.localeCompare(b.domain);
    });
}

export async function fetchDomainPageState(domain: string): Promise<DomainPageState> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const normalized = normalizeDomain(domain);

  let domainRow:
    | {
        connected_at: string;
        disconnected_at: string | null;
        domain_registered_at?: string | null;
      }
    | null = null;

  const primary = await supabase
    .from('domains')
    .select('connected_at, disconnected_at, domain_registered_at')
    .eq('domain', normalized)
    .maybeSingle();

  if (primary.error?.code === '42703') {
    const fallback = await supabase
      .from('domains')
      .select('connected_at, disconnected_at')
      .eq('domain', normalized)
      .maybeSingle();
    if (fallback.error || !fallback.data) return null;
    domainRow = { ...fallback.data, domain_registered_at: null };
  } else {
    if (primary.error || !primary.data) return null;
    domainRow = primary.data;
  }

  const domainRegisteredAt = await ensureDomainRegisteredAt(
    normalized,
    domainRow.domain_registered_at,
  );

  if (domainRow.disconnected_at) {
    return {
      status: 'disconnected',
      data: {
        domain: normalized,
        connectedSince: domainRow.connected_at,
        disconnectedSince: domainRow.disconnected_at,
        domainRegisteredAt,
      },
    };
  }

  let leaves: Awaited<
    ReturnType<
      typeof fetchAllRows<{
        leaf_index: number;
        leaf_hash: unknown;
        dkim_pass_count: number;
        dkim_fail_count: number;
        reporter_org: string;
        period_start: number;
        period_end: number;
        selectors: string[] | null;
        created_at: string | null;
      }>
    >
  >;
  try {
    leaves = await fetchAllRows((from, to) =>
      supabase
        .from('leaves')
        .select(
          'leaf_index, leaf_hash, dkim_pass_count, dkim_fail_count, reporter_org, period_start, period_end, selectors, created_at',
        )
        .eq('domain', normalized)
        .order('period_start', { ascending: false })
        .range(from, to),
    );
  } catch {
    return null;
  }

  if (!leaves.length) {
    return {
      status: 'waiting',
      data: {
        domain: normalized,
        connectedSince: domainRow.connected_at,
        domainRegisteredAt,
      },
    };
  }

  let globalLeaves: Awaited<
    ReturnType<typeof fetchAllRows<{ leaf_index: number; leaf_hash: unknown }>>
  >;
  try {
    globalLeaves = await fetchAllRows((from, to) =>
      supabase
        .from('leaves')
        .select('leaf_index, leaf_hash')
        .order('leaf_index', { ascending: true })
        .range(from, to),
    );
  } catch {
    return null;
  }

  const merkleContext = rebuildGlobalMerkleTree(globalLeaves);

  const totalPassCount = leaves.reduce((s, l) => s + Number(l.dkim_pass_count), 0);
  const totalFailCount = leaves.reduce((s, l) => s + Number(l.dkim_fail_count), 0);
  const reporters = new Set(leaves.map((l) => l.reporter_org));
  const total = totalPassCount + totalFailCount;
  const passRate = total > 0 ? (totalPassCount / total) * 100 : 0;

  const pactHistoryStart = pactHistoryStartFromLeaves(leaves, domainRow.connected_at);

  const trust = computeTrustScore({
    totalPassCount,
    leafCount: leaves.length,
    reportingOrgsCount: reporters.size,
    pactHistoryStart,
    domainRegisteredAt: domainRegisteredAt ? new Date(domainRegisteredAt) : null,
  });

  const { data: rootRow } = await supabase
    .from('merkle_roots')
    .select('root_hash, leaf_count, anchor_type')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const latestRoot = byteaToHex(rootRow?.root_hash);
  const computedRoot = merkleContext?.root ?? null;
  const rootMatchesPublished =
    latestRoot !== null && computedRoot !== null && latestRoot === computedRoot;

  const lastIngestedAt = latestTimestamp(leaves.map((l) => l.created_at));

  return {
    status: 'live',
    data: {
      domain: normalized,
      connectedSince: domainRow.connected_at ?? null,
      domainRegisteredAt,
      pactHistoryStart: pactHistoryStart.toISOString(),
      trust,
      totalPassCount,
      totalFailCount,
      uniqueReporters: reporters.size,
      passRate,
      latestRoot,
      computedRoot,
      rootMatchesPublished,
      domainLeafCount: leaves.length,
      globalTreeLeafCount: rootRow?.leaf_count ?? merkleContext?.tree.size ?? null,
      anchorType: (rootRow?.anchor_type as 'staging' | 'base') ?? null,
      staging: rootRow?.anchor_type !== 'base',
      lastIngestedAt,
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

        return {
          reporterOrg: leaf.reporter_org,
          periodStart: Number(leaf.period_start),
          periodEnd: Number(leaf.period_end),
          dkimPassCount: Number(leaf.dkim_pass_count),
          dkimFailCount: Number(leaf.dkim_fail_count),
          selectors: leaf.selectors ?? [],
          receivedAt: leaf.created_at ?? null,
          leafIndex: proof.leafIndex,
          leafHash: proof.leafHash,
          merkleProof: proof.proof,
          merkleProofValid: proof.proofValid && rootMatchesPublished,
        };
      }),
    },
  };
}

export { SCORE_ALGORITHM };
