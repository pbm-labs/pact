import { encodePacked, keccak256, toBytes, type Hex } from 'viem';
import { normalizeDomain } from './domain.js';
import { canonicalRekorIdentity } from './rekor-index.js';

/** Kind tag. DMARC stays untagged. CT uses pact-ct-v1. Rekor MUST prefix this. */
export const REKOR_KIND_TAG = 'pact-rekor-v1' as const;

export function rekorKindId(): Hex {
  return keccak256(toBytes(REKOR_KIND_TAG));
}

export interface RekorLeafInput {
  /** @deprecated leftover subject is `identity`. Kept so host leftover hashes match v0.4 tests. */
  domain?: string;
  /** Rekor entry UUID (64 or 80 hex). Hashed into the leaf. */
  uuid: string;
  /** Leftover subject as logged (host, URI, or email). Key of the kind. */
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
 * Whether a leftover subject’s host is this DNS name.
 * Used for mail/CT-style host leftover only — not to attach GitHub URIs to a customer domain.
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
  const leftover =
    canonicalRekorIdentity(input.identity) ??
    (input.domain ? normalizeDomain(input.domain) : '');
  if (!leftover) throw new Error('rekor leftover identity required');
  const leftoverHash = keccak256(toBytes(leftover));
  const logIdHash = keccak256(toBytes(input.logId.trim().toLowerCase()));
  return keccak256(
    encodePacked(
      ['bytes32', 'bytes32', 'bytes32', 'bytes32', 'uint256', 'bytes32', 'uint256'],
      [
        rekorKindId(),
        leftoverHash,
        rekorEntryIdHash(input.uuid),
        leftoverHash,
        input.integratedTime,
        logIdHash,
        input.logIndex,
      ],
    ),
  );
}
