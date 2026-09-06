import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';

/** Private admin view of diagnostic-request submissions. Bearer token or ?key= query param. */
export async function GET(request: Request) {
  const secret = process.env.DIAGNOSTIC_ADMIN_SECRET;
  const url = new URL(request.url);
  const auth = request.headers.get('authorization') ?? '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : url.searchParams.get('key');

  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  const kv = env.DIAGNOSTIC_KV;
  if (!kv) {
    return NextResponse.json({ ok: false, error: 'server_config' }, { status: 500 });
  }

  const list = await kv.list({ prefix: 'req:', limit: 1000 });
  const entries = await Promise.all(
    list.keys.map(async (k) => {
      const value = await kv.get(k.name);
      if (!value) return null;
      try {
        return JSON.parse(value) as Record<string, unknown>;
      } catch {
        return null;
      }
    }),
  );

  const requests = entries
    .filter((e): e is Record<string, unknown> => e != null)
    .sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));

  return NextResponse.json({ ok: true, count: requests.length, requests });
}
