import { computeCtLeafHash, fingerprintFromParts, normalizeDomain } from '@pact/core';
import { insertCtCert, listDomainsDueForCt, markCtSynced } from './ledger.js';

/** crt.sh is a public index over CT logs, not a log operator. Stored as log_id; crt.sh `id` is log_index. */
const CRT_SH = 'https://crt.sh';
const LOG_ID = 'crt.sh';
const MAX_DOMAINS_PER_RUN = 4;
const MAX_NEW_CERTS_PER_DOMAIN = 40;

interface CrtShRow {
  id?: number;
  issuer_name?: string;
  common_name?: string;
  name_value?: string;
  entry_timestamp?: string;
  not_before?: string;
  not_after?: string;
  serial_number?: string;
  sha256?: string;
}

export interface CtIngestResult {
  domains: number;
  inserted: number;
  skipped: number;
  errors: string[];
}

function unixFromIso(value: string | undefined): number | null {
  if (!value) return null;
  const ms = Date.parse(value.replace(' ', 'T') + (value.includes('Z') || value.includes('+') ? '' : 'Z'));
  if (!Number.isFinite(ms)) return null;
  return Math.floor(ms / 1000);
}

function namesOnCert(row: CrtShRow): string[] {
  const blob = `${row.name_value ?? ''}\n${row.common_name ?? ''}`;
  return blob
    .split(/[\s,]+/)
    .map((name) => name.trim().toLowerCase().replace(/\.$/, ''))
    .filter(Boolean);
}

function certCoversDomain(row: CrtShRow, domain: string): boolean {
  const target = domain.toLowerCase();
  return namesOnCert(row).some((name) => {
    if (name === target) return true;
    if (name.startsWith('*.')) {
      const base = name.slice(2);
      return target === base || target.endsWith(`.${base}`);
    }
    return false;
  });
}

export async function fetchCrtSh(domain: string): Promise<CrtShRow[]> {
  const url = `${CRT_SH}/?q=${encodeURIComponent(domain)}&output=json`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'pact-ingest/0.3 (https://webuildreal.dev)',
    },
  });
  if (!res.ok) {
    throw new Error(`crt.sh ${res.status}`);
  }
  const body = await res.json();
  return Array.isArray(body) ? (body as CrtShRow[]) : [];
}

function toFingerprint(row: CrtShRow, notBefore: bigint): `0x${string}` {
  const sha = (row.sha256 ?? '').trim().toLowerCase().replace(/^0x/, '');
  if (/^[0-9a-f]{64}$/.test(sha)) return `0x${sha}`;
  return fingerprintFromParts(row.serial_number ?? String(row.id ?? ''), row.issuer_name ?? '', notBefore);
}

export async function ingestCtForDomain(db: D1Database, domain: string): Promise<{ inserted: number; skipped: number }> {
  const normalized = normalizeDomain(domain);
  const rows = await fetchCrtSh(normalized);
  const matching = rows
    .filter((row) => certCoversDomain(row, normalized))
    .sort((a, b) => (unixFromIso(a.entry_timestamp) ?? 0) - (unixFromIso(b.entry_timestamp) ?? 0));

  let inserted = 0;
  let skipped = 0;
  for (const row of matching) {
    if (inserted >= MAX_NEW_CERTS_PER_DOMAIN) break;
    const notBefore = unixFromIso(row.not_before);
    const notAfter = unixFromIso(row.not_after);
    const loggedAt = unixFromIso(row.entry_timestamp) ?? notBefore;
    if (notBefore == null || notAfter == null || loggedAt == null) {
      skipped += 1;
      continue;
    }
    const fingerprint = toFingerprint(row, BigInt(notBefore));
    const leafHash = computeCtLeafHash({
      domain: normalized,
      fingerprint,
      loggedAt: BigInt(loggedAt),
      notBefore: BigInt(notBefore),
      notAfter: BigInt(notAfter),
      logId: LOG_ID,
      logIndex: BigInt(row.id ?? 0),
    });
    const index = await insertCtCert(db, {
      domain: normalized,
      fingerprint,
      leafHash,
      logId: LOG_ID,
      logIndex: Number(row.id ?? 0),
      loggedAt,
      notBefore,
      notAfter,
      issuer: row.issuer_name ?? '',
      commonName: row.common_name ?? '',
    });
    if (index == null) skipped += 1;
    else inserted += 1;
  }
  await markCtSynced(db, normalized);
  return { inserted, skipped };
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
      try {
        await markCtSynced(db, domain);
      } catch {
        /* still rotate so one failure does not stick the queue */
      }
    }
  }
  return result;
}
