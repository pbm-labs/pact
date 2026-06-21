import { normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';
import { cloudflareAuthorizeUrl } from '@/lib/cloudflare-connect';
import { appOrigin, encodeConnectState } from '@/lib/connect-state';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = normalizeDomain(searchParams.get('domain') ?? '');
  if (!domain || !domain.includes('.')) {
    return NextResponse.redirect(new URL('/disconnect?error=invalid_domain', request.url));
  }

  const state = encodeConnectState({ domain, action: 'disconnect' });
  if (!state) {
    return NextResponse.redirect(new URL('/disconnect?error=server_config', request.url));
  }

  const origin = appOrigin();
  const redirectUri = `${origin}/api/disconnect/cloudflare/callback`;
  const authorizeUrl = cloudflareAuthorizeUrl(state, redirectUri);
  if (!authorizeUrl) {
    return NextResponse.redirect(new URL('/disconnect?error=oauth_not_configured', request.url));
  }

  return NextResponse.redirect(authorizeUrl);
}
