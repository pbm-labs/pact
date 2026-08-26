/** Canonical app paths — use these instead of string literals. */
export const routes = {
  home: '/',
  connect: '/connect',
  records: '/records',
  record: (domain: string) => `/records/${encodeURIComponent(domain)}`,
  whitepaper: '/whitepaper',
  terms: '/terms',
  privacy: '/privacy',
} as const;
