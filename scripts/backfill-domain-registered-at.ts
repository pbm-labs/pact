#!/usr/bin/env tsx
/**
 * Backfill domains.domain_registered_at via RDAP for connected domains.
 * Requires domains.domain_registered_at (see supabase/schema.sql upgrade block).
 *
 * Usage:
 *   export $(grep -v '^#' apps/web/.env.local | xargs)
 *   pnpm backfill:domain-age
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { resolveDomainRegisteredAt } from '../apps/web/src/lib/domain-age';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvLocal() {
  const path = join(repoRoot, 'apps/web/.env.local');
  try {
    for (const line of readFileSync(path, 'utf8').splitlines()) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
      const [key, ...rest] = trimmed.split('=');
      process.env[key!] ??= rest.join('=');
    }
  } catch {
    // shell exports win
  }
}

loadEnvLocal();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (set in apps/web/.env.local)');
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const { data: domains, error } = await supabase
    .from('domains')
    .select('domain, domain_registered_at')
    .is('disconnected_at', null);

  if (error) {
    if (error.code === '42703') {
      console.error(
        'Column domains.domain_registered_at does not exist.\n' +
          'Run the upgrade block at the bottom of supabase/schema.sql in the Supabase SQL editor first.',
      );
      process.exit(1);
    }
    throw error;
  }

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of domains ?? []) {
    if (row.domain_registered_at) {
      skipped++;
      continue;
    }

    const resolved = await resolveDomainRegisteredAt(row.domain);
    if (resolved == null) {
      console.log(`  ${row.domain}: RDAP lookup failed — skipped`);
      failed++;
      continue;
    }

    const iso = new Date(resolved).toISOString();
    const { error: updateError } = await supabase
      .from('domains')
      .update({ domain_registered_at: iso })
      .eq('domain', row.domain);

    if (updateError) {
      console.error(`  ${row.domain}: update failed — ${updateError.message}`);
      failed++;
      continue;
    }

    console.log(`  ${row.domain}: ${iso}`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped} (already set), failed ${failed}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
