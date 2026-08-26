import {
  REKOR_PUBLIC_LOG,
  computeRekorLeafHash,
  leftoverRekorSubjects,
  normalizeDomain,
  parseRekorLogEntry,
  parseRekorUuidList,
} from '@pact/core';
import { insertRekorEntry, listDomainsDueForRekor, markRekorSynced } from './ledger.js';

const REKOR_API = 'https://rekor.sigstore.dev';
const INDEX_UA = 'pact-ingest/0.4 (https://webuildreal.dev)';
const MAX_DOMAINS_PER_RUN = 4;
const MAX_NEW_PER_DOMAIN = 40;
const MAX_UUIDS_PER_SUBJECT = 40;

export interface RekorIngestResult {
  domains: number;
  inserted: number;
  skipped: number;
  errors: string[];
}

function logIndexNumber(value: bigint): number {
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : 0;
}

async function rekorJson(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${REKOR_API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'User-Agent': INDEX_UA,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`rekor ${res.status} ${path}`);
  }
  return res.json();
}

async function searchSubject(subject: string): Promise<string[]> {
  const body = await rekorJson('/api/v1/index/retrieve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject }),
  });
  return parseRekorUuidList(body).slice(0, MAX_UUIDS_PER_SUBJECT);
}

async function fetchEntry(uuid: string, identity: string, domain: string) {
  const raw = await rekorJson(`/api/v1/log/entries/${uuid}`);
  return parseRekorLogEntry(raw, identity, domain, REKOR_PUBLIC_LOG);
}

export async function ingestRekorForDomain(
  db: D1Database,
  domain: string,
): Promise<{ inserted: number; skipped: number }> {
  const normalized = normalizeDomain(domain);
  const seen = new Set<string>();
  let inserted = 0;
  let skipped = 0;

  for (const subject of leftoverRekorSubjects(normalized)) {
    if (inserted >= MAX_NEW_PER_DOMAIN) break;
    let uuids: string[] = [];
    try {
      uuids = await searchSubject(subject);
    } catch (err) {
      console.log(
        JSON.stringify({
          event: 'rekor_search_failed',
          domain: normalized,
          subject,
          error: String(err),
        }),
      );
      continue;
    }
    for (const uuid of uuids) {
      if (inserted >= MAX_NEW_PER_DOMAIN) break;
      if (seen.has(uuid)) {
        skipped += 1;
        continue;
      }
      seen.add(uuid);
      try {
        const entry = await fetchEntry(uuid, subject, normalized);
        if (!entry) {
          skipped += 1;
          continue;
        }
        const logIndex = logIndexNumber(entry.logIndex);
        const leafHash = computeRekorLeafHash({
          domain: normalized,
          uuid: entry.uuid,
          identity: entry.identity,
          integratedTime: BigInt(entry.integratedTime),
          logId: entry.logId,
          logIndex: BigInt(logIndex),
        });
        const index = await insertRekorEntry(db, {
          domain: normalized,
          uuid: entry.uuid,
          leafHash,
          logId: entry.logId,
          logIndex,
          integratedTime: entry.integratedTime,
          identity: entry.identity,
          entryKind: entry.entryKind,
        });
        if (index == null) skipped += 1;
        else inserted += 1;
      } catch (err) {
        skipped += 1;
        console.log(
          JSON.stringify({
            event: 'rekor_entry_failed',
            domain: normalized,
            uuid,
            error: String(err),
          }),
        );
      }
    }
  }

  await markRekorSynced(db, normalized);
  console.log(JSON.stringify({ event: 'rekor_ingest_domain', domain: normalized, inserted, skipped }));
  return { inserted, skipped };
}

export async function ingestRekorBatch(db: D1Database): Promise<RekorIngestResult> {
  const result: RekorIngestResult = { domains: 0, inserted: 0, skipped: 0, errors: [] };
  const domains = await listDomainsDueForRekor(db, MAX_DOMAINS_PER_RUN);
  for (const domain of domains) {
    result.domains += 1;
    try {
      const row = await ingestRekorForDomain(db, domain);
      result.inserted += row.inserted;
      result.skipped += row.skipped;
    } catch (err) {
      result.errors.push(`${domain}: ${String(err)}`);
    }
  }
  return result;
}
