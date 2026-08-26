import {
  canonicalRekorIdentity,
  kindCatalogDocument,
  normalizeDomain,
  parseKindId,
  type KindId,
} from '@pact/core';
import { PACT_ROOTS_ADDRESS } from './chain.js';
import {
  countRekorEntriesForIdentity,
  getRekorSubject,
  listCtCertsForDomain,
  listLeavesForDomain,
  listRekorEntriesForIdentity,
} from './ledger.js';
import { leafIncluded, loadSharedTree } from './merkle.js';
import { ingestRekorForIdentity } from './rekor-ingest.js';

const MAX_EVIDENCE_LEAVES = 80;
const REKOR_STALE_MS = 15 * 60 * 1000;

type JsonFn = (data: unknown, status?: number) => Response;

function sqliteUtcMs(value: string | null | undefined): number | null {
  if (!value) return null;
  const iso = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

function parseEvidenceIdentity(kind: KindId, raw: string): string | null {
  const submitted = raw.trim();
  if (!submitted) return null;
  if (kind === 'rekor') return canonicalRekorIdentity(submitted);
  if (submitted.includes('@') || submitted.includes('://')) return null;
  return normalizeDomain(submitted) || null;
}

function namedSharedRoot(
  live: { root: string; leafCount: number } | null,
  onChain: unknown,
) {
  return {
    type: 'shared' as const,
    hash: live?.root ?? null,
    leaf_count: live?.leafCount ?? 0,
    contract: PACT_ROOTS_ADDRESS,
    chain: 'base-sepolia',
    on_chain: onChain,
  };
}

export async function handleKindsAndEvidence(
  request: Request,
  env: { DB: D1Database; CHAIN_RPC_URL: string },
  json: JsonFn,
  publicOnChain: (env: { DB: D1Database; CHAIN_RPC_URL: string }) => Promise<unknown>,
): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '') || '/';

  if (request.method === 'GET' && path === '/v1/kinds') {
    return json(kindCatalogDocument());
  }

  if (request.method !== 'GET' || path !== '/v1/evidence') return null;

  const kind = parseKindId(url.searchParams.get('kind') ?? '');
  if (!kind) return json({ error: 'unknown_kind' }, 400);

  const submitted = url.searchParams.get('identity') ?? '';
  const identity = parseEvidenceIdentity(kind, submitted);
  if (!identity) return json({ error: 'invalid_identity' }, 400);

  if (kind === 'rekor') {
    const subject = await getRekorSubject(env.DB, identity);
    const syncedMs = sqliteUtcMs(subject?.synced_at);
    const fresh = syncedMs != null && Date.now() - syncedMs < REKOR_STALE_MS;
    if (!fresh) {
      try {
        await ingestRekorForIdentity(env.DB, identity);
      } catch (err) {
        console.log(
          JSON.stringify({
            event: 'rekor_evidence_ingest_failed',
            identity,
            error: String(err),
          }),
        );
      }
    }
  }

  const treeState = await loadSharedTree(env.DB);
  const onChain = await publicOnChain(env);
  const echo = { kind, identity, submitted: submitted.trim() };
  const root = namedSharedRoot(
    treeState ? { root: treeState.root, leafCount: treeState.leafCount } : null,
    onChain,
  );

  if (kind === 'mail') {
    const all = await listLeavesForDomain(env.DB, identity);
    const truncated = all.length > MAX_EVIDENCE_LEAVES;
    const leaves = all.slice(0, MAX_EVIDENCE_LEAVES).map((row) => ({
      leaf_index: row.leaf_index,
      leaf_hash: row.leaf_hash,
      identity,
      period_start: row.period_start,
      period_end: row.period_end,
      reporter_org: row.reporter_org,
      dkim_pass_count: row.dkim_pass_count,
      dkim_fail_count: row.dkim_fail_count,
      included: leafIncluded(treeState?.tree, row.leaf_index, row.leaf_hash),
    }));
    return json({
      kind,
      identity,
      echo,
      root,
      count: all.length,
      truncated,
      leaves,
    });
  }

  if (kind === 'ct') {
    const all = await listCtCertsForDomain(env.DB, identity);
    const truncated = all.length > MAX_EVIDENCE_LEAVES;
    const leaves = all.slice(0, MAX_EVIDENCE_LEAVES).map((row) => ({
      leaf_index: row.leaf_index,
      leaf_hash: row.leaf_hash,
      identity,
      fingerprint: row.fingerprint,
      log_id: row.log_id,
      log_index: row.log_index,
      logged_at: row.logged_at,
      not_before: row.not_before,
      not_after: row.not_after,
      issuer: row.issuer,
      common_name: row.common_name,
      included: leafIncluded(treeState?.tree, row.leaf_index, row.leaf_hash),
    }));
    return json({
      kind,
      identity,
      echo,
      root,
      count: all.length,
      truncated,
      leaves,
    });
  }

  const total = await countRekorEntriesForIdentity(env.DB, identity);
  const rows = await listRekorEntriesForIdentity(env.DB, identity, MAX_EVIDENCE_LEAVES);
  const leaves = rows.map((row) => ({
    leaf_index: row.leaf_index,
    leaf_hash: row.leaf_hash,
    identity: row.identity,
    uuid: row.uuid,
    log_id: row.log_id,
    log_index: row.log_index,
    integrated_time: row.integrated_time,
    entry_kind: row.entry_kind,
    included: leafIncluded(treeState?.tree, row.leaf_index, row.leaf_hash),
  }));
  return json({
    kind,
    identity,
    echo,
    root,
    count: total,
    truncated: total > leaves.length,
    leaves,
  });
}
