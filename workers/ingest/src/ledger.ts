import { leftoverRekorSubjects, type Hash } from '@pact/core';

export interface DomainRow {
  domain: string;
  connected_at: string;
  domain_registered_at: string | null;
}

export interface LeafRow {
  leaf_index: number;
  leaf_hash: string;
  domain: string;
  period_start: number;
  period_end: number;
  reporter_org: string;
  dkim_pass_count: number;
  dkim_fail_count: number;
  domain_hash: string;
  reporter_hash: string;
  selector_hash: string;
  source_ip_hash: string;
  report_hash: string;
  wrapper_hash: string;
  wrapper_dkim_hash: string;
  selectors: string;
  ip_ranges: string;
  wrapper_hashes: string;
  wrapper_dkim: string;
  created_at: string;
}

const LEAF_TABLES = ['leaves', 'ct_certs', 'rekor_entries'] as const;
let leafTablesCache: string[] | null = null;

async function leafTables(db: D1Database): Promise<string[]> {
  if (leafTablesCache) return leafTablesCache;
  const { results } = await db
    .prepare(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('leaves', 'ct_certs', 'rekor_entries')`,
    )
    .all<{ name: string }>();
  const present = new Set((results ?? []).map((row) => row.name));
  leafTablesCache = LEAF_TABLES.filter((name) => present.has(name));
  if (!leafTablesCache.length) leafTablesCache = ['leaves'];
  return leafTablesCache;
}

function nextLeafIndexExpr(tables: string[]): string {
  const union = tables.map((name) => `SELECT leaf_index FROM ${name}`).join(' UNION ALL ');
  return `COALESCE((SELECT MAX(leaf_index) FROM (${union})), -1) + 1`;
}

async function namedTableExists(db: D1Database, name: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1`)
    .bind(name)
    .first<{ ok: number }>();
  return row != null;
}

async function tableExists(db: D1Database, name: string): Promise<boolean> {
  return namedTableExists(db, name);
}

export interface InsertLeafInput {
  leafHash: Hash;
  domain: string;
  periodStart: number;
  periodEnd: number;
  reporterOrg: string;
  dkimPassCount: number;
  dkimFailCount: number;
  domainHash: Hash;
  reporterHash: Hash;
  selectorHash: Hash;
  sourceIpHash: Hash;
  reportHash: Hash;
  wrapperHash: Hash;
  wrapperDkimHash: Hash;
  selectors: string[];
  ipRanges: string[];
  wrapperHashes: string[];
  wrapperDkim: { domain: string; selector: string }[];
}

