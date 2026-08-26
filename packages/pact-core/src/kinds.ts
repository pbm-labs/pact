/** Runtime catalog for leftover kinds. Proofs name a root; v1 is the shared tree. */

export type KindId = 'mail' | 'ct' | 'rekor';
export type KindStake = 'calendar' | 'accumulated';

export interface KindRootRef {
  type: 'shared';
}

export interface KindCatalogEntry {
  id: KindId;
  tag: string | null;
  encoding: string;
  key: {
    shape: 'dns_name' | 'leftover_subject';
    forms?: Array<'dns_name' | 'uri' | 'email'>;
  };
  stake: KindStake;
  kind_root: KindRootRef;
}

export const KIND_CATALOG: readonly KindCatalogEntry[] = [
  {
    id: 'mail',
    tag: null,
    encoding: 'untagged-v0.2',
    key: { shape: 'dns_name' },
    stake: 'accumulated',
    kind_root: { type: 'shared' },
  },
  {
    id: 'ct',
    tag: 'pact-ct-v1',
    encoding: 'pact-ct-v1',
    key: { shape: 'dns_name' },
    stake: 'calendar',
    kind_root: { type: 'shared' },
  },
  {
    id: 'rekor',
    tag: 'pact-rekor-v1',
    encoding: 'pact-rekor-v1',
    key: {
      shape: 'leftover_subject',
      forms: ['dns_name', 'uri', 'email'],
    },
    stake: 'calendar',
    kind_root: { type: 'shared' },
  },
];

export function parseKindId(raw: string): KindId | null {
  const id = raw.trim().toLowerCase();
  if (id === 'mail' || id === 'dmarc') return 'mail';
  if (id === 'ct') return 'ct';
  if (id === 'rekor' || id === 'signatures') return 'rekor';
  return null;
}

export function kindCatalogDocument() {
  return {
    tree: { type: 'shared' as const, meta_root: 'reserved' as const },
    kinds: KIND_CATALOG,
  };
}
