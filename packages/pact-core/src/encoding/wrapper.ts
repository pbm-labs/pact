import { keccak256, toBytes } from 'viem';

export interface WrapperDkimId {
  domain: string;
  selector: string;
}

function normalizeHexHash(value: string): string {
  return value.trim().toLowerCase().replace(/^0x/, '');
}

/** keccak256 of the wrapper RFC822 bytes (the signed message). */
export function hashWrapperMessage(raw: Uint8Array): `0x${string}` {
  return keccak256(raw);
}

export function canonicalizeWrapperHashes(hashes: readonly string[]): string {
  const unique = [...new Set(hashes.map(normalizeHexHash).filter(Boolean))].sort();
  return unique.join(',');
}

export function hashWrapperMessages(hashes: readonly string[]): `0x${string}` {
  return keccak256(toBytes(canonicalizeWrapperHashes(hashes)));
}

export function formatWrapperDkimId(id: WrapperDkimId): string {
  return `${id.domain.trim().toLowerCase()}:${id.selector.trim().toLowerCase()}`;
}

export function canonicalizeWrapperDkim(ids: readonly WrapperDkimId[]): string {
  const unique = [...new Set(ids.map(formatWrapperDkimId).filter((row) => row !== ':'))].sort();
  return unique.join(',');
}

export function hashWrapperDkim(ids: readonly WrapperDkimId[]): `0x${string}` {
  return keccak256(toBytes(canonicalizeWrapperDkim(ids)));
}

export interface WrapperOpeningCheck {
  hashMatches: boolean;
  computedHash: `0x${string}`;
  dkimKeysOnRecord: boolean;
}

/** Recheck what we can without the original SMTP bytes: stored hash + DNS TXT snapshot. */
export function checkWrapperOpening(input: {
  expectedHash: string;
  rfc822: Uint8Array;
  dkim: readonly { selector?: string; txt?: string[] | null }[];
}): WrapperOpeningCheck {
  const computedHash = hashWrapperMessage(input.rfc822);
  const expected = input.expectedHash.trim().toLowerCase().replace(/^0x/, '');
  const keyed = input.dkim.filter((row) => (row.selector ?? '').trim());
  return {
    hashMatches: computedHash.slice(2) === expected,
    computedHash,
    dkimKeysOnRecord: keyed.length > 0 && keyed.every((row) => (row.txt?.length ?? 0) > 0),
  };
}

export function unionWrapperHashes(
  a: readonly string[] | undefined,
  b: readonly string[] | undefined,
): string[] {
  const unique = [...new Set([...(a ?? []), ...(b ?? [])].map(normalizeHexHash).filter(Boolean))].sort();
  return unique.map((hash) => `0x${hash}`);
}

export function unionWrapperDkim(
  a: readonly WrapperDkimId[] | undefined,
  b: readonly WrapperDkimId[] | undefined,
): WrapperDkimId[] {
  const byId = new Map<string, WrapperDkimId>();
  for (const id of [...(a ?? []), ...(b ?? [])]) {
    const key = formatWrapperDkimId(id);
    if (key === ':') continue;
    byId.set(key, {
      domain: id.domain.trim().toLowerCase(),
      selector: id.selector.trim().toLowerCase(),
    });
  }
  return [...byId.values()].sort((left, right) =>
    formatWrapperDkimId(left).localeCompare(formatWrapperDkimId(right)),
  );
}
