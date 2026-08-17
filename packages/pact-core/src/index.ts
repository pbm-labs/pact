export {
  validateReportSource,
  isAllowedReporter,
  isAllowedForwardingAgent,
  isKnownReporterOrg,
  dkimMatchesReporter,
  extractEnvelopeDomain,
  domainSuffixMatches,
  REPORTER_ALLOWLIST,
  FORWARDING_AGENT_ALLOWLIST,
  type ReportSourceAuth,
} from './auth/allowlist.js';
export {
  parseDkimIdsFromRfc822,
  resolveWrapperDkimWitness,
  wrapperDkimFromEnvelope,
  type WrapperDkimSource,
  type WrapperDkimWitness,
} from './auth/wrapper-witness.js';
export { byteaToHash } from './encoding/bytea.js';
export { normalizeDomain, normalizeReporter } from './encoding/domain.js';
export { canonicalizeSelectors, hashSelectors } from './encoding/selectors.js';
export { canonicalizeIpRanges, hashIpRanges, truncateIp } from './encoding/ips.js';
export {
  canonicalizeWrapperDkim,
  canonicalizeWrapperHashes,
  formatWrapperDkimId,
  hashWrapperDkim,
  hashWrapperMessage,
  hashWrapperMessages,
  checkWrapperOpening,
  unionWrapperDkim,
  unionWrapperHashes,
  type WrapperDkimId,
  type WrapperOpeningCheck,
} from './encoding/wrapper.js';
export {
  buildLeafComponents,
  computeLeafHash,
  computeReportHash,
  type LeafInput,
  type LeafComponents,
} from './encoding/leaf.js';
export { SparseMerkleTree, TREE_DEPTH, ZERO_HASHES, type Hash } from './merkle/sparse.js';
export {
  parseDmarcAggregateReport,
  aggregateReportToLeaves,
  type ParsedDmarcReport,
  type AggregatedLeafData,
} from './dmarc/parser.js';
export {
  leafInputFromAggregation,
  mergeLeafAggregation,
  type ExistingLeafRow,
} from './dmarc/leaf-input.js';
export {
  PACT_RUA_MAILTO,
  PACT_RUA_ADDRESS,
  PACT_RUA_LEGACY_ADDRESSES,
  addPactRuaToDmarc,
  dmarcIncludesPactRua,
  parseDmarcTags,
  serializeDmarcTags,
} from './dmarc/rua.js';
