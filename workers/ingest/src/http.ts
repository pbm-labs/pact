import { normalizeDomain } from '@pact/core';
import { PACT_ROOTS_ADDRESS, readLatestRoot } from './chain.js';
import {
  getDomain,
  getLatestBaseRoot,
  getLeafByHash,
  getCtCertByHash,
  getTxHashForRoot,
  listDomains,
  listLeafHashes,
  listLeavesForDomain,
  listLeavesSummary,
  listCtCertsForDomain,
  upsertDomain,
} from './ledger.js';
import { getWrapperMeta, getWrapperRfc822, normalizeWrapperHash, checkStoredWrapper } from './wrapper-store.js';
import { publishAnchoredRoot } from './publish-root.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function requireWriteAuth(request: Request, secret: string | undefined): Response | null {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!secret || token !== secret) {
    return json({ error: 'unauthorized' }, 401);
  }
  return null;
}

function isZeroRoot(root: string): boolean {
  return /^0x0+$/i.test(root);
}

async function publicOnChain(env: { DB: D1Database; CHAIN_RPC_URL: string }) {
  const onChain = await readLatestRoot(env.CHAIN_RPC_URL);
  if (onChain && !isZeroRoot(onChain.root)) {
    const txHash = await getTxHashForRoot(env.DB, onChain.root);
    return {
      root: onChain.root,
      leafCount: Number(onChain.leafCount),
      timestamp: Number(onChain.timestamp),
      txHash,
      contract: PACT_ROOTS_ADDRESS,
    };
  }

  const stored = await getLatestBaseRoot(env.DB);
  if (!stored) return null;
  const txHash = stored.txHash ?? (await getTxHashForRoot(env.DB, stored.rootHash));
  const publishedMs = Date.parse(stored.publishedAt.replace(' ', 'T') + 'Z');
  return {
    root: stored.rootHash,
    leafCount: stored.leafCount,
    timestamp: Number.isFinite(publishedMs) ? Math.floor(publishedMs / 1000) : 0,
    txHash,
    contract: PACT_ROOTS_ADDRESS,
  };
}

export async function handleLedgerRequest(
  request: Request,
  env: {
    DB: D1Database;
    CHAIN_RPC_URL: string;
    PUBLISHER_PRIVATE_KEY?: string;
    LEDGER_WRITE_SECRET?: string;
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
  },
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '') || '/';

  if (request.method === 'GET' && (path === '/' || path === '/v1/health')) {
    return json({
      ok: true,
      roots: PACT_ROOTS_ADDRESS,
      chain: 'base-sepolia',
    });
  }

  if (request.method === 'GET' && path === '/v1/root') {
    const onChain = await publicOnChain(env);
    return json({
      contract: PACT_ROOTS_ADDRESS,
      chain: 'base-sepolia',
      onChain,
    });
  }

  if (request.method === 'GET' && path === '/v1/domains') {
    const domains = await listDomains(env.DB);
    const leaves = await listLeavesSummary(env.DB);
    return json({ domains, leaves });
  }

  const domainMatch = path.match(/^\/v1\/domains\/([^/]+)$/);
  if (request.method === 'GET' && domainMatch) {
    const domain = normalizeDomain(decodeURIComponent(domainMatch[1]!));
    const row = await getDomain(env.DB, domain);
    if (!row) return json({ error: 'not_found' }, 404);
    const domainLeaves = await listLeavesForDomain(env.DB, domain);
    const ctCerts = await listCtCertsForDomain(env.DB, domain);
    const globalLeaves = await listLeafHashes(env.DB);
    const onChain = await publicOnChain(env);
    return json({
      domain: row,
      leaves: domainLeaves,
      ct: ctCerts,
      globalLeaves,
      onChain,
    });
  }

  if (request.method === 'POST' && path === '/v1/domains') {
    const denied = requireWriteAuth(request, env.LEDGER_WRITE_SECRET);
    if (denied) return denied;
    const body = (await request.json()) as {
      domain?: string;
      domain_registered_at?: string | null;
    };
    if (!body.domain) return json({ error: 'invalid_domain' }, 400);
    const domain = normalizeDomain(body.domain);
    await upsertDomain(env.DB, domain, body.domain_registered_at ?? null);
    return json({ ok: true, domain });
  }

  if (request.method === 'POST' && path === '/v1/root/publish') {
    const denied = requireWriteAuth(request, env.LEDGER_WRITE_SECRET);
    if (denied) return denied;
    const result = await publishAnchoredRoot(env);
    const ok = result.status !== 'staging';
    return json({ ok, ...result }, ok ? 200 : 503);
  }

  const leafMatch = path.match(/^\/v1\/leaves\/([^/]+)$/);
  if (request.method === 'GET' && leafMatch) {
    const leafHash = normalizeWrapperHash(decodeURIComponent(leafMatch[1]!));
    if (!leafHash) return json({ error: 'invalid_hash' }, 400);
    const leaf = await getLeafByHash(env.DB, leafHash);
    if (leaf) return json({ kind: 'dmarc', ...leaf });
    const ct = await getCtCertByHash(env.DB, leafHash);
    if (!ct) return json({ error: 'not_found' }, 404);
    return json({ kind: 'ct', ...ct });
  }

  const wrapperMatch = path.match(/^\/v1\/wrappers\/([^/]+)(?:\/(rfc822|check))?$/);
  if (request.method === 'GET' && wrapperMatch) {
    const wrapperHash = normalizeWrapperHash(decodeURIComponent(wrapperMatch[1]!));
    if (!wrapperHash) return json({ error: 'invalid_hash' }, 400);
    if (wrapperMatch[2] === 'rfc822') {
      const rfc822 = await getWrapperRfc822(env, wrapperHash);
      if (!rfc822) return json({ error: 'not_found' }, 404);
      return new Response(rfc822, {
        headers: {
          'Content-Type': 'message/rfc822',
          'Cache-Control': 'public, max-age=31536000, immutable',
          ...CORS,
        },
      });
    }
    if (wrapperMatch[2] === 'check') {
      const check = await checkStoredWrapper(env, wrapperHash);
      if (!check) return json({ error: 'not_found' }, 404);
      return json({
        ...check,
        ok: check.hashMatches && check.dkimKeysOnRecord,
      });
    }
    const meta = await getWrapperMeta(env, wrapperHash);
    if (!meta) return json({ error: 'not_found' }, 404);
    return json({
      ...meta,
      rfc822: `/v1/wrappers/${wrapperHash.slice(2)}/rfc822`,
      check: `/v1/wrappers/${wrapperHash.slice(2)}/check`,
    });
  }

  return json({ error: 'not_found' }, 404);
}
