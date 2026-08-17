import { normalizeDomain } from '@pact/core';
import { PACT_ROOTS_ADDRESS, readLatestRoot } from './chain.js';
import {
  getDomain,
  listDomains,
  listLeafHashes,
  listLeavesForDomain,
  listLeavesSummary,
  upsertDomain,
} from './ledger.js';
import { getWrapperMeta, getWrapperRfc822, normalizeWrapperHash } from './wrapper-store.js';

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

export async function handleLedgerRequest(
  request: Request,
  env: {
    DB: D1Database;
    CHAIN_RPC_URL: string;
    LEDGER_WRITE_SECRET?: string;
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
    const onChain = await readLatestRoot(env.CHAIN_RPC_URL);
    return json({
      contract: PACT_ROOTS_ADDRESS,
      chain: 'base-sepolia',
      onChain: onChain
        ? {
            root: onChain.root,
            leafCount: Number(onChain.leafCount),
            timestamp: Number(onChain.timestamp),
          }
        : null,
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
    const globalLeaves = await listLeafHashes(env.DB);
    const onChain = await readLatestRoot(env.CHAIN_RPC_URL);
    return json({
      domain: row,
      leaves: domainLeaves,
      globalLeaves,
      onChain: onChain
        ? {
            root: onChain.root,
            leafCount: Number(onChain.leafCount),
            timestamp: Number(onChain.timestamp),
          }
        : null,
    });
  }

  if (request.method === 'POST' && path === '/v1/domains') {
    const secret = env.LEDGER_WRITE_SECRET;
    const auth = request.headers.get('Authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!secret || token !== secret) {
      return json({ error: 'unauthorized' }, 401);
    }
    const body = (await request.json()) as {
      domain?: string;
      domain_registered_at?: string | null;
    };
    if (!body.domain) return json({ error: 'invalid_domain' }, 400);
    const domain = normalizeDomain(body.domain);
    await upsertDomain(env.DB, domain, body.domain_registered_at ?? null);
    return json({ ok: true, domain });
  }

  const wrapperMatch = path.match(/^\/v1\/wrappers\/([^/]+)(?:\/(rfc822))?$/);
  if (request.method === 'GET' && wrapperMatch) {
    const wrapperHash = normalizeWrapperHash(decodeURIComponent(wrapperMatch[1]!));
    if (!wrapperHash) return json({ error: 'invalid_hash' }, 400);
    if (wrapperMatch[2] === 'rfc822') {
      const rfc822 = await getWrapperRfc822(env.DB, wrapperHash);
      if (!rfc822) return json({ error: 'not_found' }, 404);
      return new Response(rfc822, {
        headers: {
          'Content-Type': 'message/rfc822',
          'Cache-Control': 'public, max-age=31536000, immutable',
          ...CORS,
        },
      });
    }
    const meta = await getWrapperMeta(env.DB, wrapperHash);
    if (!meta) return json({ error: 'not_found' }, 404);
    return json({
      ...meta,
      rfc822: `/v1/wrappers/${wrapperHash.slice(2)}/rfc822`,
    });
  }

  return json({ error: 'not_found' }, 404);
}
