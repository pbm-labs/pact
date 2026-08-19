import {
  createPublicClient,
  createWalletClient,
  http,
  type Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

export const PACT_ROOTS_ADDRESS = '0x873e76897BC3Fe8EBdfa67cb73404dA75B2d64ee' as const;
export const PACT_ROOTS_CHAIN = baseSepolia;

/** Public Base Sepolia RPCs. Primary is `CHAIN_RPC_URL`; these cover outages. */
export const FALLBACK_RPC_URLS = [
  'https://sepolia.base.org',
  'https://base-sepolia-rpc.publicnode.com',
] as const;

const abi = [
  {
    type: 'function',
    name: 'publishRoot',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'root', type: 'bytes32' },
      { name: 'leafCount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getLatestRoot',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'root', type: 'bytes32' },
      { name: 'leafCount', type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
] as const;

export interface OnChainRoot {
  root: Hex;
  leafCount: bigint;
  timestamp: bigint;
}

export function rpcUrls(primary: string): string[] {
  const out: string[] = [];
  for (const url of [primary, ...FALLBACK_RPC_URLS]) {
    const trimmed = url.trim();
    if (trimmed && !out.includes(trimmed)) out.push(trimmed);
  }
  return out;
}

function publicClient(rpcUrl: string) {
  return createPublicClient({
    chain: PACT_ROOTS_CHAIN,
    transport: http(rpcUrl, { timeout: 15_000 }),
  });
}

async function readLatestRootFrom(rpcUrl: string): Promise<OnChainRoot | null> {
  try {
    const [root, leafCount, timestamp] = await publicClient(rpcUrl).readContract({
      address: PACT_ROOTS_ADDRESS,
      abi,
      functionName: 'getLatestRoot',
    });
    return { root, leafCount, timestamp };
  } catch {
    return null;
  }
}

export async function readLatestRoot(rpcUrl: string): Promise<OnChainRoot | null> {
  for (const url of rpcUrls(rpcUrl)) {
    const latest = await readLatestRootFrom(url);
    if (latest) return latest;
  }
  return null;
}

async function writePublishRoot(input: {
  rpcUrl: string;
  privateKey: Hex;
  root: Hex;
  leafCount: number;
}): Promise<{ txHash: Hex } | { error: string }> {
  const account = privateKeyToAccount(input.privateKey);
  const walletClient = createWalletClient({
    account,
    chain: PACT_ROOTS_CHAIN,
    transport: http(input.rpcUrl, { timeout: 30_000 }),
  });
  try {
    const txHash = await walletClient.writeContract({
      account,
      address: PACT_ROOTS_ADDRESS,
      abi,
      functionName: 'publishRoot',
      args: [input.root, BigInt(input.leafCount)],
    });
    return { txHash };
  } catch (err) {
    return { error: String(err) };
  }
}

export async function publishRootOnChain(input: {
  rpcUrl: string;
  privateKey: string;
  root: Hex;
  leafCount: number;
}): Promise<{ txHash: Hex } | { skipped: string } | { error: string }> {
  const key = input.privateKey.trim();
  const privateKey = (key.startsWith('0x') ? key : `0x${key}`) as Hex;
  const urls = rpcUrls(input.rpcUrl);
  const errors: string[] = [];

  for (const url of urls) {
    const latest = await readLatestRootFrom(url);
    if (latest && latest.root.toLowerCase() === input.root.toLowerCase()) {
      return { skipped: 'root already on chain' };
    }

    const written = await writePublishRoot({
      rpcUrl: url,
      privateKey,
      root: input.root,
      leafCount: input.leafCount,
    });
    if ('txHash' in written) return written;
    errors.push(`${url}: ${written.error}`);
  }

  return { error: errors.join(' | ') || 'no rpc' };
}
