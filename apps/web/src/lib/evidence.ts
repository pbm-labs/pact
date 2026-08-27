import { ledgerGet } from '@/lib/ledger-get';
import { routes } from '@/lib/routes';

export type EvidenceLeaf = {
  leaf_hash: string;
  leaf_index: number;
  included?: boolean;
  identity?: string;
  [key: string]: unknown;
};

export type EvidenceRoot = {
  type: string;
  hash: string | null;
  leaf_count: number;
  contract?: string;
  chain?: string;
};

export type EvidenceResponse = {
  kind: string;
  identity: string;
  echo?: { kind: string; identity: string; submitted: string };
  root?: EvidenceRoot;
  count: number;
  truncated: boolean;
  leaves: EvidenceLeaf[];
};

export const SAMPLE_PROOF_DOMAIN = 'webuildreal.dev';
export const SAMPLE_PROOF_KINDS = ['mail', 'ct'] as const;

export function ledgerEvidenceUrl(kind: string, identity: string): string {
  const url = new URL(routes.ledgerEvidence);
  url.searchParams.set('kind', kind);
  url.searchParams.set('identity', identity.trim());
  return url.toString();
}

export function ledgerLeafUrl(hash: string): string {
  const hex = hash.trim().toLowerCase().replace(/^0x/, '');
  return `${routes.ledger}/v1/leaves/${hex}`;
}

function asEvidence(raw: unknown): EvidenceResponse | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  if (typeof row.kind !== 'string' || typeof row.identity !== 'string') return null;
  if (!Array.isArray(row.leaves)) return null;
  const rootRaw = row.root && typeof row.root === 'object' ? (row.root as Record<string, unknown>) : null;
  const echoRaw = row.echo && typeof row.echo === 'object' ? (row.echo as Record<string, unknown>) : null;
  const leaves = row.leaves.filter((leaf): leaf is EvidenceLeaf => {
    if (!leaf || typeof leaf !== 'object') return false;
    const item = leaf as Record<string, unknown>;
    return typeof item.leaf_hash === 'string' && Number.isFinite(Number(item.leaf_index));
  });
  return {
    kind: row.kind,
    identity: row.identity,
    count: typeof row.count === 'number' ? row.count : leaves.length,
    truncated: Boolean(row.truncated),
    leaves,
    ...(echoRaw && typeof echoRaw.identity === 'string'
      ? {
          echo: {
            kind: typeof echoRaw.kind === 'string' ? echoRaw.kind : row.kind,
            identity: echoRaw.identity,
            submitted: typeof echoRaw.submitted === 'string' ? echoRaw.submitted : row.identity,
          },
        }
      : {}),
    ...(rootRaw
      ? {
          root: {
            type: typeof rootRaw.type === 'string' ? rootRaw.type : 'shared',
            hash: typeof rootRaw.hash === 'string' ? rootRaw.hash : null,
            leaf_count: typeof rootRaw.leaf_count === 'number' ? rootRaw.leaf_count : 0,
            ...(typeof rootRaw.contract === 'string' ? { contract: rootRaw.contract } : {}),
            ...(typeof rootRaw.chain === 'string' ? { chain: rootRaw.chain } : {}),
          },
        }
      : {}),
  };
}

export async function fetchEvidence(
  kind: string,
  identity: string,
): Promise<EvidenceResponse | null> {
  return asEvidence(await ledgerGet(ledgerEvidenceUrl(kind, identity)));
}

export type LiveProofData = {
  domain: string;
  results: EvidenceResponse[];
};

export async function loadLiveProof(
  domain: string,
  kinds: readonly string[] = SAMPLE_PROOF_KINDS,
): Promise<LiveProofData | null> {
  const results = (
    await Promise.all(kinds.map((kind) => fetchEvidence(kind, domain)))
  ).filter((row): row is EvidenceResponse => row !== null);
  const hasHistory = results.some((row) => row.count > 0);
  if (!hasHistory) return null;
  return { domain, results };
}
