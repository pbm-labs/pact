import { computeTrustScore, normalizeDomain } from '@pact/core';
import { fetchLedgerDomain } from '@/lib/ledger';

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

export async function resolveSnapshot(domain: string): Promise<BadgeSnapshot> {
  try {
    const normalized = normalizeDomain(domain);
    const payload = await fetchLedgerDomain(normalized);
    if (!payload) {
      return snapshotFromRecord({ found: false, leafCount: 0 });
    }

    const leaves = payload.leaves;
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
        : new Date(payload.domain.connected_at);

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
