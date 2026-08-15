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
