/** Canonical app paths — use these instead of string literals. */
export const LEDGER_ORIGIN = 'https://ledger.webuildreal.dev';

export const routes = {
  home: '/',
  connect: '/connect',
  whitepaper: '/whitepaper',
  terms: '/terms',
  privacy: '/privacy',
  ledger: LEDGER_ORIGIN,
  ledgerKinds: `${LEDGER_ORIGIN}/v1/kinds`,
  ledgerEvidence: `${LEDGER_ORIGIN}/v1/evidence`,
} as const;

export function connectDonePath(domain: string): string {
  return `${routes.connect}?done=1&domain=${encodeURIComponent(domain)}`;
}

export function recordsPath(domain: string): string {
  return `/records/${encodeURIComponent(domain)}`;
}
