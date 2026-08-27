export type DnsPath = 'cloudflare' | 'manual';
export type ConnectPath = DnsPath | 'dmarc-tool';

export function parseConnectPath(value: string | undefined): ConnectPath | null {
  return value === 'cloudflare' || value === 'manual' || value === 'dmarc-tool' ? value : null;
}
