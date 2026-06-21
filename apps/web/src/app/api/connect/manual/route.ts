import { addPactRuaToDmarc, normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';
import { registerDomain } from '@/lib/supabase-admin';

function redirectWith(path: string, params: Record<string, string>, request: Request) {
  const url = new URL(path, request.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const domain = normalizeDomain(String(form.get('domain') ?? ''));
  if (!domain || !domain.includes('.')) {
    return redirectWith('/connect', { error: 'invalid_domain' }, request);
  }

  const registered = await registerDomain(domain);
  if (!registered.ok) {
    return redirectWith('/connect', { error: 'register', domain, detail: registered.error }, request);
  }

  const { content } = addPactRuaToDmarc(null);
  return redirectWith('/connect/success', { domain, provider: 'manual', dmarc: content }, request);
}
