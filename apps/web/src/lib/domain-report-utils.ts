export function formatReportPeriod(start: number, end: number): string {
  const fmt = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function reporterLabel(org: string): string {
  if (org === 'google.com') return 'Google';
  if (org === 'outlook.com') return 'Microsoft';
  return org;
}
