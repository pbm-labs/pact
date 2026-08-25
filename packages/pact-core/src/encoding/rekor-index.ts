import { normalizeDomain } from './domain.js';
import { rekorIdentityCoversDomain } from './rekor-leaf.js';

export const REKOR_PUBLIC_LOG = 'rekor.sigstore.dev' as const;

export interface RekorIndexEntry {
  uuid: string;
  logId: string;
  logIndex: bigint;
  integratedTime: number;
  identity: string;
  entryKind: string;
}

/** Exact SAN lookups only. No guessed mailboxes. */
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
 * `identity` is the leftover SAN used to find the entry; it MUST still cover the domain.
 */
export function parseRekorLogEntry(
  raw: unknown,
  identity: string,
  domain: string,
  logId = REKOR_PUBLIC_LOG,
): RekorIndexEntry | null {
  if (!rekorIdentityCoversDomain(identity, domain)) return null;
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
    identity: identity.trim().toLowerCase(),
    entryKind,
  };
}
