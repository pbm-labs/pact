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

export function normalizeWrapperHash(hash: string): `0x${string}` | null {
  const hex = hash.trim().toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{64}$/.test(hex)) return null;
  return `0x${hex}`;
}

export async function storeWrapperBlob(
  db: D1Database,
  input: {
    wrapperHash: `0x${string}`;
    rfc822: Uint8Array;
    meta: WrapperMeta;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT OR IGNORE INTO wrapper_blobs (wrapper_hash, rfc822, meta_json, byte_length)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(input.wrapperHash, input.rfc822, JSON.stringify(input.meta), input.rfc822.byteLength)
    .run();
}

export async function getWrapperMeta(
  db: D1Database,
  wrapperHash: `0x${string}`,
): Promise<WrapperMeta | null> {
  const row = await db
    .prepare(`SELECT meta_json FROM wrapper_blobs WHERE wrapper_hash = ?`)
    .bind(wrapperHash)
    .first<{ meta_json: string }>();
  if (!row) return null;
  return JSON.parse(row.meta_json) as WrapperMeta;
}

export async function getWrapperRfc822(
  db: D1Database,
  wrapperHash: `0x${string}`,
): Promise<ArrayBuffer | null> {
  const row = await db
    .prepare(`SELECT rfc822 FROM wrapper_blobs WHERE wrapper_hash = ?`)
    .bind(wrapperHash)
    .first<{ rfc822: ArrayBuffer }>();
  return row?.rfc822 ?? null;
}
