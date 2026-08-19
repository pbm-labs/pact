import { SparseMerkleTree, type Hash } from '@pact/core';
import { publishRootOnChain } from './chain.js';
import {
  getLatestMerkleRoot,
  getTxHashForRoot,
  insertMerkleRoot,
  listLeafHashes,
} from './ledger.js';

export interface IngestEnv {
  DB: D1Database;
  CHAIN_RPC_URL: string;
  PUBLISHER_PRIVATE_KEY?: string;
}

export type PublishRootResult =
  | { status: 'empty' }
  | { status: 'published'; root: Hash; leafCount: number; txHash: string | null }
  | { status: 'skipped'; root: Hash; leafCount: number; reason: string }
  | { status: 'staging'; root: Hash; leafCount: number; reason: string };

async function recordMerkleRoot(
  db: D1Database,
  input: {
    rootHash: Hash;
    leafCount: number;
    anchorType: 'staging' | 'base';
    txHash?: string | null;
  },
): Promise<void> {
  const latest = await getLatestMerkleRoot(db);
  if (
    latest &&
    latest.rootHash.toLowerCase() === input.rootHash.toLowerCase() &&
    latest.anchorType === input.anchorType &&
    (input.anchorType === 'staging' || Boolean(latest.txHash) === Boolean(input.txHash))
  ) {
    return;
  }
  await insertMerkleRoot(db, input);
}

export async function publishAnchoredRoot(env: IngestEnv): Promise<PublishRootResult> {
  const leaves = await listLeafHashes(env.DB);
  if (!leaves.length) return { status: 'empty' };

  const tree = new SparseMerkleTree();
  for (const leaf of leaves) {
    tree.insert(leaf.leaf_hash as Hash);
  }
  const root = tree.getRoot();
  const leafCount = leaves.length;

  if (!env.PUBLISHER_PRIVATE_KEY) {
    await recordMerkleRoot(env.DB, {
      rootHash: root,
      leafCount,
      anchorType: 'staging',
    });
    return {
      status: 'staging',
      root,
      leafCount,
      reason: 'publisher key missing — wrote staging root only',
    };
  }

  const published = await publishRootOnChain({
    rpcUrl: env.CHAIN_RPC_URL,
    privateKey: env.PUBLISHER_PRIVATE_KEY,
    root,
    leafCount,
  });

  if ('error' in published) {
    await recordMerkleRoot(env.DB, {
      rootHash: root,
      leafCount,
      anchorType: 'staging',
    });
    return {
      status: 'staging',
      root,
      leafCount,
      reason: `on-chain publish: ${published.error}`,
    };
  }

  if ('skipped' in published) {
    return { status: 'skipped', root, leafCount, reason: published.skipped };
  }

  const txHash = published.txHash ?? (await getTxHashForRoot(env.DB, root));
  await recordMerkleRoot(env.DB, {
    rootHash: root,
    leafCount,
    anchorType: 'base',
    txHash,
  });
  return { status: 'published', root, leafCount, txHash };
}
