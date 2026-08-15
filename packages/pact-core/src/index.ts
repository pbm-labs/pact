export {
  validateReportSource,
  isAllowedReporter,
  isAllowedForwardingAgent,
  isKnownReporterOrg,
  dkimMatchesReporter,
  REPORTER_ALLOWLIST,
  type ReportSourceAuth,
} from './auth/allowlist.js';
export { hexToBytea, byteaToHash, byteaToHex } from './encoding/bytea.js';
export { normalizeDomain, normalizeReporter } from './encoding/domain.js';
export { canonicalizeSelectors, hashSelectors } from './encoding/selectors.js';
export { canonicalizeIpRanges, hashIpRanges, truncateIp } from './encoding/ips.js';
export {
  buildLeafComponents,
  computeLeafHash,
  computeReportHash,
  type LeafInput,
  type LeafComponents,
} from './encoding/leaf.js';
export { SparseMerkleTree, TREE_DEPTH, ZERO_HASHES, type Hash } from './merkle/sparse.js';
export {
  computeTrustScore,
  computeDiversity,
  computeMaturity,
  SCORE_ALGORITHM,
  ACTIVATION_THRESHOLD,
  ACTIVATION_DAYS,
  type TrustScoreResult,
  type DomainTrustInput,
  type ScoreStatus,
} from './trust/score.js';
export {
  formatScoreForDisplay,
  estimateScoreProgress,
  DISPLAY_VERSION,
  type TrustDisplayScore,
  type TrustDisplayBand,
  type TrustProgressBandKey,
  type TrustScoreProgress,
} from './trust/display.js';
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
