import { normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';
import { disconnectDomain } from '@/lib/supabase-admin';

function redirectWith(path: string, params: Record<string, string>, request: Request) {
  const url = new URL(path, request.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const domain = normalizeDomain(String(form.get('domain') ?? ''));
  if (!domain || !domain.includes('.')) {
    return redirectWith('/disconnect', { error: 'invalid_domain' }, request);
  }

  const disconnected = await disconnectDomain(domain);
  if (!disconnected.ok) {
    return redirectWith(
      '/disconnect',
      { error: 'disconnect', domain, detail: disconnected.error },
      request,
    );
  }

  return redirectWith('/disconnect/success', { domain, provider: 'manual' }, request);
}
