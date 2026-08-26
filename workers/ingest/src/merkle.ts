import { SparseMerkleTree, byteaToHash, type Hash } from '@pact/core';
import { listLeafHashes } from './ledger.js';

export async function loadSharedTree(db: D1Database): Promise<{
  tree: SparseMerkleTree;
  root: Hash;
  leafCount: number;
} | null> {
  const leaves = await listLeafHashes(db);
  if (!leaves.length) return null;
  const tree = new SparseMerkleTree();
  for (const leaf of leaves) {
    tree.insert(byteaToHash(leaf.leaf_hash));
  }
  return { tree, root: tree.getRoot(), leafCount: leaves.length };
}

export function leafIncluded(
  tree: SparseMerkleTree | undefined,
  leafIndex: number,
  leafHash: string,
): boolean {
  if (!tree) return false;
  return tree.hasLeaf(leafIndex, byteaToHash(leafHash));
}

export function leafProof(
  tree: SparseMerkleTree | undefined,
  leafIndex: number,
  leafHash: string,
): { included: boolean; proof?: Hash[] } {
  const included = leafIncluded(tree, leafIndex, leafHash);
  if (!included || !tree) return { included: false };
  return { included: true, proof: tree.getProof(leafIndex) };
}
