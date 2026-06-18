#!/usr/bin/env tsx
/**
 * Simulate a DMARC rua report → Supabase (same path as the ingest worker).
 * Usage:
 *   pnpm dev:ingest-fixture
 *   pnpm dev:ingest-fixture fixtures/dmarc-google-witnessed.cc.xml
 *
 * Requires repo-root .env.local with SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 * and the report domain registered in `domains`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { processReportJob } from '../workers/ingest/src/process-report.js';
import { createSupabaseAdmin } from '../workers/ingest/src/supabase.js';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const defaultFixture = join(repoRoot, 'fixtures/dmarc-google-pbm-labs.xml');
const fixtureArg = process.argv[2];
const fixturePath = fixtureArg
  ? join(fixtureArg.startsWith('/') ? '' : repoRoot, fixtureArg)
  : defaultFixture;
const isDefaultFixture = fixturePath === defaultFixture;

function loadEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) out[m[1]!] = m[2]!.trim();
  }
  return out;
}

const env = loadEnvFile(join(repoRoot, '.env.local'));

const url = env.SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

if (!existsSync(fixturePath)) {
  console.error('Fixture not found:', fixturePath);
  process.exit(1);
}

let xml = readFileSync(fixturePath, 'utf8');

// Default fixture gets a unique report_id so re-runs are not deduped
let reportId = xml.match(/<report_id>([^<]+)<\/report_id>/)?.[1] ?? 'unknown';
if (isDefaultFixture) {
  reportId = `sim-${Date.now()}`;
  xml = xml.replace(/<report_id>[^<]+<\/report_id>/, `<report_id>${reportId}</report_id>`);
}

async function main() {
  console.log('PACT — simulate DMARC rua ingest\n');
  console.log('Fixture:', fixturePath);
  console.log('Report ID:', reportId);
  console.log('Supabase:', url.replace(/\/\/[^@]+@/, '//***@'));

  const supabase = createSupabaseAdmin(url, key);

  if (isDefaultFixture) {
    const { error: domainError } = await supabase.from('domains').upsert({ domain: 'pbm-labs.com' });
    if (domainError) {
      console.error('\nSupabase error (check SUPABASE_URL in .env.local):', domainError.message);
      process.exit(1);
    }
  }

  const result = await processReportJob(supabase, {
    envelopeFrom: 'noreply-dmarc-support@google.com',
    rawXml: xml,
    receivedAt: new Date().toISOString(),
  });

  console.log('\nResult:', result);

  if (result.processed > 0) {
    const domain = xml.match(/<header_from>([^<]+)<\/header_from>/)?.[1] ?? 'pbm-labs.com';
    console.log(`\nOK — check Supabase leaves/merkle_roots and pnpm dev:web → /domain/${domain}`);
  } else {
    console.error('\nFailed:', result.errors.join('; ') || 'skipped (see result)');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
