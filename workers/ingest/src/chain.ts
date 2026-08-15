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

export async function readLatestRoot(rpcUrl: string): Promise<OnChainRoot | null> {
  const publicClient = createPublicClient({
    chain: PACT_ROOTS_CHAIN,
    transport: http(rpcUrl),
  });
  try {
    const [root, leafCount, timestamp] = await publicClient.readContract({
      address: PACT_ROOTS_ADDRESS,
      abi,
      functionName: 'getLatestRoot',
    });
    return { root, leafCount, timestamp };
  } catch {
    return null;
  }
}

export async function publishRootOnChain(input: {
  rpcUrl: string;
  privateKey: string;
  root: Hex;
  leafCount: number;
}): Promise<{ txHash: Hex } | { skipped: string } | { error: string }> {
  const latest = await readLatestRoot(input.rpcUrl);
  if (latest && latest.root.toLowerCase() === input.root.toLowerCase()) {
    return { skipped: 'root already on chain' };
  }

  const key = input.privateKey.trim();
  const privateKey = (key.startsWith('0x') ? key : `0x${key}`) as Hex;
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: PACT_ROOTS_CHAIN,
    transport: http(input.rpcUrl),
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
