import type { AggregatedLeafData } from './parser.js';
import type { LeafInput } from '../encoding/leaf.js';
import { unionWrapperDkim, unionWrapperHashes, type WrapperDkimId } from '../encoding/wrapper.js';

export function leafInputFromAggregation(agg: AggregatedLeafData): LeafInput {
  return {
    domain: agg.key.domain,
    periodStart: agg.key.periodStart,
    periodEnd: agg.key.periodEnd,
    reporterOrg: agg.key.reporterOrg,
    dkimPassCount: agg.dkimPassCount,
    dkimFailCount: agg.dkimFailCount,
    selectors: agg.selectors,
    sourceIps: agg.sourceIps,
    reportId: agg.reportId,
    wrapperHashes: agg.wrapperHashes,
    wrapperDkim: agg.wrapperDkim,
  };
}

export interface ExistingLeafRow {
  dkim_pass_count: number | string;
  dkim_fail_count: number | string;
  selectors: string[];
  ip_ranges: string[];
  wrapper_hashes?: string[];
  wrapper_dkim?: WrapperDkimId[];
}

/** Merge a new aggregation into an existing leaf row (same domain/period/reporter). */
export function mergeLeafAggregation(
  existing: ExistingLeafRow,
  agg: AggregatedLeafData,
): AggregatedLeafData {
  const selectors = [...new Set([...(existing.selectors ?? []), ...agg.selectors])];
  const sourceIps = [...new Set([...(existing.ip_ranges ?? []), ...agg.sourceIps])];
  return {
    key: agg.key,
    reportId: agg.reportId,
    dkimPassCount: BigInt(existing.dkim_pass_count) + agg.dkimPassCount,
    dkimFailCount: BigInt(existing.dkim_fail_count) + agg.dkimFailCount,
    selectors,
    sourceIps,
    wrapperHashes: unionWrapperHashes(existing.wrapper_hashes, agg.wrapperHashes),
    wrapperDkim: unionWrapperDkim(existing.wrapper_dkim, agg.wrapperDkim),
  };
}
