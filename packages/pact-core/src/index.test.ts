import { describe, expect, it } from 'vitest';
import {
  aggregateReportToLeaves,
  computeLeafHash,
  parseDmarcAggregateReport,
  SparseMerkleTree,
  validateReportSource,
  computeTrustScore,
  computeDiversity,
  computeMaturity,
  ACTIVATION_DAYS,
  ACTIVATION_THRESHOLD,
  formatScoreForDisplay,
  estimateScoreProgress,
  DISPLAY_VERSION,
  canonicalizeSelectors,
  canonicalizeIpRanges,
  canonicalizeWrapperDkim,
  hashWrapperMessage,
  hashWrapperMessages,
  mergeLeafAggregation,
  leafInputFromAggregation,
  addPactRuaToDmarc,
  dmarcIncludesPactRua,
  PACT_RUA_MAILTO,
} from './index.js';

/** Minimal aggregate report used by parser / leaf / Merkle tests. */
const sampleXml = `<?xml version="1.0" encoding="UTF-8" ?>
<feedback>
  <report_metadata>
    <org_name>google.com</org_name>
    <email>noreply-dmarc-support@google.com</email>
    <report_id>2026061401</report_id>
    <date_range>
      <begin>1718323200</begin>
      <end>1718409599</end>
    </date_range>
  </report_metadata>
  <policy_published>
    <domain>webuildreal.dev</domain>
    <adkim>r</adkim>
    <aspf>r</aspf>
    <p>none</p>
    <sp>none</sp>
    <pct>100</pct>
  </policy_published>
  <record>
    <row>
      <source_ip>209.85.220.41</source_ip>
      <count>1247</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>pass</dkim>
        <spf>pass</spf>
      </policy_evaluated>
    </row>
    <row>
      <source_ip>209.85.220.55</source_ip>
      <count>3</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>fail</dkim>
        <spf>pass</spf>
      </policy_evaluated>
    </row>
    <identifiers>
      <header_from>webuildreal.dev</header_from>
    </identifiers>
    <auth_results>
      <dkim>
        <domain>webuildreal.dev</domain>
        <selector>google-2024</selector>
        <result>pass</result>
      </dkim>
      <dkim>
        <domain>webuildreal.dev</domain>
        <selector>google-2023</selector>
        <result>pass</result>
      </dkim>
    </auth_results>
  </record>
</feedback>`;

