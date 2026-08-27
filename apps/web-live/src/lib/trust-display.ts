import type { Dictionary } from '@/lib/i18n';

export function formatVerifiedDays(pactAgeDays: number, t: Dictionary['domain']): string {
  const days = Math.max(0, Math.floor(pactAgeDays));
  if (days === 0) return t.firstDay;
  if (days === 1) return t.dayOne;
  return t.days.replace('{n}', String(days));
}
