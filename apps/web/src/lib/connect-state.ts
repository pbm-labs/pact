import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export interface ConnectState {
  domain: string;
  nonce: string;
  ts: number;
}

function getSecret(): string | null {
  return process.env.CONNECT_STATE_SECRET ?? process.env.LEDGER_WRITE_SECRET ?? null;
}

export function encodeConnectState(domain: string): string | null {
  const secret = getSecret();
  if (!secret) return null;

  const payload: ConnectState = {
    domain,
    nonce: randomBytes(16).toString('hex'),
    ts: Date.now(),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function decodeConnectState(state: string): ConnectState | null {
  const secret = getSecret();
  if (!secret) return null;

  const dot = state.lastIndexOf('.');
  if (dot === -1) return null;
  const data = state.slice(0, dot);
  const sig = state.slice(dot + 1);
  const expected = createHmac('sha256', secret).update(data).digest('base64url');

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  let payload: ConnectState;
  try {
    payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as ConnectState;
  } catch {
    return null;
  }

  if (!payload.domain || !payload.nonce || !payload.ts) return null;
  if (Date.now() - payload.ts > 15 * 60 * 1000) return null;
  return payload;
}

export function appOrigin(request?: Request): string {
  if (request) {
    try {
      return new URL(request.url).origin;
    } catch {
      /* fall through */
    }
  }
  return canonicalOrigin();
}

/** Public app host — OAuth redirect_uri and post-login redirects. */
export function canonicalOrigin(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? 'https://leftover.webuildreal.dev').replace(/\/$/, '');
}

export function oauthCallbackUri(): string {
  return `${canonicalOrigin()}/api/connect/cloudflare/callback`;
}
