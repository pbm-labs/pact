import { normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';
import {
  exchangeCloudflareCode,
  findZoneForDomain,
  removePactDmarcRecord,
} from '@/lib/cloudflare-connect';
import { appOrigin, decodeConnectState } from '@/lib/connect-state';
import { disconnectDomain } from '@/lib/supabase-admin';

function redirectWith(path: string, params: Record<string, string>) {
  const url = new URL(path, appOrigin());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  if (error) {
    return redirectWith('/disconnect', { error });
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  if (!code || !state) {
    return redirectWith('/disconnect', { error: 'missing_code' });
  }

  const payload = decodeConnectState(state);
  if (!payload || payload.action !== 'disconnect') {
    return redirectWith('/disconnect', { error: 'invalid_state' });
  }

  const domain = normalizeDomain(payload.domain);
  const redirectUri = `${appOrigin()}/api/disconnect/cloudflare/callback`;

  const tokenResult = await exchangeCloudflareCode(code, redirectUri);
  if ('error' in tokenResult) {
    return redirectWith('/disconnect', {
      error: 'token_exchange',
      domain,
      detail: tokenResult.error,
    });
  }

  const zone = await findZoneForDomain(tokenResult.accessToken, domain);
  if (!zone) {
    return redirectWith('/disconnect', { error: 'zone_not_found', domain });
  }

  const dmarc = await removePactDmarcRecord(tokenResult.accessToken, zone.id, domain);
  if (!dmarc.ok) {
    return redirectWith('/disconnect', { error: 'dmarc_update', domain, detail: dmarc.error });
  }

  const disconnected = await disconnectDomain(domain);
  if (!disconnected.ok) {
    return redirectWith('/disconnect', { error: 'disconnect', domain, detail: disconnected.error });
  }

  return redirectWith('/disconnect/success', {
    domain,
    provider: 'cloudflare',
    dmarc: dmarc.action,
  });
}
