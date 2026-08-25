/** Canonical app paths — use these instead of string literals. */
export const routes = {
  home: '/',
  landingV2: '/landing-v2',
  connect: '/connect',
  records: '/records',
  record: (domain: string) => `/records/${encodeURIComponent(domain)}`,
  badge: (domain: string) => `/badge/${encodeURIComponent(domain)}`,
  whitepaper: '/whitepaper',
  terms: '/terms',
  privacy: '/privacy',
} as const;
