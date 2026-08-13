// Pure helpers for the badge route — no Next.js, no next/og.
// The route file stays a thin shell around `resolveSnapshot()` plus
// the SVG/PNG rendering.

import { createClient } from '@supabase/supabase-js';
import { computeTrustScore, normalizeDomain } from '@pact/core';
import { fetchAllRows } from '@/lib/supabase-fetch-all';

export type BadgeState = 'verified' | 'building';

export interface BadgeSnapshot {
  state: BadgeState;
  count: number;
}

export function parsePreviewState(value: string | null): BadgeState | null {
  if (value === 'verified' || value === 'proven') return 'verified';
  if (value === 'building') return 'building';
  return null;
}

export function snapshotFromRecord(input: {
  found: boolean;
  leafCount: number;
  status?: 'provisional' | 'activated';
}): BadgeSnapshot {
  if (!input.found || input.leafCount <= 0) {
    return { state: 'building', count: 0 };
  }
  return {
    state: input.status === 'activated' ? 'verified' : 'building',
    count: input.leafCount,
  };
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  if (!url) return null;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!key) return null;
  return createClient(url, key);
}

// Resolves a domain to the rendered badge state. Mirrors the public
// record page: activated trust → Proven, everything else → Building.
// Fails closed (building, count 0) on any DB error so a flaky
// connection never renders a spuriously proven badge.
export async function resolveSnapshot(domain: string): Promise<BadgeSnapshot> {
  try {
    const supabase = getSupabase();
    if (!supabase) return { state: 'building', count: 0 };

    const normalized = normalizeDomain(domain);
    const { data: domainRow, error: domainError } = await supabase
      .from('domains')
      .select('connected_at')
      .eq('domain', normalized)
      .maybeSingle();

    if (domainError || !domainRow) {
      return snapshotFromRecord({ found: false, leafCount: 0 });
    }

    const leaves = await fetchAllRows<{
      dkim_pass_count: number;
      reporter_org: string;
      period_start: number;
    }>((from, to) =>
      supabase
        .from('leaves')
        .select('dkim_pass_count, reporter_org, period_start')
        .eq('domain', normalized)
        .range(from, to),
    );

    if (!leaves.length) {
      return snapshotFromRecord({ found: true, leafCount: 0 });
    }

    const totalPassCount = leaves.reduce((s, l) => s + Number(l.dkim_pass_count), 0);
    const reporters = new Set(leaves.map((l) => l.reporter_org));
    const earliest = leaves.reduce((min, l) => {
      const t = Number(l.period_start) * 1000;
      return t < min ? t : min;
    }, Number.POSITIVE_INFINITY);
    const pactHistoryStart =
      earliest !== Number.POSITIVE_INFINITY
        ? new Date(earliest)
        : new Date(domainRow.connected_at);

    const trust = computeTrustScore({
      totalPassCount,
      leafCount: leaves.length,
      reportingOrgsCount: reporters.size,
      pactHistoryStart,
    });

    return snapshotFromRecord({
      found: true,
      leafCount: leaves.length,
      status: trust.status,
    });
  } catch {
    return { state: 'building', count: 0 };
  }
}
