import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  aggregateReportToLeaves,
  computeLeafHash,
  parseDmarcAggregateReport,
  SparseMerkleTree,
  validateReportSource,
  computeTrustScore,
  canonicalizeSelectors,
  canonicalizeIpRanges,
  mergeLeafAggregation,
  leafInputFromAggregation,
  addPactRuaToDmarc,
  PACT_RUA_MAILTO,
} from './index.js';

const fixtureDir = join(dirname(fileURLToPath(import.meta.url)), '../../../fixtures');
const sampleXml = readFileSync(join(fixtureDir, 'dmarc-google-pbm-labs.xml'), 'utf8');

describe('allowlist', () => {
  it('accepts google reporter with google envelope', () => {
    expect(validateReportSource('google.com', 'noreply-dmarc-support@google.com')).toBe(true);
  });

  it('rejects unknown reporter', () => {
    expect(validateReportSource('evil.com', 'attacker@evil.com')).toBe(false);
  });

  it('rejects reporter org without envelope domain', () => {
    expect(validateReportSource('google.com', 'invalid-sender')).toBe(false);
  });
});

describe('dmarc rua', () => {
  it('adds pact rua to existing record', () => {
    const { content, changed } = addPactRuaToDmarc(
      'v=DMARC1; p=quarantine; rua=mailto:hello@example.com',
    );
    expect(changed).toBe(true);
    expect(content).toContain(PACT_RUA_MAILTO);
    expect(content).toContain('hello@example.com');
  });

  it('is idempotent when pact rua already present', () => {
    const existing = `v=DMARC1; p=none; rua=${PACT_RUA_MAILTO}`;
    const { changed } = addPactRuaToDmarc(existing);
    expect(changed).toBe(false);
  });

  it('creates minimal record when missing', () => {
    const { content, changed } = addPactRuaToDmarc(null);
    expect(changed).toBe(true);
    expect(content).toBe(`v=DMARC1; p=none; rua=${PACT_RUA_MAILTO}`);
  });
});

describe('dmarc parser', () => {
  it('parses fixture report', () => {
    const reports = parseDmarcAggregateReport(sampleXml);
    expect(reports).toHaveLength(1);
    expect(reports[0]!.domain).toBe('pbm-labs.com');
    expect(reports[0]!.orgName).toBe('google.com');
    expect(reports[0]!.rows).toHaveLength(2);
  });

  it('aggregates pass and fail counts', () => {
    const reports = parseDmarcAggregateReport(sampleXml);
    const leaves = aggregateReportToLeaves(reports[0]!);
    expect(leaves[0]!.dkimPassCount).toBe(1247n);
    expect(leaves[0]!.dkimFailCount).toBe(3n);
    expect(leaves[0]!.selectors).toContain('google-2024');
  });
});

describe('canonical encoding', () => {
  it('sorts selectors lexicographically', () => {
    expect(canonicalizeSelectors(['google-2024', 'google-2023'])).toBe('google-2023,google-2024');
  });

  it('truncates IPv4 to /24', () => {
    expect(canonicalizeIpRanges(['209.85.220.41', '209.85.220.55'])).toBe('209.85.220.0');
  });
});

describe('leaf merge', () => {
  it('merges counts and arrays for same period key', () => {
    const reports = parseDmarcAggregateReport(sampleXml);
    const agg = aggregateReportToLeaves(reports[0]!)[0]!;
    const merged = mergeLeafAggregation(
      {
        dkim_pass_count: 100,
        dkim_fail_count: 2,
        selectors: ['google-2023'],
        ip_ranges: ['1.2.3.4'],
      },
      agg,
    );
    expect(merged.dkimPassCount).toBe(100n + agg.dkimPassCount);
    expect(merged.selectors).toContain('google-2024');
    expect(computeLeafHash(leafInputFromAggregation(merged))).toMatch(/^0x[a-f0-9]{64}$/);
  });
});

describe('leaf hash', () => {
  it('is deterministic for fixture data', () => {
    const reports = parseDmarcAggregateReport(sampleXml);
    const agg = aggregateReportToLeaves(reports[0]!)[0]!;
    const input = leafInputFromAggregation(agg);
    expect(computeLeafHash(input)).toBe(computeLeafHash(input));
    expect(computeLeafHash(input)).toMatch(/^0x[a-f0-9]{64}$/);
  });
});

describe('sparse merkle tree', () => {
  it('inserts and verifies proof', () => {
    const tree = new SparseMerkleTree();
    const reports = parseDmarcAggregateReport(sampleXml);
    const agg = aggregateReportToLeaves(reports[0]!)[0]!;
    const leaf = computeLeafHash(leafInputFromAggregation(agg));

    const index = tree.insert(leaf);
    const root = tree.getRoot();
    const proof = tree.getProof(index);

    expect(index).toBe(0);
    expect(proof).toHaveLength(32);
    expect(tree.verifyProof(leaf, index, proof, root)).toBe(true);
    expect(tree.verifyProof(leaf, index, proof, `0x${'11'.repeat(32)}`)).toBe(false);
  });
});

describe('trust score', () => {
  it('returns provisional for new domain', () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = computeTrustScore({
      totalPassCount: 1247,
      uniqueReporterCount: 1,
      firstReportTime: oneDayAgo,
    });
    expect(result.algorithm).toBe('pact-score-0.2');
    expect(result.status).toBe('provisional');
    expect(result.score).toBeGreaterThan(0);
  });
});
