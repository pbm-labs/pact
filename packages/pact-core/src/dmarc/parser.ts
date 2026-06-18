import { XMLParser } from 'fast-xml-parser';
import { normalizeDomain, normalizeReporter } from '../encoding/domain.js';

export interface DmarcRecordRow {
  sourceIp: string;
  count: number;
  dkimResult: 'pass' | 'fail' | 'neutral' | 'none' | 'policy' | 'unknown';
}

export interface DmarcAuthResult {
  domain: string;
  selector: string;
  result: string;
}

export interface ParsedDmarcReport {
  reportId: string;
  orgName: string;
  periodStart: bigint;
  periodEnd: bigint;
  domain: string;
  rows: DmarcRecordRow[];
  authResults: DmarcAuthResult[];
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function parseDkimResult(value: string | undefined): DmarcRecordRow['dkimResult'] {
  const v = (value ?? 'unknown').toLowerCase();
  if (v === 'pass' || v === 'fail' || v === 'neutral' || v === 'none' || v === 'policy') {
    return v;
  }
  return 'unknown';
}

export function parseDmarcAggregateReport(xml: string): ParsedDmarcReport[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    removeNSPrefix: true,
    trimValues: true,
  });

  const doc = parser.parse(xml);
  const feedback = doc.feedback ?? doc;
  const metadata = feedback.report_metadata ?? feedback.reportMetadata;
  const reportId = String(metadata.report_id ?? metadata.reportId ?? '');
  const orgName = normalizeReporter(String(metadata.org_name ?? metadata.orgName ?? ''));
  const dateRange = metadata.date_range ?? metadata.dateRange;
  const periodStart = BigInt(Number(dateRange?.begin ?? 0));
  const periodEnd = BigInt(Number(dateRange?.end ?? 0));

  const records = asArray(feedback.record);
  const results: ParsedDmarcReport[] = [];

  for (const record of records) {
    const identifiers = record.identifiers ?? {};
    const domain = normalizeDomain(String(identifiers.header_from ?? identifiers.headerFrom ?? ''));
    if (!domain) continue;

    const rows: DmarcRecordRow[] = asArray(record.row).map((row) => ({
      sourceIp: String(row.source_ip ?? row.sourceIp ?? ''),
      count: Number(row.count ?? 0),
      dkimResult: parseDkimResult(row.policy_evaluated?.dkim ?? row.policyEvaluated?.dkim),
    }));

    const authResults: DmarcAuthResult[] = [];
    const authResultsBlock = record.auth_results ?? record.authResults;
    if (authResultsBlock) {
      for (const dkim of asArray(authResultsBlock.dkim)) {
        authResults.push({
          domain: normalizeDomain(String(dkim.domain ?? '')),
          selector: String(dkim.selector ?? '').toLowerCase(),
          result: String(dkim.result ?? '').toLowerCase(),
        });
      }
    }

    results.push({
      reportId,
      orgName,
      periodStart,
      periodEnd,
      domain,
      rows,
      authResults,
    });
  }

  return results;
}

export interface LeafAggregationKey {
  domain: string;
  periodStart: bigint;
  periodEnd: bigint;
  reporterOrg: string;
}

export interface AggregatedLeafData {
  key: LeafAggregationKey;
  reportId: string;
  dkimPassCount: bigint;
  dkimFailCount: bigint;
  selectors: string[];
  sourceIps: string[];
}

export function aggregateReportToLeaves(report: ParsedDmarcReport): AggregatedLeafData[] {
  const key: LeafAggregationKey = {
    domain: report.domain,
    periodStart: report.periodStart,
    periodEnd: report.periodEnd,
    reporterOrg: report.orgName,
  };

  let passCount = 0n;
  let failCount = 0n;
  const selectors = new Set<string>();
  const sourceIps = new Set<string>();

  for (const row of report.rows) {
    if (row.dkimResult === 'pass') {
      passCount += BigInt(row.count);
    } else if (row.dkimResult === 'fail') {
      failCount += BigInt(row.count);
    }
    if (row.sourceIp) sourceIps.add(row.sourceIp);
  }

  for (const auth of report.authResults) {
    if (auth.selector) selectors.add(auth.selector);
  }

  return [
    {
      key,
      reportId: report.reportId,
      dkimPassCount: passCount,
      dkimFailCount: failCount,
      selectors: [...selectors],
      sourceIps: [...sourceIps],
    },
  ];
}
