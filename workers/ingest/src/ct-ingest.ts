import {
  certNamesCoverDomain,
  computeCtLeafHash,
  fingerprintFromParts,
  fingerprintFromSha256,
  normalizeDomain,
  unixSecondsFromIso,
} from '@pact/core';
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
  min_entry_timestamp?: string;
  not_before?: string;
  not_after?: string;
  serial_number?: string;
  sha256?: string;
  sha256_cert?: string;
  cert_sha256?: string;
}

export interface CtIngestResult {
  domains: number;
  inserted: number;
  skipped: number;
  errors: string[];
}

function namesOnCert(row: CrtShRow): string[] {
  const blob = `${row.name_value ?? ''}\n${row.common_name ?? ''}`;
  return blob
    .split(/[\s,]+/)
    .map((name) => name.trim().toLowerCase().replace(/\.$/, ''))
    .filter(Boolean);
}

function loggedAtIso(row: CrtShRow): string | undefined {
  return row.min_entry_timestamp ?? row.entry_timestamp;
}

function toFingerprint(row: CrtShRow, notBefore: bigint): `0x${string}` {
  return (
    fingerprintFromSha256(row.sha256) ??
    fingerprintFromSha256(row.sha256_cert) ??
    fingerprintFromSha256(row.cert_sha256) ??
    fingerprintFromParts(row.serial_number ?? String(row.id ?? ''), row.issuer_name ?? '', notBefore)
  );
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

export async function ingestCtForDomain(
  db: D1Database,
  domain: string,
): Promise<{ inserted: number; skipped: number }> {
  const normalized = normalizeDomain(domain);
  const rows = await fetchCrtSh(normalized);
  const matching = rows
    .filter((row) => certNamesCoverDomain(namesOnCert(row), normalized))
    .sort((a, b) => (unixSecondsFromIso(loggedAtIso(a)) ?? 0) - (unixSecondsFromIso(loggedAtIso(b)) ?? 0));

  let inserted = 0;
  let skipped = 0;
  for (const row of matching) {
    if (inserted >= MAX_NEW_CERTS_PER_DOMAIN) break;
    const notBefore = unixSecondsFromIso(row.not_before);
    const notAfter = unixSecondsFromIso(row.not_after);
    const loggedAt = unixSecondsFromIso(loggedAtIso(row)) ?? notBefore;
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
      // Leave ct_synced_at untouched so a downed index is retried next cron.
    }
  }
  return result;
}
