import { encodePacked, keccak256, toBytes, toHex, type Hex } from 'viem';
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

export function fingerprintToHex(bytes: Uint8Array): Hex {
  if (bytes.length !== 32) throw new Error('fingerprint must be 32 bytes');
  return toHex(bytes);
}
