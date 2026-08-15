import type { Hash } from '@pact/core';

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

  const maxRow = await db
    .prepare(`SELECT COALESCE(MAX(leaf_index), -1) AS max_index FROM leaves`)
    .first<{ max_index: number }>();
  const nextIndex = (maxRow?.max_index ?? -1) + 1;

  await db
    .prepare(
      `INSERT INTO leaves (
        leaf_index, leaf_hash, domain, period_start, period_end, reporter_org,
        dkim_pass_count, dkim_fail_count, domain_hash, reporter_hash,
        selector_hash, source_ip_hash, report_hash, selectors, ip_ranges,
        wrapper_hash, wrapper_dkim_hash, wrapper_hashes, wrapper_dkim
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      nextIndex,
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
    .run();

  return nextIndex;
}

export async function listLeafHashes(db: D1Database): Promise<{ leaf_index: number; leaf_hash: string }[]> {
  const { results } = await db
    .prepare(`SELECT leaf_index, leaf_hash FROM leaves ORDER BY leaf_index ASC`)
    .all<{ leaf_index: number; leaf_hash: string }>();
  return results ?? [];
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

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}
