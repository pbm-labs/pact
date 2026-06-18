import type { Hash } from '../merkle/sparse.js';

/** Postgres bytea via PostgREST insert: hex string with \\x prefix */
export function hexToBytea(hex: Hash): string {
  return `\\x${hex.slice(2)}`;
}

/** Postgres bytea from PostgREST (hex string or Uint8Array) → viem Hash */
export function byteaToHash(value: unknown): Hash {
  if (typeof value === 'string') {
    const hex = value.startsWith('\\x') ? value.slice(2) : value.replace(/^0x/, '');
    return `0x${hex}` as Hash;
  }
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value as ArrayLike<number>);
  return `0x${[...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')}` as Hash;
}

/** Postgres bytea → display hex (0x prefix) */
export function byteaToHex(value: unknown): string | null {
  if (value == null) return null;
  return byteaToHash(value);
}
