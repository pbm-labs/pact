import { normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';
import { appOrigin } from '@/lib/connect-state';
import { routes } from '@/lib/routes';
import { registerDomain } from '@/lib/supabase-admin';

function redirectWith(
  request: Request,
  path: string,
  params: Record<string, string>,
) {
  const url = new URL(path, appOrigin(request));
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url);
}

/** Manual / tool connect — register domain without Cloudflare OAuth. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = normalizeDomain(searchParams.get('domain') ?? '');
  if (!domain || !domain.includes('.')) {
    return redirectWith(request, routes.connect, { error: 'invalid_domain', path: 'manual' });
  }

  const registered = await registerDomain(domain);
  if (!registered.ok) {
    return redirectWith(request, routes.connect, {
      error: 'register',
      domain,
      path: 'manual',
      detail: registered.error,
    });
  }

  return redirectWith(request, routes.connectSuccess, {
    domain,
    provider: 'manual',
  });
}
