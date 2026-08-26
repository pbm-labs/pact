import { normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';
import { parseConnectPath } from '@/lib/connect-path';
import { appOrigin } from '@/lib/connect-state';
import { registerDomain } from '@/lib/ledger-admin';
import { routes } from '@/lib/routes';

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

function connectPathFrom(request: Request): 'manual' | 'dmarc-tool' {
  const { searchParams } = new URL(request.url);
  const parsed = parseConnectPath(searchParams.get('path') ?? undefined);
  return parsed === 'dmarc-tool' ? 'dmarc-tool' : 'manual';
}

/** Manual / tool connect — register domain without Cloudflare OAuth. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = connectPathFrom(request);
  const domain = normalizeDomain(searchParams.get('domain') ?? '');
  if (!domain || !domain.includes('.')) {
    return redirectWith(request, routes.connect, { error: 'invalid_domain', path });
  }

  const registered = await registerDomain(domain);
  if (!registered.ok) {
    return redirectWith(request, routes.connect, {
      error: 'register',
      domain,
      path,
      detail: registered.error,
    });
  }

  return NextResponse.redirect(new URL(routes.record(domain), appOrigin(request)));
}
