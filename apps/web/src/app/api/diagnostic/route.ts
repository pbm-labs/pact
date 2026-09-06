import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';

const MAX_LONG = 2000;
const MAX_SHORT = 500;
const ALLOWED_STAGES = new Set(['seed', 'series-a', 'series-b-plus', 'other']);

type DiagnosticRequestEntry = {
  stage: string;
  dependency: string;
  useCase: string;
  locale: string;
  submittedAt: string;
};

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

/** Landing-page diagnostic-request intake — stores leads, no evidence data. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Pretend success, skip storage.
  if (clean(body.company, MAX_SHORT)) {
    return NextResponse.json({ ok: true });
  }

  const dependency = clean(body.dependency, MAX_SHORT);
  const useCase = clean(body.useCase, MAX_LONG);
  const stageRaw = clean(body.stage, 32).toLowerCase();
  const stage = ALLOWED_STAGES.has(stageRaw) ? stageRaw : 'other';
  const locale = clean(body.locale, 8) || 'en';

  if (!dependency || !useCase) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }

  const entry: DiagnosticRequestEntry = {
    stage,
    dependency,
    useCase,
    locale,
    submittedAt: new Date().toISOString(),
  };

  try {
    const { env } = getCloudflareContext();
    const kv = env.DIAGNOSTIC_KV;
    if (!kv) {
      console.error('DIAGNOSTIC_KV binding is missing');
      return NextResponse.json({ ok: false, error: 'server_config' }, { status: 500 });
    }
    const id = crypto.randomUUID();
    await kv.put(`req:${entry.submittedAt}:${id}`, JSON.stringify(entry));
  } catch (err) {
    console.error('Failed to store diagnostic request', err);
    return NextResponse.json({ ok: false, error: 'storage_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
