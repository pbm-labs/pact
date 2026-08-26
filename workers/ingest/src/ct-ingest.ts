import {
  certNamesCoverDomain,
  computeCtLeafHash,
  fingerprintFromParts,
  fingerprintFromSha256,
  normalizeDomain,
  parseCertSpotterJson,
  parseCrtShJson,
  parseLinkRelNext,
  unixSecondsFromIso,
  type CtIndexCert,
} from '@pact/core';
import { insertCtCert, listDomainsDueForCt, markCtSynced } from './ledger.js';

const CRT_SH = 'https://crt.sh';
const CERT_SPOTTER = 'https://api.certspotter.com/v1/issuances';
const INDEX_UA = 'pact-ingest/0.4 (https://webuildreal.dev)';
const MAX_DOMAINS_PER_RUN = 4;
const MAX_NEW_CERTS_PER_DOMAIN = 40;
const MAX_CERTSPOTTER_PAGES = 5;

export interface CtIngestResult {
  domains: number;
  inserted: number;
  skipped: number;
  errors: string[];
}

function toFingerprint(cert: CtIndexCert, notBefore: bigint): `0x${string}` {
  return (
    fingerprintFromSha256(cert.sha256) ??
    fingerprintFromParts(cert.serial ?? cert.logIndex.toString(), cert.issuer, notBefore)
  );
}

function logIndexNumber(value: bigint): number {
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : 0;
}

async function fetchJson(url: string): Promise<{ status: number; body: unknown; link: string | null }> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': INDEX_UA,
    },
  });
  const link = res.headers.get('Link');
  if (!res.ok) {
    throw new Error(`${new URL(url).host} ${res.status}`);
  }
  return { status: res.status, body: await res.json(), link };
}

async function fetchCrtSh(domain: string): Promise<CtIndexCert[]> {
  const url = `${CRT_SH}/?q=${encodeURIComponent(domain)}&output=json`;
  const { body } = await fetchJson(url);
  return parseCrtShJson(body);
}

async function fetchCertSpotter(domain: string): Promise<CtIndexCert[]> {
  const collected: unknown[] = [];
  let url: string | null =
    `${CERT_SPOTTER}?domain=${encodeURIComponent(domain)}&include_subdomains=true&expand=dns_names&expand=issuer`;
  for (let page = 0; page < MAX_CERTSPOTTER_PAGES && url; page += 1) {
    const { body, link } = await fetchJson(url);
    if (!Array.isArray(body)) {
      throw new Error('certspotter: not an array');
    }
    collected.push(...body);
    const next = parseLinkRelNext(link);
    url = next ? (next.startsWith('http') ? next : `https://api.certspotter.com${next}`) : null;
  }
  return parseCertSpotterJson(collected);
}

/**
 * Cert Spotter first: crt.sh often 502s Cloudflare Worker user-agents.
 * log_id records which index we actually read.
 */
async function fetchIndexedCerts(domain: string): Promise<{ certs: CtIndexCert[]; source: string }> {
  try {
    const certs = await fetchCertSpotter(domain);
    if (certs.length) return { certs, source: 'certspotter' };
  } catch (err) {
    try {
      const certs = await fetchCrtSh(domain);
      if (certs.length) return { certs, source: 'crt.sh' };
      throw err;
    } catch (crtErr) {
      throw new Error(`ct index: certspotter ${String(err)}; crt.sh ${String(crtErr)}`);
    }
  }
  try {
    const certs = await fetchCrtSh(domain);
    if (certs.length) return { certs, source: 'crt.sh' };
  } catch {
    // Cert Spotter returned a valid empty list.
  }
  return { certs: [], source: 'certspotter' };
}

export async function ingestCtForDomain(
  db: D1Database,
  domain: string,
): Promise<{ inserted: number; skipped: number; source: string }> {
  const normalized = normalizeDomain(domain);
  const { certs, source } = await fetchIndexedCerts(normalized);
  const matching = certs
    .filter((cert) => certNamesCoverDomain(cert.names, normalized))
    .sort(
      (a, b) =>
        (unixSecondsFromIso(a.loggedAtIso) ?? unixSecondsFromIso(a.notBeforeIso) ?? 0) -
        (unixSecondsFromIso(b.loggedAtIso) ?? unixSecondsFromIso(b.notBeforeIso) ?? 0),
    );

  let inserted = 0;
  let skipped = 0;
  for (const cert of matching) {
    if (inserted >= MAX_NEW_CERTS_PER_DOMAIN) break;
    const notBefore = unixSecondsFromIso(cert.notBeforeIso);
    const notAfter = unixSecondsFromIso(cert.notAfterIso);
    const loggedAt = unixSecondsFromIso(cert.loggedAtIso) ?? notBefore;
    if (notBefore == null || notAfter == null || loggedAt == null) {
      skipped += 1;
      continue;
    }
    const fingerprint = toFingerprint(cert, BigInt(notBefore));
    const logIndex = logIndexNumber(cert.logIndex);
    const leafHash = computeCtLeafHash({
      domain: normalized,
      fingerprint,
      loggedAt: BigInt(loggedAt),
      notBefore: BigInt(notBefore),
      notAfter: BigInt(notAfter),
      logId: cert.logId,
      logIndex: BigInt(logIndex),
    });
    const index = await insertCtCert(db, {
      domain: normalized,
      fingerprint,
      leafHash,
      logId: cert.logId,
      logIndex,
      loggedAt,
      notBefore,
      notAfter,
      issuer: cert.issuer,
      commonName: cert.commonName,
    });
    if (index == null) skipped += 1;
    else inserted += 1;
  }
  await markCtSynced(db, normalized);
  console.log(JSON.stringify({ event: 'ct_ingest_domain', domain: normalized, source, inserted, skipped }));
  return { inserted, skipped, source };
}

export async function ingestCtBatch(db: D1Database): Promise<CtIngestResult> {
  const result: CtIngestResult = { domains: 0, inserted: 0, skipped: 0, errors: [] };
  const domains = await listDomainsDueForCt(db, MAX_DOMAINS_PER_RUN);
  for (const domain of domains) {
    result.domains += 1;
    try {
      const row = await ingestCtForDomain(db, domain);
      result.inserted += row.inserted;
      result.skipped += row.skipped;
    } catch (err) {
      result.errors.push(`${domain}: ${String(err)}`);
    }
  }
  return result;
}
