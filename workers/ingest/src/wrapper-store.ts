import { checkWrapperOpening, type WrapperOpeningCheck } from '@pact/core';

export interface WrapperStoreEnv {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export interface WrapperMeta {
  wrapperHash: `0x${string}`;
  byteLength: number;
  receivedAt: string;
  envelopeFrom: string;
  dkimSource: string | null;
  dkim: {
    domain: string;
    selector: string;
    name: string;
    txt: string[] | null;
    error?: string;
    lookedUpAt: string;
  }[];
  /** Email Routing may rewrite these bytes; RFC 6376 on this copy may fail. */
  bytesFrom: 'email-worker';
}

const BUCKET = 'wrapper-blobs';

export function normalizeWrapperHash(hash: string): `0x${string}` | null {
  const hex = hash.trim().toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{64}$/.test(hex)) return null;
  return `0x${hex}`;
}

function requireSupabase(env: WrapperStoreEnv): { url: string; key: string } {
  const url = env.SUPABASE_URL?.replace(/\/$/, '');
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('supabase wrapper store is not configured');
  return { url, key };
}

function authHeaders(key: string): Record<string, string> {
  return { apikey: key, Authorization: `Bearer ${key}` };
}

async function ensureBucket(url: string, key: string): Promise<void> {
  const res = await fetch(`${url}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...authHeaders(key), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: false,
      fileSizeLimit: 10 * 1024 * 1024,
    }),
  });
  if (res.ok || res.status === 409) return;
  const body = await res.text();
  if (res.status === 400 && /already exists|duplicate/i.test(body)) return;
  throw new Error(`supabase bucket ${res.status}: ${body.slice(0, 300)}`);
}

async function putObject(
  url: string,
  key: string,
  path: string,
  body: BodyInit,
  contentType: string,
): Promise<void> {
  const res = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      ...authHeaders(key),
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`supabase put ${path} ${res.status}: ${text.slice(0, 300)}`);
  }
}

async function getObject(url: string, key: string, path: string): Promise<Response | null> {
  const res = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
    headers: authHeaders(key),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`supabase get ${path} ${res.status}: ${text.slice(0, 300)}`);
  }
  return res;
}

export async function storeWrapperBlob(
  env: WrapperStoreEnv,
  input: {
    wrapperHash: `0x${string}`;
    rfc822: Uint8Array;
    meta: WrapperMeta;
  },
): Promise<void> {
  const { url, key } = requireSupabase(env);
  await ensureBucket(url, key);
  const hex = input.wrapperHash.slice(2);
  await putObject(url, key, `${hex}.rfc822`, input.rfc822, 'message/rfc822');
  await putObject(url, key, `${hex}.json`, JSON.stringify(input.meta), 'application/json');
}

export async function getWrapperMeta(
  env: WrapperStoreEnv,
  wrapperHash: `0x${string}`,
): Promise<WrapperMeta | null> {
  const { url, key } = requireSupabase(env);
  const res = await getObject(url, key, `${wrapperHash.slice(2)}.json`);
  if (!res) return null;
  return (await res.json()) as WrapperMeta;
}

export async function getWrapperRfc822(
  env: WrapperStoreEnv,
  wrapperHash: `0x${string}`,
): Promise<ArrayBuffer | null> {
  const { url, key } = requireSupabase(env);
  const res = await getObject(url, key, `${wrapperHash.slice(2)}.rfc822`);
  if (!res) return null;
  return res.arrayBuffer();
}

export interface StoredWrapperCheck extends WrapperOpeningCheck {
  stored: true;
  wrapperHash: `0x${string}`;
  dkim: {
    domain: string;
    selector: string;
    name: string;
    hasTxt: boolean;
    lookedUpAt: string;
  }[];
  rfc822: string;
}

export async function checkStoredWrapper(
  env: WrapperStoreEnv,
  wrapperHash: `0x${string}`,
): Promise<StoredWrapperCheck | null> {
  const [rfc822, meta] = await Promise.all([
    getWrapperRfc822(env, wrapperHash),
    getWrapperMeta(env, wrapperHash),
  ]);
  if (!rfc822 || !meta) return null;
  const opening = checkWrapperOpening({
    expectedHash: wrapperHash,
    rfc822: new Uint8Array(rfc822),
    dkim: meta.dkim,
  });
  return {
    stored: true,
    wrapperHash,
    ...opening,
    dkim: meta.dkim.map((row) => ({
      domain: row.domain,
      selector: row.selector,
      name: row.name,
      hasTxt: (row.txt?.length ?? 0) > 0,
      lookedUpAt: row.lookedUpAt,
    })),
    rfc822: `/v1/wrappers/${wrapperHash.slice(2)}/rfc822`,
  };
}
