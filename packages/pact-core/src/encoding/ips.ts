import { keccak256, toBytes } from 'viem';

/** Truncate IPv4 to /24 or IPv6 to /48 per Appendix C.2 */
export function truncateIp(ip: string): string {
  const trimmed = ip.trim();
  if (trimmed.includes(':')) {
    return truncateIpv6(trimmed);
  }
  const parts = trimmed.split('.');
  if (parts.length !== 4) return trimmed;
  parts[3] = '0';
  return parts.join('.');
}

function truncateIpv6(ip: string): string {
  const expanded = expandIpv6(ip);
  const hextets = expanded.split(':');
  const prefix = hextets.slice(0, 3).join(':');
  return `${prefix}::`;
}

function expandIpv6(ip: string): string {
  if (ip.includes('::')) {
    const [left, right] = ip.split('::');
    const leftParts = left ? left.split(':') : [];
    const rightParts = right ? right.split(':') : [];
    const missing = 8 - leftParts.length - rightParts.length;
    const middle = Array(missing).fill('0');
    return [...leftParts, ...middle, ...rightParts].join(':');
  }
  return ip;
}

export function canonicalizeIpRanges(ips: string[]): string {
  const unique = [...new Set(ips.map(truncateIp))].sort();
  return unique.join(',');
}

export function hashIpRanges(ips: string[]): `0x${string}` {
  const canonical = canonicalizeIpRanges(ips);
  return keccak256(toBytes(canonical));
}
