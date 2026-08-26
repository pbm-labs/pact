import { encodePacked, keccak256, toBytes, type Hex } from 'viem';
import { normalizeDomain } from './domain.js';

/** Kind tag. DMARC leaves stay untagged (v0.2). CT leaves MUST prefix this. */
export const CT_KIND_TAG = 'pact-ct-v1' as const;

export function ctKindId(): Hex {
  return keccak256(toBytes(CT_KIND_TAG));
}

export interface CtLeafInput {
  domain: string;
  /** 32-byte fingerprint (SHA-256 of DER, or keccak of serial|issuer|notBefore if SHA-256 unknown) */
  fingerprint: Hex;
  loggedAt: bigint;
  notBefore: bigint;
  notAfter: bigint;
  logId: string;
  logIndex: bigint;
}

export function normalizeFingerprint(value: string): Hex {
  const hex = value.trim().toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{64}$/.test(hex)) {
    throw new Error('fingerprint must be 32 bytes hex');
  }
  return `0x${hex}`;
}

export function fingerprintFromParts(serial: string, issuer: string, notBefore: bigint): Hex {
  return keccak256(toBytes(`${serial.trim().toLowerCase()}|${issuer.trim()}|${notBefore.toString()}`));
}

export function fingerprintFromSha256(value: string | undefined | null): Hex | null {
  if (!value) return null;
  const hex = value.trim().toLowerCase().replace(/^0x/, '');
  return /^[0-9a-f]{64}$/.test(hex) ? `0x${hex}` : null;
}

/** Parse crt.sh / ISO-8601 timestamps (`2016-01-01T00:00:00` or space-separated). */
export function unixSecondsFromIso(value: string | undefined | null): number | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  const ms = Date.parse(hasZone ? normalized : `${normalized}Z`);
  if (!Number.isFinite(ms)) return null;
  return Math.floor(ms / 1000);
}

function normalizeCertName(value: string): string {
  const trimmed = value.trim().toLowerCase().replace(/\.$/, '');
  if (trimmed.startsWith('*.')) return `*.${normalizeDomain(trimmed.slice(2))}`;
  return normalizeDomain(trimmed);
}

/** SAN/CN coverage for the connected domain. Wildcards match the base and one label below. */
export function certNamesCoverDomain(names: readonly string[], domain: string): boolean {
  const target = normalizeDomain(domain);
  if (!target) return false;
  return names.some((raw) => {
    const name = normalizeCertName(raw);
    if (!name) return false;
    if (name === target) return true;
    if (name.startsWith('*.')) {
      const base = name.slice(2);
      return target === base || target.endsWith(`.${base}`);
    }
    return false;
  });
}

export function computeCtLeafHash(input: CtLeafInput): Hex {
  const domainHash = keccak256(toBytes(normalizeDomain(input.domain)));
  const logIdHash = keccak256(toBytes(input.logId.trim().toLowerCase()));
  const fingerprint = normalizeFingerprint(input.fingerprint);
  return keccak256(
    encodePacked(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'uint256', 'uint256', 'bytes32', 'uint256'],
      [
        ctKindId(),
        domainHash,
        fingerprint,
        input.loggedAt,
        input.notBefore,
        input.notAfter,
        logIdHash,
        input.logIndex,
      ],
    ),
  );
}
