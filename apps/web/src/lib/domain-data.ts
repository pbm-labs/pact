import { createClient } from '@supabase/supabase-js';
import { computeTrustScore, normalizeDomain, SCORE_ALGORITHM, byteaToHex } from '@pact/core';

export interface DomainLiveData {
  domain: string;
  connectedSince: string | null;
  trust: ReturnType<typeof computeTrustScore>;
  totalPassCount: number;
  totalFailCount: number;
  uniqueReporters: number;
  passRate: number;
  latestRoot: string | null;
  domainLeafCount: number;
  globalTreeLeafCount: number | null;
  anchorType: 'staging' | 'base' | null;
  staging: boolean;
}

export interface DomainWaitingData {
  domain: string;
  connectedSince: string | null;
}

export type DomainPageState =
  | { status: 'live'; data: DomainLiveData }
  | { status: 'waiting'; data: DomainWaitingData }
  | null;

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  if (!url) return null;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!key) return null;
  return createClient(url, key);
}

export async function fetchRegisteredDomains(): Promise<string[]> {
  const summaries = await fetchDomainSummaries();
  return summaries.map((s) => s.domain);
}

export interface DomainSummary {
  domain: string;
  connectedSince: string | null;
  status: 'waiting' | 'live';
  trustScore?: number;
  trustStatus?: 'provisional' | 'activated';
  leafCount?: number;
  passRate?: number;
}

export async function fetchDomainSummaries(): Promise<DomainSummary[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: domainRows, error: domainError } = await supabase
    .from('domains')
    .select('domain, connected_at')
    .order('domain', { ascending: true });

  if (domainError || !domainRows?.length) return [];

  const { data: leaves, error: leavesError } = await supabase
    .from('leaves')
    .select('domain, dkim_pass_count, dkim_fail_count, reporter_org, period_start');

  if (leavesError) return [];

  const leavesByDomain = new Map<string, typeof leaves>();
  for (const leaf of leaves ?? []) {
    const list = leavesByDomain.get(leaf.domain) ?? [];
    list.push(leaf);
    leavesByDomain.set(leaf.domain, list);
  }

  return domainRows.map((row) => {
    const domainLeaves = leavesByDomain.get(row.domain) ?? [];
    if (!domainLeaves.length) {
      return {
        domain: row.domain,
        connectedSince: row.connected_at,
        status: 'waiting' as const,
      };
    }

    const totalPassCount = domainLeaves.reduce((s, l) => s + Number(l.dkim_pass_count), 0);
    const totalFailCount = domainLeaves.reduce((s, l) => s + Number(l.dkim_fail_count), 0);
    const reporters = new Set(domainLeaves.map((l) => l.reporter_org));
    const total = totalPassCount + totalFailCount;
    const passRate = total > 0 ? (totalPassCount / total) * 100 : 0;

    const earliest = domainLeaves.reduce((min, l) => {
      const t = Number(l.period_start) * 1000;
      return t < min ? t : min;
    }, Number.POSITIVE_INFINITY);

    const firstReportTime =
      earliest !== Number.POSITIVE_INFINITY
        ? new Date(earliest)
        : row.connected_at
          ? new Date(row.connected_at)
          : new Date();

    const trust = computeTrustScore({
      totalPassCount,
      uniqueReporterCount: reporters.size,
      firstReportTime,
    });

    return {
      domain: row.domain,
      connectedSince: row.connected_at,
      status: 'live' as const,
      trustScore: trust.score,
      trustStatus: trust.status,
      leafCount: domainLeaves.length,
      passRate,
    };
  });
}

export async function fetchDomainPageState(domain: string): Promise<DomainPageState> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const normalized = normalizeDomain(domain);

  const { data: domainRow, error: domainError } = await supabase
    .from('domains')
    .select('connected_at')
    .eq('domain', normalized)
    .maybeSingle();

  if (domainError) return null;

  const { data: leaves, error: leavesError } = await supabase
    .from('leaves')
    .select('dkim_pass_count, dkim_fail_count, reporter_org, period_start')
    .eq('domain', normalized);

  if (leavesError) return null;
  if (!leaves?.length && !domainRow) return null;

  if (!leaves?.length) {
    return {
      status: 'waiting',
      data: {
        domain: normalized,
        connectedSince: domainRow!.connected_at,
      },
    };
  }

  const totalPassCount = leaves.reduce((s, l) => s + Number(l.dkim_pass_count), 0);
  const totalFailCount = leaves.reduce((s, l) => s + Number(l.dkim_fail_count), 0);
  const reporters = new Set(leaves.map((l) => l.reporter_org));
  const total = totalPassCount + totalFailCount;
  const passRate = total > 0 ? (totalPassCount / total) * 100 : 0;

  const earliest = leaves.reduce((min, l) => {
    const t = Number(l.period_start) * 1000;
    return t < min ? t : min;
  }, Number.POSITIVE_INFINITY);

  const firstReportTime =
    earliest !== Number.POSITIVE_INFINITY
      ? new Date(earliest)
      : domainRow?.connected_at
        ? new Date(domainRow.connected_at)
        : new Date();

  const trust = computeTrustScore({
    totalPassCount,
    uniqueReporterCount: reporters.size,
    firstReportTime,
  });

  const { data: rootRow } = await supabase
    .from('merkle_roots')
    .select('root_hash, leaf_count, anchor_type')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    status: 'live',
    data: {
      domain: normalized,
      connectedSince: domainRow?.connected_at ?? null,
      trust,
      totalPassCount,
      totalFailCount,
      uniqueReporters: reporters.size,
      passRate,
      latestRoot: byteaToHex(rootRow?.root_hash),
      domainLeafCount: leaves.length,
      globalTreeLeafCount: rootRow?.leaf_count ?? null,
      anchorType: (rootRow?.anchor_type as 'staging' | 'base') ?? null,
      staging: rootRow?.anchor_type !== 'base',
    },
  };
}

export { SCORE_ALGORITHM };
