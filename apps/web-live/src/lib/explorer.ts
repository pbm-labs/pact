const BASE_SEPOLIA_EXPLORER = 'https://sepolia.basescan.org';

export function explorerTxUrl(txHash: string): string {
  const hex = txHash.startsWith('0x') ? txHash : `0x${txHash}`;
  return `${BASE_SEPOLIA_EXPLORER}/tx/${hex}`;
}

export function explorerAddressUrl(address: string): string {
  return `${BASE_SEPOLIA_EXPLORER}/address/${address}`;
}
