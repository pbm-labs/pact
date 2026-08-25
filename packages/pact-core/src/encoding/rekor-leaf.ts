import { encodePacked, keccak256, toBytes, type Hex } from 'viem';
import { normalizeDomain } from './domain.js';

/** Kind tag. DMARC stays untagged. CT uses pact-ct-v1. Rekor MUST prefix this. */
export const REKOR_KIND_TAG = 'pact-rekor-v1' as const;

export function rekorKindId(): Hex {
  return keccak256(toBytes(REKOR_KIND_TAG));
}

export interface RekorLeafInput {
  domain: string;
  /** Rekor entry UUID (64 or 80 hex). Hashed into the leaf. */
  uuid: string;
  /** SAN / email / URI that bound this entry to the domain. */
  identity: string;
  integratedTime: bigint;
  logId: string;
  logIndex: bigint;
}

export function normalizeRekorUuid(value: string): string {
  const hex = value.trim().toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{64}$|^[0-9a-f]{80}$/.test(hex)) {
    throw new Error('rekor uuid must be 32 or 40 bytes hex');
  }
  return hex;
}

export function rekorEntryIdHash(uuid: string): Hex {
  return keccak256(toBytes(normalizeRekorUuid(uuid)));
}

export function rekorIdentityHash(identity: string): Hex {
  return keccak256(toBytes(identity.trim().toLowerCase()));
}

function hostCoversDomain(host: string, target: string): boolean {
  const h = host.trim().toLowerCase().replace(/\.$/, '');
  if (!h || !target) return false;
  return h === target || h.endsWith(`.${target}`);
}

/**
 * Bind a Rekor identity to a connected domain.
 * Email host, URI host, or bare DNS must cover the domain.
 * github.com (and any other unrelated host) does not cover a customer's name.
 */
export function rekorIdentityCoversDomain(identity: string, domain: string): boolean {
  const target = normalizeDomain(domain);
  const raw = identity.trim().toLowerCase();
  if (!target || !raw) return false;

  const at = raw.lastIndexOf('@');
  if (at > 0 && !raw.includes('://')) {
    return hostCoversDomain(raw.slice(at + 1), target);
  }

  try {
    const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
    return hostCoversDomain(url.hostname, target);
  } catch {
    return hostCoversDomain(raw, target);
  }
}

export function computeRekorLeafHash(input: RekorLeafInput): Hex {
  const domainHash = keccak256(toBytes(normalizeDomain(input.domain)));
  const logIdHash = keccak256(toBytes(input.logId.trim().toLowerCase()));
  return keccak256(
    encodePacked(
      ['bytes32', 'bytes32', 'bytes32', 'bytes32', 'uint256', 'bytes32', 'uint256'],
      [
        rekorKindId(),
        domainHash,
        rekorEntryIdHash(input.uuid),
        rekorIdentityHash(input.identity),
        input.integratedTime,
        logIdHash,
        input.logIndex,
      ],
    ),
  );
}
