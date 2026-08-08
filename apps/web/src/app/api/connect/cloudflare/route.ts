import { normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';
import { cloudflareAuthorizeUrl } from '@/lib/cloudflare-connect';
import { appOrigin, encodeConnectState } from '@/lib/connect-state';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = normalizeDomain(searchParams.get('domain') ?? '');
  if (!domain || !domain.includes('.')) {
    return NextResponse.redirect(new URL('/how-it-works?error=invalid_domain#add-your-domain', request.url));
  }

  const state = encodeConnectState(domain);
  if (!state) {
    return NextResponse.redirect(new URL('/how-it-works?error=server_config#add-your-domain', request.url));
  }

  const origin = appOrigin();
  const redirectUri = `${origin}/api/connect/cloudflare/callback`;
  const authorizeUrl = cloudflareAuthorizeUrl(state, redirectUri);
  if (!authorizeUrl) {
    return NextResponse.redirect(
      new URL('/how-it-works?error=oauth_not_configured#add-your-domain', request.url),
    );
  }

  return NextResponse.redirect(authorizeUrl);
}
