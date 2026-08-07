import { addPactRuaToDmarc, normalizeDomain } from '@pact/core';
import { NextResponse } from 'next/server';

function redirectWith(path: string, params: Record<string, string>, request: Request) {
  const url = new URL(path, request.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

// Manual connections are never written to the database here. The domain only
// appears in the public record once we receive and verify its first RUA
// report — that's the actual proof the DNS record was added, so there's
// nothing to "register" up front. See workers/ingest/src/process-report.ts.
export async function POST(request: Request) {
  const form = await request.formData();
  const domain = normalizeDomain(String(form.get('domain') ?? ''));
  if (!domain || !domain.includes('.')) {
    return redirectWith('/connect', { error: 'invalid_domain' }, request);
  }

  const { content } = addPactRuaToDmarc(null);
  return redirectWith('/connect/success', { domain, provider: 'manual', dmarc: content }, request);
}
