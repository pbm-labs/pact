import { encodePacked, keccak256 } from 'viem';

export const TREE_DEPTH = 32;

export type Hash = `0x${string}`;

function computeZeroHashes(depth: number): Hash[] {
  const zeros: Hash[] = [];
  zeros[0] = `0x${'00'.repeat(32)}` as Hash;
  for (let i = 1; i <= depth; i++) {
    zeros[i] = keccak256(encodePacked(['bytes32', 'bytes32'], [zeros[i - 1]!, zeros[i - 1]!]));
  }
  return zeros;
}

export const ZERO_HASHES = computeZeroHashes(TREE_DEPTH);

function nodeKey(level: number, index: number): string {
  return `${level}:${index}`;
}

/**
 * Append-only sparse Merkle tree per v0.2 §3.3.1
 */
export class SparseMerkleTree {
  private readonly nodes = new Map<string, Hash>();
  private leafCount = 0;

  get size(): number {
    return this.leafCount;
  }

  insert(leafHash: Hash): number {
    const index = this.leafCount;
    let currentHash = leafHash;
    let currentIndex = index;

    for (let level = 0; level < TREE_DEPTH; level++) {
      const isRight = currentIndex & 1;
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;
      const sibling = this.nodes.get(nodeKey(level, siblingIndex)) ?? ZERO_HASHES[level]!;

      const parentHash = isRight
        ? keccak256(encodePacked(['bytes32', 'bytes32'], [sibling, currentHash]))
        : keccak256(encodePacked(['bytes32', 'bytes32'], [currentHash, sibling]));

      const parentIndex = currentIndex >> 1;
      this.nodes.set(nodeKey(level, currentIndex), currentHash);
      currentHash = parentHash;
      currentIndex = parentIndex;
    }

    this.nodes.set(nodeKey(TREE_DEPTH, 0), currentHash);
    this.leafCount++;
    return index;
  }

  getRoot(): Hash {
    if (this.leafCount === 0) {
      return ZERO_HASHES[TREE_DEPTH]!;
    }
    return this.nodes.get(nodeKey(TREE_DEPTH, 0)) ?? ZERO_HASHES[TREE_DEPTH]!;
  }

  getProof(leafIndex: number): Hash[] {
    if (leafIndex < 0 || leafIndex >= this.leafCount) {
      throw new Error(`Leaf index out of range: ${leafIndex}`);
    }

    const proof: Hash[] = [];
    let currentIndex = leafIndex;

    for (let level = 0; level < TREE_DEPTH; level++) {
      const isRight = currentIndex & 1;
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;
      const sibling = this.nodes.get(nodeKey(level, siblingIndex)) ?? ZERO_HASHES[level]!;
      proof.push(sibling);
      currentIndex >>= 1;
    }

    return proof;
  }

  verifyProof(leafHash: Hash, leafIndex: number, proof: Hash[], root: Hash): boolean {
    if (proof.length !== TREE_DEPTH) return false;

    let currentHash = leafHash;
    let currentIndex = leafIndex;

    for (let level = 0; level < TREE_DEPTH; level++) {
      const sibling = proof[level]!;
      const isRight = currentIndex & 1;
      currentHash = isRight
        ? keccak256(encodePacked(['bytes32', 'bytes32'], [sibling, currentHash]))
        : keccak256(encodePacked(['bytes32', 'bytes32'], [currentHash, sibling]));
      currentIndex >>= 1;
    }

    return currentHash === root;
  }
}
