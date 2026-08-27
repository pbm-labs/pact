import { KIND_CATALOG } from '@pact/core';
import { ledgerGet } from '@/lib/ledger-get';
import { routes } from '@/lib/routes';

/** Live catalog row. Id is not limited to today's kinds — the list grows. */
export type CatalogKind = {
  id: string;
  tag: string | null;
  encoding: string;
  key: { shape: string; forms?: string[] };
  stake: string;
};

function asCatalogKind(raw: unknown): CatalogKind | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const id = typeof row.id === 'string' ? row.id.trim().toLowerCase() : '';
  if (!id) return null;
  const key =
    row.key && typeof row.key === 'object' ? (row.key as Record<string, unknown>) : null;
  const shape = typeof key?.shape === 'string' ? key.shape : 'unknown';
  const forms = Array.isArray(key?.forms)
    ? key.forms.filter((form): form is string => typeof form === 'string')
    : undefined;
  return {
    id,
    tag: typeof row.tag === 'string' ? row.tag : null,
    encoding: typeof row.encoding === 'string' ? row.encoding : '',
    key: { shape, ...(forms && forms.length > 0 ? { forms } : {}) },
    stake: typeof row.stake === 'string' ? row.stake : '',
  };
}

export function fallbackKindCatalog(): CatalogKind[] {
  return KIND_CATALOG.map((kind) => ({
    id: kind.id,
    tag: kind.tag,
    encoding: kind.encoding,
    key: {
      shape: kind.key.shape,
      ...(kind.key.forms ? { forms: [...kind.key.forms] } : {}),
    },
    stake: kind.stake,
  }));
}

export async function loadKindCatalog(): Promise<CatalogKind[]> {
  const data = await ledgerGet(routes.ledgerKinds);
  const rawKinds =
    data && typeof data === 'object' && Array.isArray((data as { kinds?: unknown }).kinds)
      ? (data as { kinds: unknown[] }).kinds
      : [];
  const kinds = rawKinds
    .map(asCatalogKind)
    .filter((kind): kind is CatalogKind => kind !== null);
  return kinds.length > 0 ? kinds : fallbackKindCatalog();
}
