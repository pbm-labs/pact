import { encodePacked, keccak256, toBytes } from 'viem';
import { normalizeDomain, normalizeReporter } from './domain.js';
import { hashIpRanges } from './ips.js';
import { hashSelectors } from './selectors.js';
import {
  hashWrapperDkim,
  hashWrapperMessages,
  type WrapperDkimId,
} from './wrapper.js';

export interface LeafInput {
  domain: string;
  periodStart: bigint;
  periodEnd: bigint;
  reporterOrg: string;
  dkimPassCount: bigint;
  dkimFailCount: bigint;
  selectors: string[];
  sourceIps: string[];
  reportId: string;
  /** keccak256(RFC822) hex hashes of authenticating wrapper messages */
  wrapperHashes?: readonly string[];
  /** Passing wrapper DKIM d= / s= pairs */
  wrapperDkim?: readonly WrapperDkimId[];
}

export interface LeafComponents {
  domain: string;
  domainHash: `0x${string}`;
  periodStart: bigint;
  periodEnd: bigint;
  reporterOrg: string;
  reporterHash: `0x${string}`;
  dkimPassCount: bigint;
  dkimFailCount: bigint;
  selectorHash: `0x${string}`;
  sourceIpHash: `0x${string}`;
  reportHash: `0x${string}`;
  wrapperHash: `0x${string}`;
  wrapperDkimHash: `0x${string}`;
}

export function computeReportHash(params: {
  reporterOrg: string;
  reportId: string;
  periodStart: bigint;
  periodEnd: bigint;
  domain: string;
}): `0x${string}` {
  const reporter = normalizeReporter(params.reporterOrg);
  const domain = normalizeDomain(params.domain);
  const payload = [
    reporter,
    params.reportId,
    params.periodStart.toString(),
    params.periodEnd.toString(),
    domain,
  ].join('|');
  return keccak256(toBytes(payload));
}

export function buildLeafComponents(input: LeafInput): LeafComponents {
  const domain = normalizeDomain(input.domain);
  const reporterOrg = normalizeReporter(input.reporterOrg);

  return {
    domain,
    domainHash: keccak256(toBytes(domain)),
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    reporterOrg,
    reporterHash: keccak256(toBytes(reporterOrg)),
    dkimPassCount: input.dkimPassCount,
    dkimFailCount: input.dkimFailCount,
    selectorHash: hashSelectors(input.selectors),
    sourceIpHash: hashIpRanges(input.sourceIps),
    reportHash: computeReportHash({
      reporterOrg,
      reportId: input.reportId,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      domain,
    }),
    wrapperHash: hashWrapperMessages(input.wrapperHashes ?? []),
    wrapperDkimHash: hashWrapperDkim(input.wrapperDkim ?? []),
  };
}

/** Compute leaf hash per Appendix C.4 */
export function computeLeafHash(input: LeafInput): `0x${string}` {
  const c = buildLeafComponents(input);
  const preimage = encodePacked(
    [
      'bytes32',
      'uint256',
      'uint256',
      'bytes32',
      'uint256',
      'uint256',
      'bytes32',
      'bytes32',
      'bytes32',
      'bytes32',
      'bytes32',
    ],
    [
      c.domainHash,
      c.periodStart,
      c.periodEnd,
      c.reporterHash,
      c.dkimPassCount,
      c.dkimFailCount,
      c.selectorHash,
      c.sourceIpHash,
      c.reportHash,
      c.wrapperHash,
      c.wrapperDkimHash,
    ],
  );
  return keccak256(preimage);
}
