export function formatReportPeriod(start: number, end: number, locale?: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const fmt = (ts: number) => new Date(ts * 1000).toLocaleDateString(locale, opts);
  return `${fmt(start)} – ${fmt(end)}`;
}

export function reporterLabel(org: string): string {
  if (org === 'google.com') return 'Google';
  if (org === 'outlook.com') return 'Microsoft';
  return org;
}
