/** Canonical app paths — use these instead of string literals. */
export const routes = {
  home: '/',
  connect: '/connect',
  // `/records` 308'd to `/` while v2 was on the apex; browsers still cache that.
  records: '/public-records',
  record: (domain: string) => `/records/${encodeURIComponent(domain)}`,
  badge: (domain: string) => `/badge/${encodeURIComponent(domain)}`,
  docs: '/docs',
  docsWhy: '/docs/why',
  docsWhitepaper: '/docs/whitepaper',
  docsRoadmap: '/docs/roadmap',
  terms: '/terms',
  privacy: '/privacy',
} as const;

export function isRecordsNav(pathname: string): boolean {
  return (
    pathname === routes.records ||
    pathname === '/records' ||
    pathname.startsWith('/records/')
  );
}

export const PROTOCOL_SPEC_URL =
  'https://github.com/pbm-labs/pact/blob/main/docs/pact_protocol.md';

export const EXAMPLE_SCORING_URL =
  'https://github.com/pbm-labs/pact/blob/main/docs/examples/scoring.md';
