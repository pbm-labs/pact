import type { Hash } from '../merkle/sparse.js';

/** Normalize a hex hash from D1 (with or without `0x` / `\\x`) to a viem Hash. */
export function byteaToHash(value: unknown): Hash {
  if (typeof value === 'string') {
    const hex = value.startsWith('\\x') ? value.slice(2) : value.replace(/^0x/, '');
    return `0x${hex}` as Hash;
  }
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value as ArrayLike<number>);
  return `0x${[...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')}` as Hash;
}
