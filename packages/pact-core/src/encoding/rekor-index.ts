import { normalizeDomain } from './domain.js';

export const REKOR_PUBLIC_LOG = 'rekor.sigstore.dev' as const;

export interface RekorIndexEntry {
  uuid: string;
  logId: string;
  logIndex: bigint;
  integratedTime: number;
  identity: string;
  entryKind: string;
}

/** Exact leftover subject as stored and hashed. No guessed mailboxes. */
export function canonicalRekorIdentity(raw: string): string | null {
  const s = raw.trim().toLowerCase();
  if (!s || s.length > 512) return null;

  if (s.includes('@') && !s.includes('://')) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return null;
    return s;
  }

  const asUrl = s.includes('://') ? s : s.startsWith('github.com/') ? `https://${s}` : null;
  if (asUrl) {
    try {
      const u = new URL(asUrl);
      if (!u.hostname) return null;
      const path = u.pathname.replace(/\/+$/, '');
      return `${u.protocol}//${u.host}${path}${u.search}`;
    } catch {
      return null;
    }
  }

  const host = normalizeDomain(s);
  return host || null;
}

/** Subjects to send to Rekor’s experimental index. Exact email/URI, or host leftover variants. */
export function rekorSearchSubjects(identity: string): string[] {
  const id = canonicalRekorIdentity(identity);
  if (!id) return [];
  if (id.includes('@') || id.includes('://')) return [id];
  return leftoverRekorSubjects(id);
}

/** Host leftover lookups (not GitHub URIs, not guessed mailboxes). */
export function leftoverRekorSubjects(domain: string): string[] {
  const d = normalizeDomain(domain);
  if (!d) return [];
  return [d, `www.${d}`, `https://${d}`, `https://www.${d}`];
}

export function parseRekorUuidList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') continue;
    const hex = item.trim().toLowerCase().replace(/^0x/, '');
    if (/^[0-9a-f]{64}$|^[0-9a-f]{80}$/.test(hex)) out.push(hex);
  }
  return out;
}

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
}

function decodeBody(body: unknown): Record<string, unknown> | null {
  if (typeof body !== 'string' || !body.trim()) return null;
  try {
    const json = atob(body);
    const parsed = JSON.parse(json) as unknown;
    return asRecord(parsed);
  } catch {
    return null;
  }
}

function asInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) return Number(value.trim());
  return null;
}

/**
 * One object from GET /api/v1/log/entries/{uuid}.
 * `identity` is the leftover subject used to find the entry (host, URI, or email).
 */
export function parseRekorLogEntry(
  raw: unknown,
  identity: string,
  logId = REKOR_PUBLIC_LOG,
): RekorIndexEntry | null {
  const leftover = canonicalRekorIdentity(identity);
  if (!leftover) return null;
  const root = asRecord(raw);
  if (!root) return null;

  let uuid = '';
  let inner: Record<string, unknown> | null = null;
  const keys = Object.keys(root);
  if (keys.length === 1 && asRecord(root[keys[0]!])) {
    uuid = keys[0]!.toLowerCase();
    inner = asRecord(root[keys[0]!]);
  } else {
    inner = root;
    uuid = String(root.uuid ?? '').toLowerCase();
  }
  if (!inner) return null;

  const logIndex = asInt(inner.logIndex);
  const integratedTime = asInt(inner.integratedTime);
  if (logIndex == null || logIndex < 0 || integratedTime == null || integratedTime <= 0) {
    return null;
  }

  const hex = uuid.replace(/^0x/, '');
  if (!/^[0-9a-f]{64}$|^[0-9a-f]{80}$/.test(hex)) return null;

  const spec = decodeBody(inner.body);
  const entryKind =
    (typeof spec?.kind === 'string' && spec.kind.trim()) ||
    (typeof inner.kind === 'string' && inner.kind.trim()) ||
    'hashedrekord';

  return {
    uuid: hex,
    logId,
    logIndex: BigInt(logIndex),
    integratedTime,
    identity: leftover,
    entryKind,
  };
}
