import { SparseMerkleTree, byteaToHash, type Hash } from '@pact/core';

export interface GlobalMerkleTree {
  tree: SparseMerkleTree;
  root: Hash;
}

export function rebuildGlobalMerkleTree(
  leaves: { leaf_index: number; leaf_hash: unknown }[],
): GlobalMerkleTree | null {
  if (!leaves.length) return null;

  const ordered = [...leaves].sort((a, b) => a.leaf_index - b.leaf_index);
  const tree = new SparseMerkleTree();
  for (const leaf of ordered) {
    tree.insert(byteaToHash(leaf.leaf_hash));
  }
  return { tree, root: tree.getRoot() };
}

export interface LeafMerkleProof {
  leafIndex: number;
  leafHash: Hash;
  proof: Hash[];
  proofValid: boolean;
}

export function buildLeafProof(
  tree: SparseMerkleTree,
  root: Hash,
  leafIndex: number,
  leafHash: Hash,
): LeafMerkleProof {
  const proof = tree.getProof(leafIndex);
  const proofValid = tree.verifyProof(leafHash, leafIndex, proof, root);
  return { leafIndex, leafHash, proof, proofValid };
}