describe('allowlist', () => {
  it('accepts google reporter with google envelope and google DKIM', () => {
    expect(
      validateReportSource({
        orgName: 'google.com',
        envelopeFrom: 'noreply-dmarc-support@google.com',
        dkimDomains: ['google.com'],
      }),
    ).toBe(true);
  });

  it('rejects google org with google envelope but no DKIM', () => {
    expect(
      validateReportSource({
        orgName: 'google.com',
        envelopeFrom: 'noreply-dmarc-support@google.com',
        dkimDomains: [],
      }),
    ).toBe(false);
  });

  it('rejects google org signed by an unrelated domain', () => {
    expect(
      validateReportSource({
        orgName: 'google.com',
        envelopeFrom: 'noreply-dmarc-support@google.com',
        dkimDomains: ['evil.com'],
      }),
    ).toBe(false);
  });

  it('rejects unknown reporter even with a passing DKIM', () => {
    expect(
      validateReportSource({
        orgName: 'evil.com',
        envelopeFrom: 'attacker@evil.com',
        dkimDomains: ['evil.com'],
      }),
    ).toBe(false);
  });

  it('rejects reporter org without envelope domain', () => {
    expect(
      validateReportSource({
        orgName: 'google.com',
        envelopeFrom: 'invalid-sender',
        dkimDomains: ['google.com'],
      }),
    ).toBe(false);
  });

  it('accepts a known reporter forwarded by an allowlisted agent with agent DKIM', () => {
    expect(
      validateReportSource({
        orgName: 'google.com',
        envelopeFrom: 'bounces@postmarkapp.com',
        dkimDomains: ['postmarkapp.com'],
      }),
    ).toBe(true);
  });

  it('accepts a known reporter forwarded with the reporter DKIM intact', () => {
    expect(
      validateReportSource({
        orgName: 'google.com',
        envelopeFrom: 'bounces@postmarkapp.com',
        dkimDomains: ['google.com'],
      }),
    ).toBe(true);
  });

  it('accepts microsoft reporter with protection.outlook.com DKIM', () => {
    expect(
      validateReportSource({
        orgName: 'microsoft.com',
        envelopeFrom: 'dmarcreport@microsoft.com',
        dkimDomains: ['protection.outlook.com'],
      }),
    ).toBe(true);
  });

  it('rejects a forwarder DKIM when org_name is unknown', () => {
    expect(
      validateReportSource({
        orgName: 'evil.com',
        envelopeFrom: 'bounces@postmarkapp.com',
        dkimDomains: ['postmarkapp.com'],
      }),
    ).toBe(false);
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

  it('leaves working legacy rua unchanged so old domains keep sending there', () => {
    const existing = 'v=DMARC1; p=none; rua=mailto:rua@pact.pbm-labs.com';
    expect(dmarcIncludesPactRua(existing)).toBe(true);
    const { content, changed } = addPactRuaToDmarc(existing);
    expect(changed).toBe(false);
    expect(content).toContain('rua@pact.pbm-labs.com');
    expect(content).not.toContain('rua@pact.webuildreal.dev');
  });

  it('adds canonical rua when the record only has the dead apex address', () => {
    const existing = 'v=DMARC1; p=none; rua=mailto:rua@webuildreal.dev';
    expect(dmarcIncludesPactRua(existing)).toBe(false);
    const { content, changed } = addPactRuaToDmarc(existing);
    expect(changed).toBe(true);
    expect(content).toContain('rua@pact.webuildreal.dev');
    expect(content).toContain('rua@webuildreal.dev');
  });
});

describe('dmarc parser', () => {
  it('parses sample report', () => {
    const reports = parseDmarcAggregateReport(sampleXml);
    expect(reports).toHaveLength(1);
    expect(reports[0]!.domain).toBe('webuildreal.dev');
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

  it('unions wrapper hashes and DKIM ids across reports', () => {
    const reports = parseDmarcAggregateReport(sampleXml);
    const agg = {
      ...aggregateReportToLeaves(reports[0]!)[0]!,
      wrapperHashes: ['0x' + 'bb'.repeat(32)],
      wrapperDkim: [{ domain: 'google.com', selector: '20230601' }],
    };
    const merged = mergeLeafAggregation(
      {
        dkim_pass_count: 0,
        dkim_fail_count: 0,
        selectors: [],
        ip_ranges: [],
        wrapper_hashes: ['0x' + 'aa'.repeat(32)],
        wrapper_dkim: [{ domain: 'google.com', selector: '20230601' }],
      },
      agg,
    );
    expect(merged.wrapperHashes).toEqual(['0x' + 'aa'.repeat(32), '0x' + 'bb'.repeat(32)]);
    expect(merged.wrapperDkim).toEqual([{ domain: 'google.com', selector: '20230601' }]);
  });
});

describe('wrapper witness', () => {
  it('hashes RFC822 bytes with keccak256', () => {
    const hash = hashWrapperMessage(new TextEncoder().encode('rfc822'));
    expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(hash).toBe(hashWrapperMessage(new TextEncoder().encode('rfc822')));
    expect(hash).not.toBe(hashWrapperMessage(new TextEncoder().encode('rfc823')));
  });

  it('canonicalizes wrapper DKIM ids order-independently', () => {
    expect(
      canonicalizeWrapperDkim([
        { domain: 'Google.COM', selector: '20230601' },
        { domain: 'protection.outlook.com', selector: 'selector1' },
      ]),
    ).toBe(
      canonicalizeWrapperDkim([
        { domain: 'protection.outlook.com', selector: 'selector1' },
        { domain: 'google.com', selector: '20230601' },
      ]),
    );
  });

  it('changes the leaf hash when a wrapper witness is present', () => {
    const reports = parseDmarcAggregateReport(sampleXml);
    const agg = aggregateReportToLeaves(reports[0]!)[0]!;
    const without = computeLeafHash(leafInputFromAggregation(agg));
    const wrapperHash = hashWrapperMessage(new TextEncoder().encode('wrapper'));
    const withWitness = computeLeafHash(
      leafInputFromAggregation({
        ...agg,
        wrapperHashes: [wrapperHash],
        wrapperDkim: [{ domain: 'google.com', selector: '20230601' }],
      }),
    );
    expect(withWitness).not.toBe(without);
    expect(
      hashWrapperMessages([wrapperHash, hashWrapperMessage(new TextEncoder().encode('other'))]),
    ).toBe(
      hashWrapperMessages([hashWrapperMessage(new TextEncoder().encode('other')), wrapperHash]),
    );
  });
});

describe('leaf hash', () => {
  it('is deterministic for sample data', () => {
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
  it('returns provisional for new PACT history', () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = computeTrustScore({
      totalPassCount: 1247,
      leafCount: 2,
      reportingOrgsCount: 1,
      pactHistoryStart: oneDayAgo,
    });
    expect(result.algorithm).toBe('pact-score-0.1');
    expect(result.status).toBe('provisional');
    expect(result.score).toBeGreaterThan(0);
    expect(result.pactAgeDays).toBeGreaterThan(0);
    expect(result.pactAgeDays).toBeLessThan(2);
  });

  it('passes domainRegisteredAt through without affecting maturity', () => {
    const oldRegistration = new Date('2010-01-01');
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const withoutReg = computeTrustScore({
      totalPassCount: 10_000,
      leafCount: 100,
      reportingOrgsCount: 5,
      pactHistoryStart: oneDayAgo,
    });
    const withReg = computeTrustScore({
      totalPassCount: 10_000,
      leafCount: 100,
      reportingOrgsCount: 5,
      pactHistoryStart: oneDayAgo,
      domainRegisteredAt: oldRegistration,
    });
    expect(withReg.maturity).toBe(withoutReg.maturity);
    expect(withReg.score).toBe(withoutReg.score);
    expect(withReg.domainRegisteredAt).toBe(oldRegistration.getTime());
  });

  it('computes diversity as reporting orgs per leaf', () => {
    expect(computeDiversity(2, 4)).toBe(0.5);
    expect(computeDiversity(1, 0)).toBe(0);
  });

  it('ACTIVATION_DAYS is the first calendar day maturity crosses the Proven gate', () => {
    expect(computeMaturity(ACTIVATION_DAYS - 1)).toBeLessThan(ACTIVATION_THRESHOLD);
    expect(computeMaturity(ACTIVATION_DAYS)).toBeGreaterThanOrEqual(ACTIVATION_THRESHOLD);
  });

  it('hijacking simulation: old domain registration does not inflate maturity on new PACT history', () => {
    const hijackedDomainRegistration = new Date('2005-06-01');
    const firstPactReport = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const result = computeTrustScore({
      totalPassCount: 50_000,
      leafCount: 200,
      reportingOrgsCount: 3,
      pactHistoryStart: firstPactReport,
      domainRegisteredAt: hijackedDomainRegistration,
    });

    const withoutRegistration = computeTrustScore({
      totalPassCount: 50_000,
      leafCount: 200,
      reportingOrgsCount: 3,
      pactHistoryStart: firstPactReport,
    });

    expect(result.maturity).toBe(withoutRegistration.maturity);
    expect(result.maturity).toBeLessThan(0.02);
    expect(result.status).toBe('provisional');
  });
});

describe('formatScoreForDisplay', () => {
  it('maps raw T = 0 to zero display with no-history label', () => {
    const display = formatScoreForDisplay(0);
    expect(display.displayScore).toBe(0);
    expect(display.label).toBe('No history yet');
  });

  it('maps small non-zero raw T to at least 1/100 with provisional label', () => {
    const display = formatScoreForDisplay(0.019);
    expect(display.displayVersion).toBe(DISPLAY_VERSION);
    expect(display.band).toBe('no_history_yet');
    expect(display.label).toBe('Provisional');
    expect(display.displayScore).toBeGreaterThanOrEqual(1);
    expect(display.displayScore).toBeLessThan(10);
    expect(display.rawScore).toBeCloseTo(0.019);
  });

  it('maps early score (~0.02) to 1/100 provisional', () => {
    const display = formatScoreForDisplay(0.023);
    expect(display.displayScore).toBe(1);
    expect(display.label).toBe('Provisional');
  });

  it('maps raw T = 5 to established band', () => {
    const display = formatScoreForDisplay(5);
    expect(display.band).toBe('established');
    expect(display.displayScore).toBeGreaterThanOrEqual(35);
    expect(display.displayScore).toBeLessThan(65);
  });

  it('clamps raw T >= 20 to display 100', () => {
    expect(formatScoreForDisplay(20).displayScore).toBe(100);
    expect(formatScoreForDisplay(50).displayScore).toBe(100);
  });

  it('does not alter raw score in result', () => {
    const raw = 2.718;
    expect(formatScoreForDisplay(raw).rawScore).toBe(raw);
  });
});

describe('estimateScoreProgress', () => {
  it('estimates days to Early when volume × diversity can reach T = 1', () => {
    const progress = estimateScoreProgress({
      rawScore: 0.5,
      volume: 5,
      diversity: 0.5,
      pactAgeDays: 100,
    });
    expect(progress.nextBandLabel).toBe('Early');
    expect(progress.nextBandKey).toBe('early');
    expect(progress.daysToNextBand).not.toBeNull();
    expect(progress.daysToNextBand!).toBeGreaterThan(0);
    expect(progress.daysToNextBand!).toBeLessThan(30);
  });

  it('returns null days when time alone cannot reach the next band', () => {
    const progress = estimateScoreProgress({
      rawScore: 0.023,
      volume: 2.079,
      diversity: 0.25,
      pactAgeDays: 9,
    });
    expect(progress.pactAgeDays).toBe(9);
    expect(progress.daysToNextBand).toBeNull();
    expect(progress.nextBandLabel).toBeNull();
    expect(progress.nextBandKey).toBeNull();
  });

  it('returns null when already at maximum interpretation band', () => {
    const progress = estimateScoreProgress({
      rawScore: 12,
      volume: 10,
      diversity: 0.8,
      pactAgeDays: 800,
    });
    expect(progress.daysToNextBand).toBeNull();
    expect(progress.nextBandLabel).toBeNull();
    expect(progress.nextBandKey).toBeNull();
  });
});
