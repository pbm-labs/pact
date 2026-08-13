/** Canonical app paths — use these instead of string literals. */
export const routes = {
  home: '/',
  connect: '/connect',
  records: '/records',
  record: (domain: string) => `/records/${encodeURIComponent(domain)}`,
  badge: (domain: string) => `/badge/${encodeURIComponent(domain)}`,
  docs: '/docs',
  docsWhy: '/docs/why',
  docsWhitepaper: '/docs/whitepaper',
  docsRoadmap: '/docs/roadmap',
  terms: '/terms',
  privacy: '/privacy',
} as const;

/** Legacy paths kept only for redirects / inbound links. */
export const legacyRoutes = {
  howItWorks: '/how-it-works',
  domains: '/domains',
  domain: (domain: string) => `/domain/${encodeURIComponent(domain)}`,
  whyPact: '/why-pact',
  whitepaper: '/whitepaper',
  roadmap: '/roadmap',
} as const;
