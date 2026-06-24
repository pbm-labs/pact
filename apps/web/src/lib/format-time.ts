/** Human-readable relative time for live feeds (e.g. "3h ago", "Jun 23"). */
export function formatRelativeTime(iso: string, now = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';

  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: diffDay > 365 ? 'numeric' : undefined,
  });
}

export function formatIngestTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';

  const relative = formatRelativeTime(iso);
  const absolute = date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${relative} · ${absolute}`;
}

/** Pick the latest non-null ISO timestamp from a list. */
export function latestTimestamp(timestamps: (string | null | undefined)[]): string | null {
  let latest: string | null = null;
  let latestMs = -Infinity;

  for (const ts of timestamps) {
    if (!ts) continue;
    const ms = new Date(ts).getTime();
    if (Number.isNaN(ms)) continue;
    if (ms > latestMs) {
      latestMs = ms;
      latest = ts;
    }
  }

  return latest;
}

/** Display label for public domain registration date (Section 4.2). */
export function formatDomainRegisteredAt(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return 'Unknown';

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Unknown';

  const year = new Date(iso).getFullYear();
  const ageYears = Math.floor((now - then) / (365.25 * 24 * 60 * 60 * 1000));
  if (ageYears >= 1) return `${year} (${ageYears} yr${ageYears === 1 ? '' : 's'})`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

/** Display label for PACT-history start (first verified report). */
export function formatPactHistoryStart(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return '—';

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';

  const ageDays = Math.floor((now - then) / (24 * 60 * 60 * 1000));
  const absolute = new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (ageDays <= 0) return `${absolute} (Day 1)`;
  if (ageDays < 30) return `${absolute} (${ageDays}d)`;
  if (ageDays < 365) return `${absolute} (${Math.floor(ageDays / 30)} mo)`;
  return `${absolute} (${Math.floor(ageDays / 365.25)} yr)`;
}
