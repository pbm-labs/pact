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

/** Calendar day for connect — no age suffix (history days live in the History column). */
export function formatAbsoluteDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  return new Date(iso).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Display label for independently confirmed history (starts at connect). */
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
