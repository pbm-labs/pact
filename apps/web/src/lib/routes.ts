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

export const EVIDENCE_KINDS = ['mail', 'ct', 'rekor'] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

export function ledgerEvidenceUrl(kind: EvidenceKind, identity: string): string {
  const url = new URL(routes.ledgerEvidence);
  url.searchParams.set('kind', kind);
  url.searchParams.set('identity', identity.trim());
  return url.toString();
}

export function ledgerLeafUrl(hash: string): string {
  const hex = hash.trim().toLowerCase().replace(/^0x/, '');
  return `${LEDGER_ORIGIN}/v1/leaves/${hex}`;
}

export function connectDonePath(domain: string): string {
  return `${routes.connect}?done=1&domain=${encodeURIComponent(domain)}`;
}
