import {
  aggregateReportToLeaves,
  buildLeafComponents,
  computeLeafHash,
  hexToBytea,
  byteaToHash,
  leafInputFromAggregation,
  mergeLeafAggregation,
  parseDmarcAggregateReport,
  SparseMerkleTree,
  validateReportSource,
} from '@pact/core';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseAdmin } from './supabase.js';

export interface ReportJob {
  envelopeFrom: string;
  rawXml: string;
  receivedAt: string;
}

export interface ProcessResult {
  processed: number;
  skipped: number;
  rejected: number;
  errors: string[];
}

export async function processReportJob(
  supabase: SupabaseClient,
  job: ReportJob,
): Promise<ProcessResult> {
  const result: ProcessResult = { processed: 0, skipped: 0, rejected: 0, errors: [] };

  let reports;
  try {
    reports = parseDmarcAggregateReport(job.rawXml);
  } catch (err) {
    result.errors.push(`parse failed: ${String(err)}`);
    result.rejected += 1;
    return result;
  }

  if (!reports.length) {
    result.errors.push('no records in XML');
    result.rejected += 1;
    return result;
  }

  for (const report of reports) {
    if (!validateReportSource(report.orgName, job.envelopeFrom)) {
      result.rejected += 1;
      result.errors.push(`auth failed: ${report.orgName} from ${job.envelopeFrom}`);
      continue;
    }

    const { data: domainRow } = await supabase
      .from('domains')
      .select('domain')
      .eq('domain', report.domain)
      .maybeSingle();

    if (!domainRow) {
      result.skipped += 1;
      result.errors.push(`domain not registered: ${report.domain}`);
      continue;
    }

    const { data: existingDedup } = await supabase
      .from('processed_reports')
      .select('id')
      .eq('report_id', report.reportId)
      .eq('reporter_org', report.orgName)
      .eq('period_start', Number(report.periodStart))
      .eq('period_end', Number(report.periodEnd))
      .eq('header_from', report.domain)
      .maybeSingle();

    if (existingDedup) {
      result.skipped += 1;
      continue;
    }

    let reportLeavesProcessed = 0;
    for (const agg of aggregateReportToLeaves(report)) {
      const mergedAgg = await loadMergedAggregation(supabase, agg);
      const leafInput = leafInputFromAggregation(mergedAgg);
      const components = buildLeafComponents(leafInput);
      const leafHash = computeLeafHash(leafInput);

      const { error: leafError } = await supabase.rpc('insert_leaf', {
        p_leaf_hash: hexToBytea(leafHash),
        p_domain: components.domain,
        p_period_start: Number(components.periodStart),
        p_period_end: Number(components.periodEnd),
        p_reporter_org: components.reporterOrg,
        p_dkim_pass_count: Number(components.dkimPassCount),
        p_dkim_fail_count: Number(components.dkimFailCount),
        p_domain_hash: hexToBytea(components.domainHash),
        p_reporter_hash: hexToBytea(components.reporterHash),
        p_selector_hash: hexToBytea(components.selectorHash),
        p_source_ip_hash: hexToBytea(components.sourceIpHash),
        p_report_hash: hexToBytea(components.reportHash),
        p_selectors: mergedAgg.selectors,
        p_ip_ranges: mergedAgg.sourceIps,
      });

      if (leafError) {
        result.errors.push(`insert_leaf: ${leafError.message}`);
        result.rejected += 1;
        continue;
      }

      reportLeavesProcessed += 1;
      result.processed += 1;
    }

    if (reportLeavesProcessed > 0) {
      const { error: dedupError } = await supabase.from('processed_reports').insert({
        report_id: report.reportId,
        reporter_org: report.orgName,
        period_start: Number(report.periodStart),
        period_end: Number(report.periodEnd),
        header_from: report.domain,
        envelope_sender: job.envelopeFrom,
      });

      if (dedupError) {
        result.errors.push(`dedup insert: ${dedupError.message}`);
      }
    }
  }

  if (result.processed > 0) {
    const rootError = await publishStagingRoot(supabase);
    if (rootError) result.errors.push(rootError);
  }

  return result;
}

async function loadMergedAggregation(
  supabase: SupabaseClient,
  agg: ReturnType<typeof aggregateReportToLeaves>[number],
) {
  const { data: existing } = await supabase
    .from('leaves')
    .select('dkim_pass_count, dkim_fail_count, selectors, ip_ranges')
    .eq('domain', agg.key.domain)
    .eq('period_start', Number(agg.key.periodStart))
    .eq('period_end', Number(agg.key.periodEnd))
    .eq('reporter_org', agg.key.reporterOrg)
    .maybeSingle();

  if (!existing) return agg;
  return mergeLeafAggregation(existing, agg);
}

async function publishStagingRoot(supabase: SupabaseClient): Promise<string | null> {
  const { data: leaves, error } = await supabase
    .from('leaves')
    .select('leaf_index, leaf_hash')
    .order('leaf_index', { ascending: true });

  if (error) return `merkle fetch: ${error.message}`;
  if (!leaves?.length) return null;

  const tree = new SparseMerkleTree();
  for (const leaf of leaves) {
    tree.insert(byteaToHash(leaf.leaf_hash));
  }

  const root = tree.getRoot();
  const { error: insertError } = await supabase.from('merkle_roots').insert({
    root_hash: hexToBytea(root),
    leaf_count: leaves.length,
    anchor_type: 'staging',
  });

  if (insertError) return `merkle insert: ${insertError.message}`;
  return null;
}

export function createProcessor(env: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string }) {
  const supabase = createSupabaseAdmin(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  return (job: ReportJob) => processReportJob(supabase, job);
}
