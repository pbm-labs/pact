/**
 * Resolves a domain's public registration date via RDAP.
 * Called once at connection time — not on every report.
 * Returns null if lookup fails; callers must omit rather than guess.
 */

const IANA_BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json';
const RDAP_FETCH_TIMEOUT_MS = 10_000;
const RDAP_RETRIES = 2;

/** TLDs missing from IANA bootstrap — registry RDAP bases. */
const REGISTRY_RDAP_FALLBACKS: Record<string, string[]> = {
  me: ['https://rdap.identitydigital.services/rdap/'],
};

type RdapBootstrapService = { tlds: string[]; urls: string[] };

let bootstrapCache: RdapBootstrapService[] | null = null;

function normalizeDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/\.$/, '');
}

function tldCandidates(domain: string): string[] {
  const labels = domain.split('.');
  const candidates: string[] = [];
  for (let i = 1; i < labels.length; i++) {
    candidates.push(labels.slice(i).join('.'));
  }
  return candidates;
}

function buildDomainUrl(base: string, domain: string): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}domain/${encodeURIComponent(domain)}`;
}

async function getIanaBootstrap(): Promise<RdapBootstrapService[]> {
  if (bootstrapCache) return bootstrapCache;
  try {
    const res = await fetch(IANA_BOOTSTRAP_URL, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(RDAP_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { services: [string[], string[]][] };
    bootstrapCache = data.services.map(([tlds, urls]) => ({ tlds, urls }));
    return bootstrapCache;
  } catch {
    return [];
  }
}

async function rdapQueryUrls(domain: string): Promise<string[]> {
  const normalized = normalizeDomain(domain);
  const urls: string[] = [`https://rdap.org/domain/${encodeURIComponent(normalized)}`];
  const seen = new Set<string>(urls);

  const bootstrap = await getIanaBootstrap();
  for (const candidate of tldCandidates(normalized)) {
    for (const service of bootstrap) {
      if (!service.tlds.includes(candidate)) continue;
      for (const base of service.urls) {
        const url = buildDomainUrl(base, normalized);
        if (!seen.has(url)) {
          seen.add(url);
          urls.push(url);
        }
      }
      break;
    }

    for (const base of REGISTRY_RDAP_FALLBACKS[candidate] ?? []) {
      const url = buildDomainUrl(base, normalized);
      if (!seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }
  }

  return urls;
}

function parseRegistrationDate(data: {
  events?: { eventAction: string; eventDate?: string }[];
}): number | null {
  const registrationEvent = data.events?.find((e) => e.eventAction === 'registration');
  if (!registrationEvent?.eventDate) return null;
  const ms = new Date(registrationEvent.eventDate).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRegistrationFromUrl(
  url: string,
): Promise<{ result: number | null; retryable: boolean }> {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/rdap+json, application/json' },
      redirect: 'follow',
      signal: AbortSignal.timeout(RDAP_FETCH_TIMEOUT_MS),
    });
    if (res.status === 429 || res.status >= 500) {
      return { result: null, retryable: true };
    }
    if (!res.ok) {
      return { result: null, retryable: false };
    }

    const data = (await res.json()) as { events?: { eventAction: string; eventDate?: string }[] };
    const result = parseRegistrationDate(data);
    return { result, retryable: false };
  } catch {
    return { result: null, retryable: true };
  }
}

async function tryRdapUrl(url: string): Promise<number | null> {
  for (let attempt = 0; attempt <= RDAP_RETRIES; attempt++) {
    const { result, retryable } = await fetchRegistrationFromUrl(url);
    if (result != null) return result;
    if (!retryable) return null;
    if (attempt < RDAP_RETRIES) await sleep(400 * (attempt + 1));
  }
  return null;
}

export async function resolveDomainRegisteredAt(domain: string): Promise<number | null> {
  const normalized = normalizeDomain(domain);
  if (!normalized.includes('.')) return null;

  const urls = await rdapQueryUrls(normalized);
  for (const url of urls) {
    const result = await tryRdapUrl(url);
    if (result != null) return result;
  }
  return null;
}
