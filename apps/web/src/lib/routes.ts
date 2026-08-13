/** Canonical app paths — use these instead of string literals. */
export const routes = {
  home: '/',
  v2: '/v2',
  connect: '/connect',
  connectSuccess: '/connect/success',
  records: '/records',
  record: (domain: string) => `/records/${encodeURIComponent(domain)}`,
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