export async function findProcessedReport(
  db: D1Database,
  input: {
    reportId: string;
    reporterOrg: string;
    periodStart: number;
    periodEnd: number;
    headerFrom: string;
  },
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT id FROM processed_reports
       WHERE report_id = ? AND reporter_org = ? AND period_start = ? AND period_end = ? AND header_from = ?
       LIMIT 1`,
    )
    .bind(input.reportId, input.reporterOrg, input.periodStart, input.periodEnd, input.headerFrom)
    .first();
  return row != null;
}

export async function insertProcessedReport(
  db: D1Database,
  input: {
    reportId: string;
    reporterOrg: string;
    periodStart: number;
    periodEnd: number;
    headerFrom: string;
    envelopeSender: string;
    dkimDomain?: string | null;
    dkimSelector?: string | null;
    wrapperHash?: string | null;
    wrapperDkim?: { domain: string; selector: string }[] | null;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO processed_reports
        (report_id, reporter_org, period_start, period_end, header_from, envelope_sender, dkim_domain, dkim_selector, wrapper_hash, wrapper_dkim)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      input.reportId,
      input.reporterOrg,
      input.periodStart,
      input.periodEnd,
      input.headerFrom,
      input.envelopeSender,
      input.dkimDomain ?? null,
      input.dkimSelector ?? null,
      input.wrapperHash ?? null,
      JSON.stringify(input.wrapperDkim ?? []),
    )
    .run();
}

export async function loadLeafAggregation(
  db: D1Database,
  key: { domain: string; periodStart: number; periodEnd: number; reporterOrg: string },
): Promise<{
  dkim_pass_count: number;
  dkim_fail_count: number;
  selectors: string[];
  ip_ranges: string[];
  wrapper_hashes: string[];
  wrapper_dkim: { domain: string; selector: string }[];
} | null> {
  const row = await db
    .prepare(
      `SELECT dkim_pass_count, dkim_fail_count, selectors, ip_ranges, wrapper_hashes, wrapper_dkim
       FROM leaves
       WHERE domain = ? AND period_start = ? AND period_end = ? AND reporter_org = ?
       LIMIT 1`,
    )
    .bind(key.domain, key.periodStart, key.periodEnd, key.reporterOrg)
    .first<{
      dkim_pass_count: number;
      dkim_fail_count: number;
      selectors: string;
      ip_ranges: string;
      wrapper_hashes: string | null;
      wrapper_dkim: string | null;
    }>();
  if (!row) return null;
  return {
    dkim_pass_count: row.dkim_pass_count,
    dkim_fail_count: row.dkim_fail_count,
    selectors: parseJsonArray<string>(row.selectors),
    ip_ranges: parseJsonArray<string>(row.ip_ranges),
    wrapper_hashes: parseJsonArray<string>(row.wrapper_hashes),
    wrapper_dkim: parseJsonArray<{ domain: string; selector: string }>(row.wrapper_dkim),
  };
}

export async function upsertLeaf(db: D1Database, input: InsertLeafInput): Promise<number> {
  await db
    .prepare(`INSERT OR IGNORE INTO domains (domain) VALUES (?)`)
    .bind(input.domain)
    .run();

  const existing = await db
    .prepare(
      `SELECT leaf_index FROM leaves
       WHERE domain = ? AND period_start = ? AND period_end = ? AND reporter_org = ?`,
    )
    .bind(input.domain, input.periodStart, input.periodEnd, input.reporterOrg)
    .first<{ leaf_index: number }>();

  const selectors = JSON.stringify(input.selectors);
  const ipRanges = JSON.stringify(input.ipRanges);
  const wrapperHashes = JSON.stringify(input.wrapperHashes);
  const wrapperDkim = JSON.stringify(input.wrapperDkim);

  if (existing) {
    await db
      .prepare(
        `UPDATE leaves SET
          leaf_hash = ?, dkim_pass_count = ?, dkim_fail_count = ?,
          domain_hash = ?, reporter_hash = ?, selector_hash = ?,
          source_ip_hash = ?, report_hash = ?, selectors = ?, ip_ranges = ?,
          wrapper_hash = ?, wrapper_dkim_hash = ?, wrapper_hashes = ?, wrapper_dkim = ?
         WHERE leaf_index = ?`,
      )
      .bind(
        input.leafHash,
        input.dkimPassCount,
        input.dkimFailCount,
        input.domainHash,
        input.reporterHash,
        input.selectorHash,
        input.sourceIpHash,
        input.reportHash,
        selectors,
        ipRanges,
        input.wrapperHash,
        input.wrapperDkimHash,
        wrapperHashes,
        wrapperDkim,
        existing.leaf_index,
      )
      .run();
    return existing.leaf_index;
  }

  const tables = await leafTables(db);
  const inserted = await db
    .prepare(
      `INSERT INTO leaves (
        leaf_index, leaf_hash, domain, period_start, period_end, reporter_org,
        dkim_pass_count, dkim_fail_count, domain_hash, reporter_hash,
        selector_hash, source_ip_hash, report_hash, selectors, ip_ranges,
        wrapper_hash, wrapper_dkim_hash, wrapper_hashes, wrapper_dkim
      ) SELECT ${nextLeafIndexExpr(tables)}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      RETURNING leaf_index`,
    )
    .bind(
      input.leafHash,
      input.domain,
      input.periodStart,
      input.periodEnd,
      input.reporterOrg,
      input.dkimPassCount,
      input.dkimFailCount,
      input.domainHash,
      input.reporterHash,
      input.selectorHash,
      input.sourceIpHash,
      input.reportHash,
      selectors,
      ipRanges,
      input.wrapperHash,
      input.wrapperDkimHash,
      wrapperHashes,
      wrapperDkim,
    )
    .first<{ leaf_index: number }>();
  if (inserted == null) throw new Error('leaf insert failed');
  return inserted.leaf_index;
}

export async function nextLeafIndex(db: D1Database): Promise<number> {
  const tables = await leafTables(db);
  const maxRow = await db
    .prepare(`SELECT (${nextLeafIndexExpr(tables)}) AS max_index`)
    .first<{ max_index: number | null }>();
  return maxRow?.max_index ?? 0;
}

export async function listLeafHashes(db: D1Database): Promise<{ leaf_index: number; leaf_hash: string }[]> {
  const tables = await leafTables(db);
  const union = tables.map((name) => `SELECT leaf_index, leaf_hash FROM ${name}`).join(' UNION ALL ');
  const { results } = await db
    .prepare(
      `SELECT leaf_index, leaf_hash FROM (${union}) ORDER BY leaf_index ASC`,
    )
    .all<{ leaf_index: number; leaf_hash: string }>();
  return results ?? [];
}

export async function getLatestMerkleRoot(db: D1Database): Promise<{
  rootHash: string;
  leafCount: number;
  anchorType: 'staging' | 'base';
  txHash: string | null;
} | null> {
  const row = await db
    .prepare(
      `SELECT root_hash, leaf_count, anchor_type, tx_hash FROM merkle_roots
       ORDER BY id DESC
       LIMIT 1`,
    )
    .first<{
      root_hash: string;
      leaf_count: number;
      anchor_type: 'staging' | 'base';
      tx_hash: string | null;
    }>();
  if (!row) return null;
  return {
    rootHash: row.root_hash,
    leafCount: Number(row.leaf_count),
    anchorType: row.anchor_type,
    txHash: row.tx_hash,
  };
}

export async function getLatestBaseRoot(db: D1Database): Promise<{
  rootHash: string;
  leafCount: number;
  txHash: string | null;
  publishedAt: string;
} | null> {
  const row = await db
    .prepare(
      `SELECT root_hash, leaf_count, tx_hash, published_at FROM merkle_roots
       WHERE anchor_type = 'base'
       ORDER BY id DESC
       LIMIT 1`,
    )
    .first<{
      root_hash: string;
      leaf_count: number;
      tx_hash: string | null;
      published_at: string;
    }>();
  if (!row) return null;
  return {
    rootHash: row.root_hash,
    leafCount: Number(row.leaf_count),
    txHash: row.tx_hash,
    publishedAt: row.published_at,
  };
}

export async function getTxHashForRoot(
  db: D1Database,
  rootHash: string,
): Promise<string | null> {
  const row = await db
    .prepare(
      `SELECT tx_hash FROM merkle_roots
       WHERE tx_hash IS NOT NULL AND tx_hash != ''
         AND lower(root_hash) = lower(?)
       ORDER BY id ASC
       LIMIT 1`,
    )
    .bind(rootHash)
    .first<{ tx_hash: string }>();
  return row?.tx_hash ?? null;
}

export async function insertMerkleRoot(
  db: D1Database,
  input: {
    rootHash: string;
    leafCount: number;
    anchorType: 'staging' | 'base';
    txHash?: string | null;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO merkle_roots (root_hash, leaf_count, anchor_type, tx_hash)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(input.rootHash, input.leafCount, input.anchorType, input.txHash ?? null)
    .run();
}

export async function listDomains(db: D1Database): Promise<DomainRow[]> {
  const { results } = await db
    .prepare(
      `SELECT domain, connected_at, domain_registered_at FROM domains ORDER BY domain ASC`,
    )
    .all<DomainRow>();
  return results ?? [];
}

export async function getDomain(db: D1Database, domain: string): Promise<DomainRow | null> {
  return (
    (await db
      .prepare(
        `SELECT domain, connected_at, domain_registered_at FROM domains WHERE domain = ?`,
      )
      .bind(domain)
      .first<DomainRow>()) ?? null
  );
}

export async function upsertDomain(
  db: D1Database,
  domain: string,
  domainRegisteredAt?: string | null,
): Promise<void> {
  const existing = await getDomain(db, domain);
  if (!existing) {
    await db
      .prepare(`INSERT INTO domains (domain, domain_registered_at) VALUES (?, ?)`)
      .bind(domain, domainRegisteredAt ?? null)
      .run();
    return;
  }
  if (domainRegisteredAt && !existing.domain_registered_at) {
    await db
      .prepare(`UPDATE domains SET domain_registered_at = ? WHERE domain = ?`)
      .bind(domainRegisteredAt, domain)
      .run();
  }
}

export async function listLeavesForDomain(db: D1Database, domain: string): Promise<LeafRow[]> {
  const { results } = await db
    .prepare(`SELECT * FROM leaves WHERE domain = ? ORDER BY period_start DESC`)
    .bind(domain)
    .all<LeafRow>();
  return results ?? [];
}

export async function getLeafByHash(db: D1Database, leafHash: `0x${string}`): Promise<LeafRow | null> {
  const hex = leafHash.slice(2);
  return (
    (await db
      .prepare(`SELECT * FROM leaves WHERE lower(leaf_hash) IN (?, ?) LIMIT 1`)
      .bind(leafHash.toLowerCase(), hex.toLowerCase())
      .first<LeafRow>()) ?? null
  );
}

export interface CtCertRow {
  domain: string;
  fingerprint: string;
  leaf_index: number;
  leaf_hash: string;
  log_id: string;
  log_index: number;
  logged_at: number;
  not_before: number;
  not_after: number;
  issuer: string;
  common_name: string;
  created_at: string;
}

export async function listCtCertsForDomain(db: D1Database, domain: string): Promise<CtCertRow[]> {
  if (!(await tableExists(db, 'ct_certs'))) return [];
  const { results } = await db
    .prepare(`SELECT * FROM ct_certs WHERE domain = ? ORDER BY logged_at ASC`)
    .bind(domain)
    .all<CtCertRow>();
  return results ?? [];
}

export async function getCtCertByHash(db: D1Database, leafHash: `0x${string}`): Promise<CtCertRow | null> {
  const hex = leafHash.slice(2);
  return (
    (await db
      .prepare(`SELECT * FROM ct_certs WHERE lower(leaf_hash) IN (?, ?) LIMIT 1`)
      .bind(leafHash.toLowerCase(), hex.toLowerCase())
      .first<CtCertRow>()) ?? null
  );
}

export async function ctFingerprintExists(
  db: D1Database,
  domain: string,
  fingerprint: string,
): Promise<boolean> {
  const row = await db
    .prepare(`SELECT fingerprint FROM ct_certs WHERE domain = ? AND fingerprint = ? LIMIT 1`)
    .bind(domain, fingerprint)
    .first();
  return row != null;
}

export async function insertCtCert(
  db: D1Database,
  input: {
    domain: string;
    fingerprint: string;
    leafHash: string;
    logId: string;
    logIndex: number;
    loggedAt: number;
    notBefore: number;
    notAfter: number;
    issuer: string;
    commonName: string;
  },
): Promise<number | null> {
  if (await ctFingerprintExists(db, input.domain, input.fingerprint)) return null;
  const tables = await leafTables(db);
  const inserted = await db
    .prepare(
      `INSERT INTO ct_certs (
        domain, fingerprint, leaf_index, leaf_hash, log_id, log_index,
        logged_at, not_before, not_after, issuer, common_name
      ) SELECT ?, ?, ${nextLeafIndexExpr(tables)}, ?, ?, ?, ?, ?, ?, ?, ?
      RETURNING leaf_index`,
    )
    .bind(
      input.domain,
      input.fingerprint,
      input.leafHash,
      input.logId,
      input.logIndex,
      input.loggedAt,
      input.notBefore,
      input.notAfter,
      input.issuer,
      input.commonName,
    )
    .first<{ leaf_index: number }>();
  return inserted?.leaf_index ?? null;
}

export async function listDomainsDueForCt(db: D1Database, limit: number): Promise<string[]> {
  const { results } = await db
    .prepare(
      `SELECT domain FROM domains
       ORDER BY CASE WHEN ct_synced_at IS NULL OR ct_synced_at = '' THEN 0 ELSE 1 END ASC,
                ct_synced_at ASC
       LIMIT ?`,
    )
    .bind(limit)
    .all<{ domain: string }>();
  return (results ?? []).map((row) => row.domain);
}

export async function markCtSynced(db: D1Database, domain: string): Promise<void> {
  await db
    .prepare(`UPDATE domains SET ct_synced_at = datetime('now') WHERE domain = ?`)
    .bind(domain)
    .run();
}

export interface RekorEntryRow {
  identity: string;
  uuid: string;
  leaf_index: number;
  leaf_hash: string;
  log_id: string;
  log_index: number;
  integrated_time: number;
  entry_kind: string;
  created_at: string;
}

export async function listRekorEntriesForIdentity(
  db: D1Database,
  identity: string,
  limit = 80,
): Promise<RekorEntryRow[]> {
  if (!(await tableExists(db, 'rekor_entries'))) return [];
  const { results } = await db
    .prepare(
      `SELECT * FROM rekor_entries WHERE identity = ? ORDER BY integrated_time ASC LIMIT ?`,
    )
    .bind(identity, limit)
    .all<RekorEntryRow>();
  return results ?? [];
}

export async function countRekorEntriesForIdentity(
  db: D1Database,
  identity: string,
): Promise<number> {
  if (!(await tableExists(db, 'rekor_entries'))) return 0;
  const row = await db
    .prepare(`SELECT COUNT(*) AS n FROM rekor_entries WHERE identity = ?`)
    .bind(identity)
    .first<{ n: number }>();
  return Number(row?.n ?? 0);
}

export async function listRekorEntriesForDomain(
  db: D1Database,
  domain: string,
): Promise<(RekorEntryRow & { domain: string; identity: string })[]> {
  if (!(await tableExists(db, 'rekor_entries'))) return [];
  const keys = leftoverRekorSubjects(domain);
  if (!keys.length) return [];
  const placeholders = keys.map(() => '?').join(', ');
  const { results } = await db
    .prepare(
      `SELECT * FROM rekor_entries WHERE identity IN (${placeholders}) ORDER BY integrated_time ASC`,
    )
    .bind(...keys)
    .all<RekorEntryRow>();
  return (results ?? []).map((row) => ({ ...row, domain }));
}

export async function getRekorEntryByHash(
  db: D1Database,
  leafHash: `0x${string}`,
): Promise<RekorEntryRow | null> {
  if (!(await tableExists(db, 'rekor_entries'))) return null;
  const hex = leafHash.slice(2);
  return (
    (await db
      .prepare(`SELECT * FROM rekor_entries WHERE lower(leaf_hash) IN (?, ?) LIMIT 1`)
      .bind(leafHash.toLowerCase(), hex.toLowerCase())
      .first<RekorEntryRow>()) ?? null
  );
}

export async function rekorUuidExists(db: D1Database, uuid: string): Promise<boolean> {
  if (!(await tableExists(db, 'rekor_entries'))) return false;
  const row = await db
    .prepare(`SELECT uuid FROM rekor_entries WHERE uuid = ? LIMIT 1`)
    .bind(uuid)
    .first();
  return row != null;
}

export async function insertRekorEntry(
  db: D1Database,
  input: {
    identity: string;
    uuid: string;
    leafHash: string;
    logId: string;
    logIndex: number;
    integratedTime: number;
    entryKind: string;
  },
): Promise<number | null> {
  if (await rekorUuidExists(db, input.uuid)) return null;
  if (leafTablesCache && !leafTablesCache.includes('rekor_entries')) {
    leafTablesCache = null;
  }
  const tables = await leafTables(db);
  const inserted = await db
    .prepare(
      `INSERT INTO rekor_entries (
        identity, uuid, leaf_index, leaf_hash, log_id, log_index,
        integrated_time, entry_kind
      ) SELECT ?, ?, ${nextLeafIndexExpr(tables)}, ?, ?, ?, ?, ?
      RETURNING leaf_index`,
    )
    .bind(
      input.identity,
      input.uuid,
      input.leafHash,
      input.logId,
      input.logIndex,
      input.integratedTime,
      input.entryKind,
    )
    .first<{ leaf_index: number }>();
  return inserted?.leaf_index ?? null;
}

export async function getRekorSubject(
  db: D1Database,
  identity: string,
): Promise<{ identity: string; synced_at: string | null } | null> {
  if (!(await namedTableExists(db, 'rekor_subjects'))) return null;
  return (
    (await db
      .prepare(`SELECT identity, synced_at FROM rekor_subjects WHERE identity = ? LIMIT 1`)
      .bind(identity)
      .first<{ identity: string; synced_at: string | null }>()) ?? null
  );
}

export async function upsertRekorSubject(db: D1Database, identity: string): Promise<void> {
  if (!(await namedTableExists(db, 'rekor_subjects'))) return;
  await db
    .prepare(`INSERT OR IGNORE INTO rekor_subjects (identity) VALUES (?)`)
    .bind(identity)
    .run();
}

export async function listRekorSubjectsDue(db: D1Database, limit: number): Promise<string[]> {
  if (!(await namedTableExists(db, 'rekor_subjects'))) return [];
  const { results } = await db
    .prepare(
      `SELECT identity FROM rekor_subjects
       ORDER BY CASE WHEN synced_at IS NULL OR synced_at = '' THEN 0 ELSE 1 END ASC,
                synced_at ASC
       LIMIT ?`,
    )
    .bind(limit)
    .all<{ identity: string }>();
  return (results ?? []).map((row) => row.identity);
}

export async function markRekorSubjectSynced(db: D1Database, identity: string): Promise<void> {
  if (!(await namedTableExists(db, 'rekor_subjects'))) return;
  await db
    .prepare(
      `INSERT INTO rekor_subjects (identity, synced_at) VALUES (?, datetime('now'))
       ON CONFLICT (identity) DO UPDATE SET synced_at = datetime('now')`,
    )
    .bind(identity)
    .run();
}

export async function listLeavesSummary(db: D1Database): Promise<
  {
    domain: string;
    dkim_pass_count: number;
    reporter_org: string;
    period_start: number;
  }[]
> {
  const { results } = await db
    .prepare(
      `SELECT domain, dkim_pass_count, reporter_org, period_start FROM leaves ORDER BY leaf_index ASC`,
    )
    .all<{
      domain: string;
      dkim_pass_count: number;
      reporter_org: string;
      period_start: number;
    }>();
  return results ?? [];
}

export interface StreamCountRow {
  domain: string;
  count: number;
  first_logged_at: number;
}

export async function listCtSummary(db: D1Database): Promise<StreamCountRow[]> {
  if (!(await tableExists(db, 'ct_certs'))) return [];
  const { results } = await db
    .prepare(
      `SELECT domain, COUNT(*) AS count, MIN(logged_at) AS first_logged_at
       FROM ct_certs GROUP BY domain`,
    )
    .all<StreamCountRow>();
  return results ?? [];
}

export async function listRekorSummary(db: D1Database): Promise<StreamCountRow[]> {
  if (!(await tableExists(db, 'rekor_entries'))) return [];
  const { results } = await db
    .prepare(
      `SELECT identity AS domain, COUNT(*) AS count, MIN(integrated_time) AS first_logged_at
       FROM rekor_entries GROUP BY identity`,
    )
    .all<StreamCountRow>();
  return results ?? [];
}

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}
