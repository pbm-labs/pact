import {
  REKOR_PUBLIC_LOG,
  computeRekorLeafHash,
  canonicalRekorIdentity,
  parseRekorLogEntry,
  parseRekorUuidList,
  rekorSearchSubjects,
} from '@pact/core';
import {
  insertRekorEntry,
  listRekorSubjectsDue,
  markRekorSubjectSynced,
  upsertRekorSubject,
} from './ledger.js';

const REKOR_API = 'https://rekor.sigstore.dev';
const INDEX_UA = 'pact-ingest/0.4 (https://webuildreal.dev)';
const MAX_IDENTITIES_PER_RUN = 4;
const MAX_NEW_PER_IDENTITY = 40;
const MAX_UUIDS_PER_SUBJECT = 40;

export interface RekorIngestResult {
  identities: number;
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

async function fetchEntry(uuid: string, identity: string) {
  const raw = await rekorJson(`/api/v1/log/entries/${uuid}`);
  return parseRekorLogEntry(raw, identity, REKOR_PUBLIC_LOG);
}

export async function ingestRekorForIdentity(
  db: D1Database,
  rawIdentity: string,
): Promise<{ identity: string; inserted: number; skipped: number }> {
  const identity = canonicalRekorIdentity(rawIdentity);
  if (!identity) {
    throw new Error('invalid_rekor_identity');
  }
  await upsertRekorSubject(db, identity);

  const seen = new Set<string>();
  let inserted = 0;
  let skipped = 0;

  for (const subject of rekorSearchSubjects(identity)) {
    if (inserted >= MAX_NEW_PER_IDENTITY) break;
    let uuids: string[] = [];
    try {
      uuids = await searchSubject(subject);
    } catch (err) {
      console.log(
        JSON.stringify({
          event: 'rekor_search_failed',
          identity,
          subject,
          error: String(err),
        }),
      );
      continue;
    }
    for (const uuid of uuids) {
      if (inserted >= MAX_NEW_PER_IDENTITY) break;
      if (seen.has(uuid)) {
        skipped += 1;
        continue;
      }
      seen.add(uuid);
      try {
        const entry = await fetchEntry(uuid, identity);
        if (!entry) {
          skipped += 1;
          continue;
        }
        const logIndex = logIndexNumber(entry.logIndex);
        const leafHash = computeRekorLeafHash({
          uuid: entry.uuid,
          identity,
          integratedTime: BigInt(entry.integratedTime),
          logId: entry.logId,
          logIndex: BigInt(logIndex),
        });
        const index = await insertRekorEntry(db, {
          identity,
          uuid: entry.uuid,
          leafHash,
          logId: entry.logId,
          logIndex,
          integratedTime: entry.integratedTime,
          entryKind: entry.entryKind,
        });
        if (index == null) skipped += 1;
        else inserted += 1;
      } catch (err) {
        skipped += 1;
        console.log(
          JSON.stringify({
            event: 'rekor_entry_failed',
            identity,
            uuid,
            error: String(err),
          }),
        );
      }
    }
  }

  await markRekorSubjectSynced(db, identity);
  console.log(JSON.stringify({ event: 'rekor_ingest_identity', identity, inserted, skipped }));
  return { identity, inserted, skipped };
}

/** Host leftover for a connected name. Does not bind GitHub leftover to that domain. */
export async function ingestRekorForDomain(db: D1Database, domain: string) {
  return ingestRekorForIdentity(db, domain);
}

export async function ingestRekorBatch(db: D1Database): Promise<RekorIngestResult> {
  const result: RekorIngestResult = { identities: 0, inserted: 0, skipped: 0, errors: [] };
  const identities = await listRekorSubjectsDue(db, MAX_IDENTITIES_PER_RUN);
  for (const identity of identities) {
    result.identities += 1;
    try {
      const row = await ingestRekorForIdentity(db, identity);
      result.inserted += row.inserted;
      result.skipped += row.skipped;
    } catch (err) {
      result.errors.push(`${identity}: ${String(err)}`);
    }
  }
  return result;
}
