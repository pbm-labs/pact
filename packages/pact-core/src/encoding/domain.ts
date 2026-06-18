import { toASCII } from 'node:punycode';

/** Normalize domain per v0.2 Appendix C.1 */
export function normalizeDomain(domain: string): string {
  const trimmed = domain.trim().toLowerCase().replace(/\.$/, '');
  if (!trimmed) return trimmed;

  return trimmed
    .split('.')
    .map((label) => {
      if (label.startsWith('xn--')) return label;
      try {
        const ascii = toASCII(label);
        return ascii.startsWith('xn--') ? ascii : label;
      } catch {
        return label;
      }
    })
    .join('.');
}

/** Normalize reporter org_name: lowercase trimmed */
export function normalizeReporter(orgName: string): string {
  return orgName.trim().toLowerCase();
}
