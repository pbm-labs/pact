/** Human-readable relative time for live feeds (e.g. "3h ago", "Jun 23"). */
export function formatRelativeTime(
  iso: string,
  locale = 'en',
  now = Date.now(),
): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';

  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'second');

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'always' }).format(-diffMin, 'minute');
  }

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'always' }).format(-diffHr, 'hour');
  }

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'always' }).format(-diffDay, 'day');
  }

  return new Date(iso).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: diffDay > 365 ? 'numeric' : undefined,
  });
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

type ClockLabels = {
  clockUnknown: string;
  clockDay1: string;
  clockYear: string;
  clockYears: string;
  clockMonths: string;
  clockDaysShort: string;
};

/** Display label for public domain registration date (Section 4.2). */
export function formatDomainRegisteredAt(
  iso: string | null | undefined,
  locale: string,
  labels: ClockLabels,
  now = Date.now(),
): string {
  if (!iso) return labels.clockUnknown;

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return labels.clockUnknown;

  const year = new Date(iso).getFullYear();
  const ageYears = Math.floor((now - then) / (365.25 * 24 * 60 * 60 * 1000));
  if (ageYears >= 1) {
    const suffix = (ageYears === 1 ? labels.clockYear : labels.clockYears).replace(
      '{n}',
      String(ageYears),
    );
    return `${year} ${suffix}`;
  }
  return new Date(iso).toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}

/** Display label for PACT-history start (first verified report). */
export function formatPactHistoryStart(
  iso: string | null | undefined,
  locale: string,
  labels: ClockLabels,
  now = Date.now(),
): string {
  if (!iso) return '—';

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';

  const ageDays = Math.floor((now - then) / (24 * 60 * 60 * 1000));
  const absolute = new Date(iso).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (ageDays <= 0) return `${absolute} ${labels.clockDay1}`;
  if (ageDays < 30) {
    return `${absolute} ${labels.clockDaysShort.replace('{n}', String(ageDays))}`;
  }
  if (ageDays < 365) {
    return `${absolute} ${labels.clockMonths.replace('{n}', String(Math.floor(ageDays / 30)))}`;
  }
  return `${absolute} ${labels.clockYears.replace('{n}', String(Math.floor(ageDays / 365.25)))}`;
}
