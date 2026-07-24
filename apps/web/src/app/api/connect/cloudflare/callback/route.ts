import { normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';
import {
  ensurePactDmarcRecord,
  exchangeCloudflareCode,
  findZoneForDomain,
} from '@/lib/cloudflare-connect';
import { appOrigin, decodeConnectState } from '@/lib/connect-state';
import { registerDomain } from '@/lib/supabase-admin';

function redirectWith(path: string, params: Record<string, string>) {
  const url = new URL(path, appOrigin());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  if (error) {
    return redirectWith('/connect', { error });
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  if (!code || !state) {
    return redirectWith('/connect', { error: 'missing_code' });
  }

  const payload = decodeConnectState(state);
  if (!payload) {
    return redirectWith('/connect', { error: 'invalid_state' });
  }

  const domain = normalizeDomain(payload.domain);
  const redirectUri = `${appOrigin()}/api/connect/cloudflare/callback`;

  const tokenResult = await exchangeCloudflareCode(code, redirectUri);
  if ('error' in tokenResult) {
    return redirectWith('/connect', {
      error: 'token_exchange',
      domain,
      detail: tokenResult.error,
    });
  }

  const zone = await findZoneForDomain(tokenResult.accessToken, domain);
  if (!zone) {
    return redirectWith('/connect', { error: 'zone_not_found', domain });
  }

  const dmarc = await ensurePactDmarcRecord(tokenResult.accessToken, zone.id, domain);
  if (!dmarc.ok) {
    return redirectWith('/connect', { error: 'dmarc_update', domain, detail: dmarc.error });
  }

  const registered = await registerDomain(domain);
  if (!registered.ok) {
    return redirectWith('/connect', { error: 'register', domain, detail: registered.error });
  }

  return redirectWith('/connect/success', {
    domain,
    provider: 'cloudflare',
    dmarc: dmarc.action,
  });
}
