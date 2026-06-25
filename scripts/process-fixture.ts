#!/usr/bin/env tsx
/**
 * Process a DMARC fixture locally (Phase 0a dev tool).
 * Usage: pnpm dev:fixture
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  aggregateReportToLeaves,
  computeLeafHash,
  leafInputFromAggregation,
  parseDmarcAggregateReport,
  SparseMerkleTree,
  computeTrustScore,
  validateReportSource,
} from '@pact/core';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE = join(repoRoot, 'fixtures/dmarc-google-pbm-labs.xml');
const xml = readFileSync(FIXTURE, 'utf8');
const envelope = 'noreply-dmarc-support@google.com';

console.log('PACT Phase 0a — fixture processor\n');

const reports = parseDmarcAggregateReport(xml);
const report = reports[0]!;

console.log('Report:', report.orgName, report.reportId);
console.log('Domain:', report.domain);
console.log('Auth:', validateReportSource(report.orgName, envelope) ? 'PASS' : 'FAIL');

const agg = aggregateReportToLeaves(report)[0]!;
const leafInput = leafInputFromAggregation(agg);
const leafHash = computeLeafHash(leafInput);

console.log('\nLeaf:');
console.log('  pass/fail:', agg.dkimPassCount.toString(), '/', agg.dkimFailCount.toString());
console.log('  selectors:', agg.selectors.join(', '));
console.log('  hash:', leafHash);

const tree = new SparseMerkleTree();
const index = tree.insert(leafHash);
const root = tree.getRoot();
const proof = tree.getProof(index);

console.log('\nMerkle tree (staging):');
console.log('  index:', index);
console.log('  root:', root);
console.log('  proof valid:', tree.verifyProof(leafHash, index, proof, root));

const trust = computeTrustScore({
  totalPassCount: Number(agg.dkimPassCount),
  leafCount: 1,
  reportingOrgsCount: 1,
  pactHistoryStart: new Date(Number(agg.key.periodStart) * 1000),
});

console.log('\nTrust score (pact-score-0.1):');
console.log('  score:', trust.score.toFixed(4));
console.log('  status:', trust.status);
console.log('  maturity:', trust.maturity.toFixed(4));
