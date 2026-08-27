import { normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';
import { cloudflareAuthorizeUrl } from '@/lib/cloudflare-connect';
import { encodeConnectState, oauthCallbackUri } from '@/lib/connect-state';
import { routes } from '@/lib/routes';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = normalizeDomain(searchParams.get('domain') ?? '');
  if (!domain || !domain.includes('.')) {
    return NextResponse.redirect(new URL(`${routes.connect}?error=invalid_domain`, request.url));
  }

  const state = encodeConnectState(domain);
  if (!state) {
    return NextResponse.redirect(new URL(`${routes.connect}?error=server_config`, request.url));
  }

  const redirectUri = oauthCallbackUri();
  const authorizeUrl = cloudflareAuthorizeUrl(state, redirectUri);
  if (!authorizeUrl) {
    return NextResponse.redirect(
      new URL(`${routes.connect}?error=oauth_not_configured`, request.url),
    );
  }

  return NextResponse.redirect(authorizeUrl);
}
