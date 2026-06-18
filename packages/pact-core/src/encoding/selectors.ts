import { keccak256, toBytes } from 'viem';

export function canonicalizeSelectors(selectors: string[]): string {
  const unique = [...new Set(selectors.map((s) => s.trim().toLowerCase()))].sort();
  return unique.join(',');
}

export function hashSelectors(selectors: string[]): `0x${string}` {
  const canonical = canonicalizeSelectors(selectors);
  return keccak256(toBytes(canonical));
}
