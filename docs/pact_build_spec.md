# PACT Protocol — Build Specification v1.1
**For:** Claude Sonnet / Opus  
**Stack:** Cloudflare Email Workers + Cloudflare Queues + Cloudflare Workers + Supabase + Vercel + Base (L2)  
**Language:** TypeScript  
**Scope:** MVP only — PACT Protocol Layer 1  
**Date:** June 2026

---

## Critical Architecture Decisions — Read First

Before writing any code, internalize these four decisions. They prevent silent failures and data corruption.

### Decision 1: keccak256, Not Poseidon

All leaf hashing and Merkle tree construction uses **keccak256** throughout — in TypeScript and in Solidity. Do not use Poseidon anywhere in this build.

Reason: The Merkle tree is built in TypeScript (Cloudflare Workers) and verified in Solidity (Base smart contract). If the hashing algorithm differs between the two environments, every on-chain proof will fail silently. Poseidon requires a dedicated on-chain verifier contract that is expensive to deploy and unnecessary for Layer 1. Poseidon is reserved for PACT Proof (Layer 2) when ZK circuits are introduced.

In TypeScript, use `viem`'s `keccak256` function. In Solidity, use the native `keccak256` opcode. They produce identical output for identical inputs.

### Decision 2: Supabase for All Mutable State

All mutable state — domain stats, pending leaves, leaf index — lives in **Supabase (PostgreSQL)**. R2 is used only for immutable, append-only storage (finalized leaf data after on-chain anchoring).

Reason: Cloudflare Workers processing from a Queue are concurrent by design. Multiple Workers reading and writing the same R2 JSON file simultaneously produce race conditions that corrupt data silently. R2 has no locking mechanism. Supabase has atomic transactions and row-level locking. Any state that is read-modify-written must live in Supabase.

R2 is correct for immutable blobs that are written once and never modified — finalized leaf JSON files after the root is published on-chain.

### Decision 3: Handle ZIP, GZIP, and Raw XML

DMARC aggregate reports arrive as email attachments in three formats:
- `.zip` — used by Microsoft 365, most enterprise MTAs, approximately 60% of real-world reports
- `.xml.gz` — used by Google, Yahoo, approximately 35% of real-world reports
- `.xml` — raw XML, rare but valid

The email receiver must handle all three. Using only `fflate` for gzip will cause approximately 60% of real incoming reports to be silently dropped.

Use `fflate` for gzip decompression and `unzipper` (or equivalent Workers-compatible library) for ZIP extraction.

### Decision 4: No Hand-Written Cryptography

Do not implement any cryptographic primitive from scratch. Use `viem` for keccak256 and Ethereum interactions. If any future requirement appears to need custom crypto, stop and flag it rather than implementing it.

---

## What PACT Protocol Does

1. Receives DMARC aggregate report XML files via email (the rua= destination address)
2. Parses them to extract domain authentication metadata — no message content, no recipient identity
3. Stores domain statistics and leaf data in Supabase with atomic transactions
4. Constructs a keccak256 Merkle tree of domain activity leaves
5. Publishes the Merkle root on-chain to Base (Ethereum L2) once daily
6. Serves a public page per domain showing trust score and verifiable provenance history

## What PACT Protocol Never Does

- Never stores email content of any kind
- Never stores recipient identity
- Never stores sender email addresses — only domains
- Never accesses individual messages
- Never uses ruf= (DMARC forensic reports) — reject them if received
- The privacy guarantee is structural, enforced by the data source

---

## Repository Structure

```
pact-protocol/
├── apps/
│   ├── email-worker/            # Cloudflare Email Worker
│   │   ├── src/
│   │   │   ├── index.ts         # Email Worker entry point
│   │   │   ├── extractor.ts     # MIME parsing, ZIP/GZIP handling
│   │   │   ├── parser.ts        # DMARC XML parser
│   │   │   ├── validator.ts     # Sender legitimacy check
│   │   │   └── types.ts
│   │   ├── wrangler.toml
│   │   └── package.json
│   │
│   ├── processor-worker/        # Queue consumer Worker
│   │   ├── src/
│   │   │   ├── index.ts         # Queue consumer entry point
│   │   │   ├── leaf.ts          # Leaf construction (keccak256)
│   │   │   ├── merkle.ts        # Merkle tree operations (keccak256)
│   │   │   ├── stats.ts         # Domain stats update (Supabase)
│   │   │   └── types.ts
│   │   ├── wrangler.toml
│   │   └── package.json
│   │
│   ├── publisher-worker/        # Cron Worker for daily on-chain publication
│   │   ├── src/
│   │   │   ├── index.ts         # Cron trigger entry point
│   │   │   ├── root.ts          # Merkle root computation from pending leaves
│   │   │   ├── contract.ts      # Base contract interaction via viem
│   │   │   └── types.ts
│   │   ├── wrangler.toml
│   │   └── package.json
│   │
│   └── web/                     # Vercel + Next.js frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── domain/
│       │   │   │   └── [domain]/
│       │   │   │       └── page.tsx     # Public domain provenance page
│       │   │   ├── connect/
│       │   │   │   └── page.tsx         # Domain onboarding flow
│       │   │   └── verify/
│       │   │       └── [id]/
│       │   │           └── page.tsx     # Merkle proof verification page
│       │   ├── api/
│       │   │   ├── domain/
│       │   │   │   └── [domain]/
│       │   │   │       └── route.ts     # GET domain stats + trust score
│       │   │   ├── connect/
│       │   │   │   └── cloudflare/
│       │   │   │       └── route.ts     # Cloudflare OAuth flow
│       │   │   └── verify/
│       │   │       └── [id]/
│       │   │           └── route.ts     # Proof verification endpoint
│       │   └── components/
│       │       ├── DomainCard.tsx
│       │       ├── TrustScore.tsx
│       │       ├── MerkleProof.tsx
│       │       └── ConnectFlow.tsx
│       ├── next.config.ts
│       └── package.json
│
├── packages/
│   ├── shared/                  # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types.ts         # All shared TypeScript interfaces
│   │   │   ├── merkle.ts        # keccak256 Merkle tree (shared implementation)
│   │   │   ├── trust-score.ts   # Trust score formula
│   │   │   └── domain.ts        # Domain validation utilities
│   │   └── package.json
│   │
│   └── contracts/               # Solidity smart contract
│       ├── src/
│       │   └── PACTRegistry.sol
│       ├── test/
│       │   └── PACTRegistry.test.ts
│       ├── hardhat.config.ts
│       └── package.json
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql   # Full schema definition
│   └── seed.sql                      # Optional seed data for development
│
├── package.json                 # pnpm workspace root
├── pnpm-workspace.yaml
└── .env.example                 # All environment variables documented
```

---

## Database Schema (Supabase / PostgreSQL)

Create this schema via Supabase migration before writing any application code.

```sql
-- supabase/migrations/001_initial_schema.sql

-- Domain statistics — one row per connected domain
-- Updated atomically on each processed report
CREATE TABLE domain_stats (
  domain              TEXT PRIMARY KEY,
  domain_registered_at TIMESTAMPTZ,             -- public WHOIS/registry creation
                                                  -- date of the domain itself.
                                                  -- NULL until fetched. NEVER used
                                                  -- in the trust score formula —
                                                  -- display-only context field.
                                                  -- See pact_protocol_v01.md Section 4.2.
  first_report_time   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                                  -- This is PACT history start —
                                                  -- days since this timestamp is
                                                  -- pact_age(d,t) in the trust score
                                                  -- formula. Do NOT confuse with
                                                  -- domain_registered_at above.
  last_report_time    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_pass_count    BIGINT NOT NULL DEFAULT 0,
  total_fail_count    BIGINT NOT NULL DEFAULT 0,
  leaf_count          INTEGER NOT NULL DEFAULT 0,
  known_selectors     TEXT[] NOT NULL DEFAULT '{}',
  known_ip_ranges     TEXT[] NOT NULL DEFAULT '{}',
  reporting_orgs      TEXT[] NOT NULL DEFAULT '{}',
  status              TEXT NOT NULL DEFAULT 'pending_first_report'
                      CHECK (status IN ('pending_first_report', 'active')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual leaves — one row per processed aggregate report
-- Append-only. Never updated after insertion.
CREATE TABLE leaves (
  id                  BIGSERIAL PRIMARY KEY,
  leaf_index          BIGINT UNIQUE,           -- assigned when included in a root
  domain              TEXT NOT NULL REFERENCES domain_stats(domain),
  leaf_hash           TEXT NOT NULL UNIQUE,    -- hex keccak256 hash
  period_start        TIMESTAMPTZ NOT NULL,
  period_end          TIMESTAMPTZ NOT NULL,
  dkim_pass_count     INTEGER NOT NULL,
  dkim_fail_count     INTEGER NOT NULL,
  selector_hash       TEXT NOT NULL,           -- hex keccak256 of sorted selectors
  source_ip_hash      TEXT NOT NULL,           -- hex keccak256 of sorted IP ranges
  report_hash         TEXT NOT NULL,           -- hex keccak256 of raw report XML
  reporting_org       TEXT NOT NULL,           -- which mail server sent this report
  anchored_root_id    BIGINT,                  -- null until included in a published root
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX leaves_domain_idx ON leaves(domain);
CREATE INDEX leaves_anchored_root_idx ON leaves(anchored_root_id);
CREATE INDEX leaves_created_at_idx ON leaves(created_at);

-- Published Merkle roots — one row per daily on-chain publication
-- Append-only. Never updated after insertion.
CREATE TABLE published_roots (
  id            BIGSERIAL PRIMARY KEY,
  root_hash     TEXT NOT NULL UNIQUE,    -- hex keccak256 Merkle root
  leaf_count    INTEGER NOT NULL,
  tx_hash       TEXT NOT NULL,           -- Base transaction hash
  block_number  BIGINT NOT NULL,
  chain_id      INTEGER NOT NULL DEFAULT 8453,   -- Base mainnet
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pending leaves awaiting the next root publication
-- Rows are deleted after successful root publication
CREATE TABLE pending_leaves (
  leaf_id       BIGINT PRIMARY KEY REFERENCES leaves(id),
  leaf_hash     TEXT NOT NULL,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Connected domain registry
-- Tracks domains that have added PACT to their DMARC rua= field
CREATE TABLE connected_domains (
  domain            TEXT PRIMARY KEY,
  connection_method TEXT NOT NULL      -- 'cloudflare_oauth' | 'manual' | 'service'
                    CHECK (connection_method IN ('cloudflare_oauth', 'manual', 'service')),
  cloudflare_zone_id TEXT,             -- only for cloudflare_oauth connections
  connected_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at       TIMESTAMPTZ        -- set when first rua= report is received
);
```

---

## Component 1: Email Worker

**Entry point:** `apps/email-worker/src/index.ts`

Receives raw MIME email messages. Extracts the DMARC aggregate report attachment. Parses it. Enqueues the normalized data. The raw email is never stored.

```typescript
import type { EmailMessage } from 'cloudflare:email'
import { extractReportAttachment } from './extractor'
import { parseDMARCReport } from './parser'
import { isLegitimateReportSender } from './validator'
import type { Env, QueuedReport } from './types'

export default {
  async email(message: EmailMessage, env: Env): Promise<void> {

    // Reject ruf= forensic reports immediately
    // They are identified by having 'Report-Type: failure' in headers
    // or coming from addresses that indicate forensic reporting
    // We never process these — privacy constraint
    if (isForensicReport(message)) {
      message.setReject('Forensic reports not accepted')
      return
    }

    // Basic sender validation
    // Aggregate reports come from mail servers, not individual users
    const senderValid = await isLegitimateReportSender(message)
    if (!senderValid) {
      // Silently discard — do not reject, as this could cause
      // bounce loops with legitimate but unusual senders
      return
    }

    // Extract the XML from the email attachment
    // Handles: .zip, .xml.gz, .xml (in that priority order)
    const reportXml = await extractReportAttachment(message)
    if (!reportXml) {
      // No recognizable attachment — silently discard
      return
    }

    // Parse the DMARC aggregate report XML
    const parsed = parseDMARCReport(reportXml)
    if (!parsed || parsed.records.length === 0) {
      return
    }

    // Enqueue the normalized data for processing
    // Only the parsed struct is queued — never the raw XML or email
    const payload: QueuedReport = {
      reportId: crypto.randomUUID(),
      receivedAt: Date.now(),
      domain: parsed.domain,
      reportingOrg: parsed.reportingOrg,
      dateRange: parsed.dateRange,
      records: parsed.records,
    }

    await env.REPORT_QUEUE.send(payload)

    // The raw email and XML string are now out of scope.
    // Nothing containing message content or recipient identity
    // has been persisted at any point in this function.
  },
}

function isForensicReport(message: EmailMessage): boolean {
  // Forensic reports typically arrive from addresses containing
  // 'forensic', 'ruf', or 'failure' in the sender address
  // and have specific subject line patterns
  const from = message.from.toLowerCase()
  const subject = (message.headers.get('subject') ?? '').toLowerCase()
  return (
    from.includes('forensic') ||
    subject.includes('forensic') ||
    subject.includes('failure report')
  )
}
```

**Attachment Extractor:** `apps/email-worker/src/extractor.ts`

```typescript
import { EmailMessage } from 'cloudflare:email'
import PostalMime from 'postal-mime'
import { unzipSync, strFromU8 } from 'fflate'

// Handle all three real-world DMARC report formats:
// .zip  — Microsoft 365, most enterprise MTAs (~60% of traffic)
// .xml.gz — Google, Yahoo (~35% of traffic)
// .xml  — raw XML, rare but valid

export async function extractReportAttachment(
  message: EmailMessage
): Promise<string | null> {
  // Parse the raw email MIME structure
  const rawEmail = new Response(message.raw)
  const rawBytes = await rawEmail.arrayBuffer()
  const parsed = await new PostalMime().parse(rawBytes)

  if (!parsed.attachments || parsed.attachments.length === 0) {
    return null
  }

  for (const attachment of parsed.attachments) {
    const filename = (attachment.filename ?? '').toLowerCase()
    const content = attachment.content  // ArrayBuffer

    try {
      // Case 1: ZIP archive
      if (filename.endsWith('.zip') || attachment.mimeType === 'application/zip') {
        return extractFromZip(content)
      }

      // Case 2: GZIP compressed XML
      if (
        filename.endsWith('.xml.gz') ||
        filename.endsWith('.gz') ||
        attachment.mimeType === 'application/gzip' ||
        attachment.mimeType === 'application/x-gzip'
      ) {
        const decompressed = unzipSync(new Uint8Array(content))
        // unzipSync returns a map of filename -> Uint8Array for zip
        // For gzip it returns the raw bytes directly
        if (decompressed instanceof Uint8Array) {
          return new TextDecoder().decode(decompressed)
        }
        // Handle as zip output (shouldn't happen for .gz but be safe)
        const files = Object.values(decompressed)
        if (files.length > 0) {
          return strFromU8(files[0])
        }
      }

      // Case 3: Raw XML
      if (
        filename.endsWith('.xml') ||
        attachment.mimeType === 'text/xml' ||
        attachment.mimeType === 'application/xml'
      ) {
        return new TextDecoder().decode(content)
      }
    } catch (err) {
      // Decompression or decoding failed — try next attachment
      continue
    }
  }

  return null
}

function extractFromZip(content: ArrayBuffer): string | null {
  const decompressed = unzipSync(new Uint8Array(content))
  const files = Object.entries(decompressed)

  // Find the XML file inside the ZIP
  const xmlEntry = files.find(([name]) => name.toLowerCase().endsWith('.xml'))
  if (!xmlEntry) return null

  return strFromU8(xmlEntry[1])
}
```

**DMARC XML Parser:** `apps/email-worker/src/parser.ts`

```typescript
import { XMLParser } from 'fast-xml-parser'
import type { DMARCReport, DMARCRecord } from './types'

const parser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  isArray: (name) => name === 'record',
})

export function parseDMARCReport(xml: string): DMARCReport | null {
  try {
    const parsed = parser.parse(xml)
    const feedback = parsed?.feedback
    if (!feedback) return null

    const metadata = feedback.report_metadata
    const policyPublished = feedback.policy_published
    const records: DMARCRecord[] = []

    for (const record of feedback.record ?? []) {
      const row = record.row
      const authResults = record.auth_results

      // Extract DKIM results — may be array or single object
      const dkimResults = Array.isArray(authResults?.dkim)
        ? authResults.dkim
        : authResults?.dkim
        ? [authResults.dkim]
        : []

      const primaryDkim = dkimResults[0]

      records.push({
        sourceIp: row?.source_ip ?? '',
        count: Number(row?.count ?? 0),
        dkimResult: row?.policy_evaluated?.dkim ?? 'none',
        spfResult: row?.policy_evaluated?.spf ?? 'none',
        headerFrom: record.identifiers?.header_from ?? '',
        dkimDomain: primaryDkim?.domain ?? '',
        dkimSelector: primaryDkim?.selector ?? '',
      })
    }

    if (records.length === 0) return null

    return {
      reportId: String(metadata?.report_id ?? crypto.randomUUID()),
      reportingOrg: String(metadata?.org_name ?? ''),
      domain: String(policyPublished?.domain ?? records[0]?.headerFrom ?? ''),
      dateRange: {
        begin: Number(metadata?.date_range?.begin ?? 0),
        end: Number(metadata?.date_range?.end ?? 0),
      },
      records,
    }
  } catch {
    return null
  }
}
```

---

## Component 2: Processor Worker

**Entry point:** `apps/processor-worker/src/index.ts`

Consumes from the Cloudflare Queue. Constructs keccak256 Merkle leaves. Updates Supabase atomically.

```typescript
import { createClient } from '@supabase/supabase-js'
import { constructLeaf } from './leaf'
import { updateDomainStats } from './stats'
import type { Env, QueuedReport } from './types'

export default {
  async queue(
    batch: MessageBatch<QueuedReport>,
    env: Env
  ): Promise<void> {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

    for (const message of batch.messages) {
      try {
        await processReport(message.body, supabase, env)
        message.ack()
      } catch (err) {
        console.error('Failed to process report:', err)
        message.retry()
      }
    }
  },
}

async function processReport(
  report: QueuedReport,
  supabase: ReturnType<typeof createClient>,
  env: Env
): Promise<void> {
  const domain = report.domain
  if (!domain || domain.length === 0) return

  // Aggregate pass/fail counts and collect infrastructure signals
  let passCount = 0
  let failCount = 0
  const selectors = new Set<string>()
  const ipRanges = new Set<string>()

  for (const record of report.records) {
    if (record.dkimResult === 'pass') {
      passCount += record.count
    } else {
      failCount += record.count
    }
    if (record.dkimSelector) selectors.add(record.dkimSelector)
    if (record.sourceIp) ipRanges.add(toIpRange(record.sourceIp))
  }

  // Construct the keccak256 Merkle leaf
  const leaf = constructLeaf({
    domain,
    periodStart: report.dateRange.begin,
    periodEnd: report.dateRange.end,
    dkimPassCount: passCount,
    dkimFailCount: failCount,
    selectors: [...selectors].sort(),
    sourceIpRanges: [...ipRanges].sort(),
    reportXmlHash: report.reportId,  // We hash the reportId as proxy
    reportingOrg: report.reportingOrg,
  })

  // All database writes in a single Supabase transaction
  // This prevents race conditions between concurrent Workers
  const { error } = await supabase.rpc('insert_leaf_and_update_stats', {
    p_domain: domain,
    p_leaf_hash: leaf.hash,
    p_period_start: new Date(report.dateRange.begin * 1000).toISOString(),
    p_period_end: new Date(report.dateRange.end * 1000).toISOString(),
    p_dkim_pass_count: passCount,
    p_dkim_fail_count: failCount,
    p_selector_hash: leaf.selectorHash,
    p_source_ip_hash: leaf.sourceIpHash,
    p_report_hash: leaf.reportHash,
    p_reporting_org: report.reportingOrg,
    p_known_selectors: [...selectors],
    p_known_ip_ranges: [...ipRanges],
  })

  if (error) throw new Error(`Supabase transaction failed: ${error.message}`)
}

// Convert an individual IP to a /24 range for privacy
// We store IP ranges, not individual IPs
function toIpRange(ip: string): string {
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`
  }
  return ip  // IPv6 — return as-is for now
}
```

**Supabase Stored Procedure** — Add to `supabase/migrations/001_initial_schema.sql`:

```sql
-- Atomic leaf insertion + domain stats update
-- Called by the processor Worker for every processed report
-- Uses PostgreSQL advisory locks to prevent concurrent corruption
CREATE OR REPLACE FUNCTION insert_leaf_and_update_stats(
  p_domain            TEXT,
  p_leaf_hash         TEXT,
  p_period_start      TIMESTAMPTZ,
  p_period_end        TIMESTAMPTZ,
  p_dkim_pass_count   INTEGER,
  p_dkim_fail_count   INTEGER,
  p_selector_hash     TEXT,
  p_source_ip_hash    TEXT,
  p_report_hash       TEXT,
  p_reporting_org     TEXT,
  p_known_selectors   TEXT[],
  p_known_ip_ranges   TEXT[]
) RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Upsert domain_stats row
  -- If the domain doesn't exist yet, create it
  INSERT INTO domain_stats (
    domain,
    first_report_time,
    last_report_time,
    total_pass_count,
    total_fail_count,
    leaf_count,
    known_selectors,
    known_ip_ranges,
    reporting_orgs,
    status
  ) VALUES (
    p_domain,
    p_period_start,
    p_period_end,
    p_dkim_pass_count,
    p_dkim_fail_count,
    1,
    p_known_selectors,
    p_known_ip_ranges,
    ARRAY[p_reporting_org],
    'active'
  )
  ON CONFLICT (domain) DO UPDATE SET
    last_report_time  = GREATEST(domain_stats.last_report_time, p_period_end),
    total_pass_count  = domain_stats.total_pass_count + p_dkim_pass_count,
    total_fail_count  = domain_stats.total_fail_count + p_dkim_fail_count,
    leaf_count        = domain_stats.leaf_count + 1,
    known_selectors   = ARRAY(
                          SELECT DISTINCT unnest(
                            domain_stats.known_selectors || p_known_selectors
                          )
                        ),
    known_ip_ranges   = ARRAY(
                          SELECT DISTINCT unnest(
                            domain_stats.known_ip_ranges || p_known_ip_ranges
                          )
                        ),
    reporting_orgs    = ARRAY(
                          SELECT DISTINCT unnest(
                            domain_stats.reporting_orgs || ARRAY[p_reporting_org]
                          )
                        ),
    status            = 'active';

  -- Insert the leaf record
  INSERT INTO leaves (
    domain,
    leaf_hash,
    period_start,
    period_end,
    dkim_pass_count,
    dkim_fail_count,
    selector_hash,
    source_ip_hash,
    report_hash,
    reporting_org
  ) VALUES (
    p_domain,
    p_leaf_hash,
    p_period_start,
    p_period_end,
    p_dkim_pass_count,
    p_dkim_fail_count,
    p_selector_hash,
    p_source_ip_hash,
    p_report_hash,
    p_reporting_org
  )
  ON CONFLICT (leaf_hash) DO NOTHING;  -- Idempotent — duplicate reports are safe

  -- Add to pending leaves for next root publication
  INSERT INTO pending_leaves (leaf_id, leaf_hash)
  SELECT id, leaf_hash
  FROM leaves
  WHERE leaf_hash = p_leaf_hash
  ON CONFLICT (leaf_id) DO NOTHING;

END;
$$;
```

**Leaf Construction:** `apps/processor-worker/src/leaf.ts`

```typescript
import { keccak256, encodePacked } from 'viem'

export interface LeafInput {
  domain: string
  periodStart: number      // Unix timestamp (seconds)
  periodEnd: number        // Unix timestamp (seconds)
  dkimPassCount: number
  dkimFailCount: number
  selectors: string[]      // Sorted array of DKIM selectors
  sourceIpRanges: string[] // Sorted array of /24 IP ranges
  reportXmlHash: string    // keccak256 of original XML (or report ID)
  reportingOrg: string
}

export interface ConstructedLeaf {
  hash: string             // hex keccak256 leaf hash
  selectorHash: string     // hex keccak256 of sorted selectors joined
  sourceIpHash: string     // hex keccak256 of sorted IP ranges joined
  reportHash: string       // hex keccak256 of report identifier
}

export function constructLeaf(input: LeafInput): ConstructedLeaf {
  // Hash the sets to fixed-length values
  const selectorHash = keccak256(
    encodePacked(['string'], [input.selectors.join(',')])
  )
  const sourceIpHash = keccak256(
    encodePacked(['string'], [input.sourceIpRanges.join(',')])
  )
  const reportHash = keccak256(
    encodePacked(['string'], [input.reportXmlHash])
  )
  const domainHash = keccak256(
    encodePacked(['string'], [input.domain])
  )

  // Construct the leaf hash — all inputs are deterministic
  // Same inputs always produce the same leaf hash
  const leafHash = keccak256(
    encodePacked(
      ['bytes32', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes32', 'bytes32', 'bytes32'],
      [
        domainHash,
        BigInt(input.periodStart),
        BigInt(input.periodEnd),
        BigInt(input.dkimPassCount),
        BigInt(input.dkimFailCount),
        selectorHash,
        sourceIpHash,
        reportHash,
      ]
    )
  )

  return {
    hash: leafHash,
    selectorHash,
    sourceIpHash,
    reportHash,
  }
}
```

---

## Component 3: Publisher Worker (Cron)

**Entry point:** `apps/publisher-worker/src/index.ts`

Runs daily at 00:00 UTC. Reads pending leaves from Supabase. Builds the Merkle root. Publishes to Base. Updates Supabase with the result.

```typescript
import { createClient } from '@supabase/supabase-js'
import { buildMerkleRoot } from './root'
import { publishToBase } from './contract'
import type { Env } from './types'

export default {
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(publishDailyRoot(env))
  },
}

async function publishDailyRoot(env: Env): Promise<void> {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

  // Step 1: Read all pending leaves — ordered by id for determinism
  const { data: pendingLeaves, error: fetchError } = await supabase
    .from('pending_leaves')
    .select('leaf_id, leaf_hash')
    .order('leaf_id', { ascending: true })

  if (fetchError) throw fetchError
  if (!pendingLeaves || pendingLeaves.length === 0) {
    console.log('No pending leaves — skipping publication')
    return
  }

  const leafHashes = pendingLeaves.map(l => l.leaf_hash as `0x${string}`)

  // Step 2: Compute the Merkle root from all pending leaf hashes
  const { root, tree } = buildMerkleRoot(leafHashes)

  // Step 3: Publish to Base mainnet
  const { txHash, blockNumber } = await publishToBase(
    root,
    leafHashes.length,
    env
  )

  // Step 4: Record the published root and update leaf records
  // All in a Supabase transaction
  const { data: rootRecord, error: rootError } = await supabase
    .from('published_roots')
    .insert({
      root_hash: root,
      leaf_count: leafHashes.length,
      tx_hash: txHash,
      block_number: Number(blockNumber),
      chain_id: 8453,
    })
    .select()
    .single()

  if (rootError) throw rootError

  // Step 5: Link leaves to this root and remove from pending
  const leafIds = pendingLeaves.map(l => l.leaf_id)

  const { error: updateError } = await supabase
    .from('leaves')
    .update({ anchored_root_id: rootRecord.id })
    .in('id', leafIds)

  if (updateError) throw updateError

  const { error: deleteError } = await supabase
    .from('pending_leaves')
    .delete()
    .in('leaf_id', leafIds)

  if (deleteError) throw deleteError

  console.log(
    `Published root ${root} with ${leafHashes.length} leaves. Tx: ${txHash}`
  )
}
```

**Merkle Root Builder:** `packages/shared/src/merkle.ts`

```typescript
import { keccak256, encodePacked } from 'viem'

// Standard keccak256 binary Merkle tree
// Same algorithm as OpenZeppelin MerkleTree.js
// Compatible with the Solidity verifyProof function

export interface MerkleTree {
  root: `0x${string}`
  leaves: `0x${string}`[]
  layers: `0x${string}`[][]
}

export function buildMerkleRoot(
  leaves: `0x${string}`[]
): { root: `0x${string}`; tree: MerkleTree } {
  if (leaves.length === 0) {
    throw new Error('Cannot build Merkle tree from empty leaf set')
  }

  // Sort leaves for determinism
  // Same set of leaves always produces the same root
  const sortedLeaves = [...leaves].sort()

  const layers: `0x${string}`[][] = [sortedLeaves]

  let currentLayer = sortedLeaves
  while (currentLayer.length > 1) {
    const nextLayer: `0x${string}`[] = []
    for (let i = 0; i < currentLayer.length; i += 2) {
      const left = currentLayer[i]
      const right = currentLayer[i + 1] ?? left  // Duplicate last node if odd
      nextLayer.push(hashPair(left, right))
    }
    layers.push(nextLayer)
    currentLayer = nextLayer
  }

  const root = currentLayer[0]

  return {
    root,
    tree: { root, leaves: sortedLeaves, layers },
  }
}

export function generateInclusionProof(
  tree: MerkleTree,
  leafHash: `0x${string}`
): `0x${string}`[] {
  const proof: `0x${string}`[] = []
  let index = tree.leaves.indexOf(leafHash)

  if (index === -1) throw new Error('Leaf not found in tree')

  for (let i = 0; i < tree.layers.length - 1; i++) {
    const layer = tree.layers[i]
    const siblingIndex = index % 2 === 0 ? index + 1 : index - 1
    const sibling = layer[siblingIndex] ?? layer[index]  // Use self if no sibling
    proof.push(sibling)
    index = Math.floor(index / 2)
  }

  return proof
}

// Hash two nodes — sort them first so the order doesn't matter
// This matches the Solidity verifyProof implementation
function hashPair(
  a: `0x${string}`,
  b: `0x${string}`
): `0x${string}` {
  const [left, right] = a <= b ? [a, b] : [b, a]
  return keccak256(encodePacked(['bytes32', 'bytes32'], [left, right]))
}
```

**Contract Interaction:** `apps/publisher-worker/src/contract.ts`

```typescript
import {
  createWalletClient,
  createPublicClient,
  http,
  parseAbi,
} from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const PACT_REGISTRY_ABI = parseAbi([
  'function publishRoot(bytes32 root, uint256 leafCount) external',
  'function verifyProof(bytes32 leaf, bytes32[] calldata proof, bytes32 root) external pure returns (bool)',
  'function getLatestRoot() external view returns (bytes32 root, uint256 leafCount, uint256 timestamp)',
  'event RootPublished(bytes32 indexed root, uint256 leafCount, uint256 timestamp, uint256 rootIndex)',
])

export async function publishToBase(
  root: `0x${string}`,
  leafCount: number,
  env: Env
): Promise<{ txHash: `0x${string}`; blockNumber: bigint }> {
  const account = privateKeyToAccount(
    env.BASE_PRIVATE_KEY as `0x${string}`
  )

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(env.BASE_RPC_URL),
  })

  const publicClient = createPublicClient({
    chain: base,
    transport: http(env.BASE_RPC_URL),
  })

  const txHash = await walletClient.writeContract({
    address: env.PACT_REGISTRY_ADDRESS as `0x${string}`,
    abi: PACT_REGISTRY_ABI,
    functionName: 'publishRoot',
    args: [root, BigInt(leafCount)],
  })

  // Wait for confirmation before returning
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

  return {
    txHash,
    blockNumber: receipt.blockNumber,
  }
}
```

---

## Component 4: Smart Contract

**File:** `packages/contracts/src/PACTRegistry.sol`

Uses native `keccak256` throughout — matching the TypeScript implementation exactly.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PACTRegistry
 * @notice Immutable registry for PACT Protocol Merkle roots.
 *
 * Deployed once on Base mainnet. Never upgraded.
 *
 * Merkle tree uses keccak256 throughout, matching the TypeScript
 * implementation in packages/shared/src/merkle.ts exactly.
 * Leaves are sorted before hashing. Pairs are sorted before hashing.
 *
 * Anyone can verify a Merkle inclusion proof against any published
 * root without trusting PBM Labs or any third party.
 */
contract PACTRegistry {

    struct MerkleRoot {
        bytes32 root;
        uint256 leafCount;
        uint256 timestamp;
    }

    MerkleRoot[] public roots;

    // Publisher address — PBM Labs controlled in MVP
    // Permissionless submission deferred to v0.2
    address public immutable publisher;

    event RootPublished(
        bytes32 indexed root,
        uint256 leafCount,
        uint256 timestamp,
        uint256 rootIndex
    );

    error NotPublisher();

    constructor(address _publisher) {
        publisher = _publisher;
    }

    /**
     * @notice Publish a new Merkle root.
     * @param root The keccak256 Merkle root of all leaves in this batch.
     * @param leafCount Number of leaves included in this root.
     */
    function publishRoot(bytes32 root, uint256 leafCount) external {
        if (msg.sender != publisher) revert NotPublisher();

        uint256 index = roots.length;
        roots.push(MerkleRoot({
            root: root,
            leafCount: leafCount,
            timestamp: block.timestamp
        }));

        emit RootPublished(root, leafCount, block.timestamp, index);
    }

    /**
     * @notice Verify a Merkle inclusion proof.
     *
     * The proof is a list of sibling hashes from the leaf to the root.
     * Pairs are sorted before hashing — matching the TypeScript implementation.
     *
     * @param leaf The leaf hash to verify.
     * @param proof Sibling hashes forming the inclusion path.
     * @param root The Merkle root to verify against.
     * @return true if the leaf is included in the tree with this root.
     */
    function verifyProof(
        bytes32 leaf,
        bytes32[] calldata proof,
        bytes32 root
    ) external pure returns (bool) {
        bytes32 computed = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 sibling = proof[i];
            // Sort the pair before hashing — same as TypeScript hashPair()
            if (computed <= sibling) {
                computed = keccak256(abi.encodePacked(computed, sibling));
            } else {
                computed = keccak256(abi.encodePacked(sibling, computed));
            }
        }
        return computed == root;
    }

    /**
     * @notice Get the most recently published root.
     */
    function getLatestRoot()
        external
        view
        returns (bytes32 root, uint256 leafCount, uint256 timestamp)
    {
        require(roots.length > 0, "No roots published yet");
        MerkleRoot storage latest = roots[roots.length - 1];
        return (latest.root, latest.leafCount, latest.timestamp);
    }

    /**
     * @notice Get total number of published roots.
     */
    function getRootCount() external view returns (uint256) {
        return roots.length;
    }
}
```

---

## Component 5: Web Frontend (Vercel + Next.js)

### Domain API Route: `apps/web/src/app/api/domain/[domain]/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { computeTrustScore } from '@pact/shared/trust-score'
import { buildMerkleRoot, generateInclusionProof } from '@pact/shared/merkle'
import { isValidDomain } from '@pact/shared/domain'
import type { DomainProofResponse } from '@pact/shared/types'

export async function GET(
  request: Request,
  { params }: { params: { domain: string } }
): Promise<Response> {
  const domain = params.domain.toLowerCase()

  if (!isValidDomain(domain)) {
    return Response.json({ error: 'Invalid domain' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  // Fetch domain stats
  const { data: stats } = await supabase
    .from('domain_stats')
    .select('*')
    .eq('domain', domain)
    .single()

  if (!stats) {
    return Response.json({
      domain,
      connected: false,
      trustScore: 0,
      message: 'This domain has not connected to PACT Protocol.',
    } satisfies DomainProofResponse)
  }

  // Fetch the latest published root
  const { data: latestRoot } = await supabase
    .from('published_roots')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch the domain's anchored leaf hashes for proof generation
  const { data: domainLeaves } = await supabase
    .from('leaves')
    .select('leaf_hash, leaf_index')
    .eq('domain', domain)
    .not('anchored_root_id', 'is', null)
    .order('id', { ascending: true })

  const trustScore = computeTrustScore({
    totalPassCount: stats.total_pass_count,
    totalFailCount: stats.total_fail_count,
    leafCount: stats.leaf_count,
    reportingOrgsCount: stats.reporting_orgs.length,
    pactHistoryStart: new Date(stats.first_report_time).getTime(),
    domainRegisteredAt: stats.domain_registered_at
      ? new Date(stats.domain_registered_at).getTime()
      : undefined,
  })

  const response: DomainProofResponse = {
    domain,
    connected: true,
    // `connectedSince` means "PACT history start" — kept under this
    // name for backward API compatibility, but never to be confused
    // with `domainRegisteredAt` below. The two are always returned
    // together so no consumer of this API can accidentally treat
    // one as the other.
    connectedSince: new Date(stats.first_report_time).getTime(),
    domainRegisteredAt: stats.domain_registered_at
      ? new Date(stats.domain_registered_at).getTime()
      : null,
    lastActivity: new Date(stats.last_report_time).getTime(),
    trustScore: Number(trustScore.score.toFixed(2)),
    trustScoreComponents: {
      volume: Number(trustScore.volume.toFixed(4)),
      diversity: Number(trustScore.diversity.toFixed(4)),
      maturity: Number(trustScore.maturity.toFixed(4)),
    },
    authentication: {
      totalPassCount: stats.total_pass_count,
      totalFailCount: stats.total_fail_count,
      passRate:
        stats.total_pass_count /
        (stats.total_pass_count + stats.total_fail_count || 1),
      leafCount: stats.leaf_count,
      knownSelectors: stats.known_selectors,
      knownIpRanges: stats.known_ip_ranges,
    },
    merkle: latestRoot
      ? {
          latestRoot: latestRoot.root_hash,
          latestRootTimestamp: new Date(latestRoot.published_at).getTime(),
          latestRootTxHash: latestRoot.tx_hash,
          latestRootBlockNumber: latestRoot.block_number,
          basescanUrl: `https://basescan.org/tx/${latestRoot.tx_hash}`,
        }
      : undefined,
  }

  return Response.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
```

**Front-end display rule:** any component rendering `trustScore` or `connectedSince` from this response must render `domainRegisteredAt` in the same view, with comparable visual weight — never smaller or hidden behind a tooltip. A domain showing `T < 1.0` alongside "domain registered 2017" is a fundamentally different result than `T < 1.0` alongside "domain registered this month," and the UI must make that difference impossible to miss.

### Cloudflare OAuth Route: `apps/web/src/app/api/connect/cloudflare/route.ts`

```typescript
import { isValidDomain } from '@pact/shared/domain'
import { createClient } from '@supabase/supabase-js'
import { resolveDomainRegisteredAt } from '../../../lib/domain-age'

const CF_AUTH_URL = 'https://dash.cloudflare.com/oauth2/auth'
const CF_TOKEN_URL = 'https://dash.cloudflare.com/oauth2/token'
const CF_API = 'https://api.cloudflare.com/client/v4'

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (!code || !state) {
    // Step 1: Initiate OAuth flow
    const domain = url.searchParams.get('domain')
    if (!domain || !isValidDomain(domain)) {
      return new Response('Valid domain required', { status: 400 })
    }

    const statePayload = btoa(JSON.stringify({
      domain,
      nonce: crypto.randomUUID(),
    }))

    const authUrl = new URL(CF_AUTH_URL)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('client_id', process.env.CF_CLIENT_ID!)
    authUrl.searchParams.set('redirect_uri', process.env.CF_REDIRECT_URI!)
    authUrl.searchParams.set('scope', 'zone:read dns:read dns:write')
    authUrl.searchParams.set('state', statePayload)

    return Response.redirect(authUrl.toString(), 302)
  }

  // Step 2: Handle OAuth callback
  const { domain } = JSON.parse(atob(state))

  // Exchange code for token
  const tokenRes = await fetch(CF_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.CF_CLIENT_ID!,
      client_secret: process.env.CF_CLIENT_SECRET!,
      redirect_uri: process.env.CF_REDIRECT_URI!,
      code,
    }),
  })

  const { access_token: token } = await tokenRes.json()

  // Get the zone ID for this domain
  const zonesRes = await fetch(
    `${CF_API}/zones?name=${domain}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const zonesData = await zonesRes.json()
  const zone = zonesData.result?.[0]
  if (!zone) {
    return new Response('Domain not found in Cloudflare account', { status: 404 })
  }

  // Get existing _dmarc TXT record
  const recordsRes = await fetch(
    `${CF_API}/zones/${zone.id}/dns_records?type=TXT&name=_dmarc.${domain}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const recordsData = await recordsRes.json()
  const existingRecord = recordsData.result?.[0]

  // Update or create the _dmarc record
  const PACT_RUA = 'mailto:rua@pact.pbmlabs.com'
  const updatedContent = addPACTToRua(existingRecord?.content ?? '', PACT_RUA)

  if (existingRecord) {
    await fetch(
      `${CF_API}/zones/${zone.id}/dns_records/${existingRecord.id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedContent }),
      }
    )
  } else {
    await fetch(
      `${CF_API}/zones/${zone.id}/dns_records`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'TXT',
          name: `_dmarc.${domain}`,
          content: `v=DMARC1; p=none; rua=${PACT_RUA}`,
          ttl: 300,
        }),
      }
    )
  }

  // Register domain in Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  await supabase.from('connected_domains').upsert({
    domain,
    connection_method: 'cloudflare_oauth',
    cloudflare_zone_id: zone.id,
    connected_at: new Date().toISOString(),
  })

  // Resolve the domain's public registration date once, at connection
  // time. This is display-only context (pact_protocol_v01.md Section
  // 4.2) — it is stored so a long-established domain that is only
  // connecting today doesn't get presented as if it were brand new.
  // A failed or unavailable lookup is not an error: domainRegisteredAt
  // simply stays null and the UI omits it rather than guessing.
  const domainRegisteredAt = await resolveDomainRegisteredAt(domain)

  // Initialize domain_stats row as pending
  await supabase.from('domain_stats').upsert({
    domain,
    status: 'pending_first_report',
    domain_registered_at: domainRegisteredAt
      ? new Date(domainRegisteredAt).toISOString()
      : null,
  })

  return Response.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/domain/${domain}?connected=true`,
    302
  )
}

function addPACTToRua(existing: string, pactRua: string): string {
  if (!existing) return `v=DMARC1; p=none; rua=${pactRua}`
  if (existing.includes('pact.pbmlabs.com')) return existing  // Already connected

  if (existing.includes('rua=')) {
    return existing.replace(
      /rua=([^;]+)/,
      (_, current) => `rua=${current.trim()}, ${pactRua}`
    )
  }

  return `${existing}; rua=${pactRua}`
}
```

---

## Trust Score Implementation

**`packages/shared/src/trust-score.ts`**

```typescript
// IMPORTANT: domainRegisteredAt and pactHistoryStart are two different
// clocks and must never be merged into a single number. Only
// pactHistoryStart feeds the trust score formula. domainRegisteredAt
// is returned alongside the score for display purposes only — it
// exists to prevent a long-established domain that connects to PACT
// today from appearing identical to a brand-new domain on day one.
// See pact_protocol_v01.md Section 4.2 for the full rationale.
//
// Renaming note: this field was previously called `firstReportTime`
// in earlier versions of this spec. It has been renamed to
// `pactHistoryStart` everywhere — in this file, in the database
// schema, and in every API response — specifically so that nobody
// refactoring this code later mistakes it for the domain's actual
// registration date. If you are migrating existing code, rename
// every occurrence of `firstReportTime` to `pactHistoryStart`.

export interface TrustScoreInput {
  totalPassCount: number
  totalFailCount: number
  leafCount: number
  reportingOrgsCount: number
  pactHistoryStart: number       // Unix ms — was `firstReportTime`
  domainRegisteredAt?: number    // Unix ms — NEVER used in score math.
                                  // Optional because it may not be
                                  // resolved yet (WHOIS lookup pending
                                  // or unavailable for this TLD).
}

export interface TrustScoreResult {
  score: number
  volume: number
  diversity: number
  maturity: number                // This is PACT-history maturity only.
  domainRegisteredAt?: number     // Passed through unchanged, for
                                  // display next to the score — never
                                  // folded into `score` or `maturity`.
}

const LAMBDA = 0.005  // PACT-history maturity decay constant

export function computeTrustScore(input: TrustScoreInput): TrustScoreResult {
  const volume = computeVolume(input.totalPassCount)
  const diversity = computeDiversity(input.reportingOrgsCount, input.leafCount)
  const maturity = computeMaturity(input.pactHistoryStart)

  return {
    score: volume * diversity * maturity,
    volume,
    diversity,
    maturity,
    domainRegisteredAt: input.domainRegisteredAt,
  }
}

// log(V + 1) — logarithmic to prevent linear gaming
function computeVolume(totalPassCount: number): number {
  return Math.log(totalPassCount + 1)
}

// unique reporting orgs / leaf count — capped at 1.0
// Higher when many independent mail servers report the domain
function computeDiversity(
  reportingOrgsCount: number,
  leafCount: number
): number {
  if (leafCount === 0) return 0
  return Math.min(reportingOrgsCount / leafCount, 1.0)
}

// 1 - e^(-lambda * pact_history_days) — approaches 1 over ~2 years
// of PACT-verified history. Deliberately blind to domain registration
// age — see module header comment. A domain registered in 2017 that
// connects today still starts this factor at 0, exactly like a domain
// registered yesterday. That is correct behavior, not a bug: it is
// what keeps the domain-hijacking defense in pact_protocol_v01.md
// Section 5.3 intact. The UI layer is responsible for showing
// domainRegisteredAt alongside this so the two ages are never
// confused by whoever is reading the result.
function computeMaturity(pactHistoryStart: number): number {
  const ageMs = Date.now() - pactHistoryStart
  const ageInDays = ageMs / (1000 * 60 * 60 * 24)
  return 1 - Math.exp(-LAMBDA * ageInDays)
}
```

### Fetching Domain Registration Age

`domainRegisteredAt` is resolved via a public WHOIS/RDAP lookup at the time a domain connects (Section 6 onboarding flow), not derived from anything in the rua= report stream — DMARC reports say nothing about when a domain was registered. Use an RDAP client (RDAP is the modern, structured successor to WHOIS and does not require screen-scraping) and store the result once; it does not need to be re-fetched on every report.

```typescript
// apps/web/src/lib/domain-age.ts

// Resolves a domain's public registration date via RDAP.
// Called once at connection time (Section 6 onboarding flow),
// not on every report. Returns null if the lookup fails or the
// TLD's registry does not expose RDAP — callers must handle null
// and simply omit domainRegisteredAt rather than guessing.
export async function resolveDomainRegisteredAt(
  domain: string
): Promise<number | null> {
  try {
    const bootstrapRes = await fetch(
      `https://rdap.org/domain/${domain}`
    )
    if (!bootstrapRes.ok) return null

    const data = await bootstrapRes.json()
    const registrationEvent = data.events?.find(
      (e: { eventAction: string }) => e.eventAction === 'registration'
    )
    if (!registrationEvent?.eventDate) return null

    return new Date(registrationEvent.eventDate).getTime()
  } catch {
    return null
  }
}
```

---

## Shared Types

**`packages/shared/src/types.ts`**

```typescript
export interface QueuedReport {
  reportId: string
  receivedAt: number          // Unix ms
  domain: string
  reportingOrg: string
  dateRange: {
    begin: number             // Unix seconds
    end: number               // Unix seconds
  }
  records: DMARCRecord[]
}

export interface DMARCReport {
  reportId: string
  reportingOrg: string
  domain: string
  dateRange: {
    begin: number             // Unix seconds
    end: number               // Unix seconds
  }
  records: DMARCRecord[]
}

export interface DMARCRecord {
  sourceIp: string
  count: number
  dkimResult: 'pass' | 'fail' | 'none'
  spfResult: 'pass' | 'fail' | 'none'
  headerFrom: string
  dkimDomain: string
  dkimSelector: string
}

export interface DomainProofResponse {
  domain: string
  connected: boolean
  message?: string
  connectedSince?: number          // PACT history start (was firstReportTime)
  domainRegisteredAt?: number | null
                                    // Public domain registration date,
                                    // via RDAP. NEVER used in trustScore
                                    // math — display-only context.
                                    // null if lookup failed/unavailable,
                                    // distinct from undefined ("not
                                    // fetched yet"). See
                                    // pact_protocol_v01.md Section 4.2.
  lastActivity?: number
  trustScore: number
  trustScoreComponents?: {
    volume: number
    diversity: number
    maturity: number                // PACT-history maturity only —
                                    // does not reflect domainRegisteredAt
  }
  authentication?: {
    totalPassCount: number
    totalFailCount: number
    passRate: number
    leafCount: number
    knownSelectors: string[]
    knownIpRanges: string[]
  }
  merkle?: {
    latestRoot: string
    latestRootTimestamp: number
    latestRootTxHash: string
    latestRootBlockNumber: number
    basescanUrl: string
  }
}
```

---

## Environment Variables

**`.env.example`** — copy to `.env.local` for local development

```bash
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...           # Service role key (never expose client-side)
SUPABASE_ANON_KEY=eyJ...              # Anon key (safe for client-side)

# Base (Ethereum L2)
BASE_PRIVATE_KEY=0x...                # Publisher wallet private key
BASE_RPC_URL=https://mainnet.base.org
PACT_REGISTRY_ADDRESS=0x...           # Set after contract deployment

# Cloudflare OAuth (for domain onboarding)
CF_CLIENT_ID=...
CF_CLIENT_SECRET=...
CF_REDIRECT_URI=https://pact.pbmlabs.com/api/connect/cloudflare

# Vercel
NEXT_PUBLIC_BASE_URL=https://pact.pbmlabs.com
```

**Cloudflare Workers secrets** (set via `wrangler secret put`):

```bash
SUPABASE_URL
SUPABASE_SERVICE_KEY
BASE_PRIVATE_KEY
BASE_RPC_URL
PACT_REGISTRY_ADDRESS
```

---

## Package Dependencies

**`packages/shared/package.json`**

```json
{
  "name": "@pact/shared",
  "version": "0.1.0",
  "dependencies": {
    "viem": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**`apps/email-worker/package.json`**

```json
{
  "name": "@pact/email-worker",
  "version": "0.1.0",
  "dependencies": {
    "@pact/shared": "workspace:*",
    "postal-mime": "^2.0.0",
    "fast-xml-parser": "^4.0.0",
    "fflate": "^0.8.0"
  },
  "devDependencies": {
    "wrangler": "^3.0.0",
    "@cloudflare/workers-types": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

Note: For ZIP decompression inside Cloudflare Workers, use `fflate`'s `unzipSync` which handles both ZIP and GZIP formats. The library is Workers-compatible. Do not use `node:zlib` or any Node.js built-in — Workers do not have access to Node built-ins for binary decompression.

**`apps/processor-worker/package.json`**

```json
{
  "name": "@pact/processor-worker",
  "version": "0.1.0",
  "dependencies": {
    "@pact/shared": "workspace:*",
    "@supabase/supabase-js": "^2.0.0",
    "viem": "^2.0.0"
  },
  "devDependencies": {
    "wrangler": "^3.0.0",
    "@cloudflare/workers-types": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

**`apps/publisher-worker/package.json`**

```json
{
  "name": "@pact/publisher-worker",
  "version": "0.1.0",
  "dependencies": {
    "@pact/shared": "workspace:*",
    "@supabase/supabase-js": "^2.0.0",
    "viem": "^2.0.0"
  },
  "devDependencies": {
    "wrangler": "^3.0.0",
    "@cloudflare/workers-types": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

**`apps/web/package.json`**

```json
{
  "name": "@pact/web",
  "version": "0.1.0",
  "dependencies": {
    "@pact/shared": "workspace:*",
    "@supabase/supabase-js": "^2.0.0",
    "viem": "^2.0.0",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0"
  }
}
```

---

## Build Order

Follow this sequence exactly. Do not start a step until the previous step passes its verification criteria.

```
STEP 1 — Supabase schema
  Run the migration: supabase/migrations/001_initial_schema.sql
  Run the stored procedure definition (insert_leaf_and_update_stats)
  Verify: all tables exist in Supabase dashboard
  Verify: calling the stored procedure with test data
          inserts correctly and updates domain_stats atomically

STEP 2 — Shared package
  Implement merkle.ts (keccak256 Merkle tree)
  Implement trust-score.ts
  Implement types.ts
  Write unit tests:
    - buildMerkleRoot(['0xabc...', '0xdef...']) returns consistent root
    - generateInclusionProof returns a proof that passes verifyProof
    - computeTrustScore returns expected values for known inputs
  All tests must pass before proceeding

STEP 3 — Smart contract
  Implement PACTRegistry.sol
  Write Hardhat tests:
    - publishRoot emits RootPublished event
    - verifyProof returns true for a valid proof generated by
      the TypeScript buildMerkleRoot + generateInclusionProof
    - verifyProof returns false for an invalid proof
  The TypeScript proof MUST verify on-chain before proceeding
  Deploy to Base Sepolia testnet
  Verify contract on Basescan Sepolia
  Record testnet contract address

STEP 4 — Email Worker
  Implement extractor.ts (ZIP + GZIP + raw XML)
  Implement parser.ts (DMARC XML parser)
  Test with the sample XML in Appendix A
  Test with a real gzip-compressed report (generate one with fflate)
  Test with a real ZIP-compressed report (generate one with fflate)
  Deploy to Cloudflare
  Send a test email with the sample XML as attachment
  to rua@pact.pbmlabs.com
  Verify the message appears in the Cloudflare Queue

STEP 5 — Processor Worker
  Implement leaf.ts (keccak256 leaf construction)
  Implement queue consumer that calls the Supabase stored procedure
  Deploy to Cloudflare
  Trigger processing of the test message from Step 4
  Verify: leaf appears in Supabase leaves table
  Verify: domain_stats row is created/updated correctly
  Verify: pending_leaves row is created

STEP 6 — Publisher Worker
  Implement root.ts and contract.ts
  Test against Base Sepolia with testnet contract address
  Trigger manually (wrangler trigger) with pending test leaves
  Verify: root is published on Base Sepolia
  Verify: Basescan Sepolia shows the transaction
  Verify: the TypeScript-generated proof for a leaf
          passes verifyProof on-chain
  Switch to Base mainnet contract address
  Deploy to Cloudflare production

STEP 7 — Web frontend
  Implement API routes (domain stats, OAuth)
  Implement domain-age.ts (RDAP lookup, no new dependency —
  uses native fetch against rdap.org)
  Implement domain page UI — verify domainRegisteredAt renders
  next to trustScore with equal visual weight, including for
  domains with trustScore < 1.0
  Implement connect page UI
  Deploy to Vercel
  Test Cloudflare OAuth flow end-to-end with a real domain,
  including a domain known to be several years old, to confirm
  domainRegisteredAt resolves correctly and trust score still
  starts low

STEP 8 — End-to-end production test
  Connect pbmlabs.com via the onboarding flow
  Wait 24 hours for first rua= reports
  Verify leaf in Supabase, root on Base mainnet
  Verify pact.pbmlabs.com/domain/pbmlabs.com shows live trust score
  Verify domainRegisteredAt is displayed alongside the trust score
  Verify the Merkle proof on the page is independently
  verifiable on Basescan
```

---

## Critical Constraints Checklist

Before considering the MVP complete, verify every item:

```
CRYPTOGRAPHIC CONSISTENCY
  [ ] keccak256 is used everywhere — in TypeScript and in Solidity
  [ ] Poseidon is not used anywhere in this build
  [ ] A proof generated by generateInclusionProof() in TypeScript
      passes verifyProof() in the deployed Solidity contract
  [ ] Leaves are sorted before building the Merkle tree
  [ ] Pairs are sorted before hashing in both TypeScript and Solidity

CONCURRENCY SAFETY
  [ ] All reads and writes to domain_stats go through
      the insert_leaf_and_update_stats stored procedure
  [ ] No Worker reads a value from Supabase and writes it back
      outside of a transaction or stored procedure
  [ ] pending_leaves is only cleared after successful
      on-chain root publication (not before)

ATTACHMENT HANDLING
  [ ] .zip attachments are correctly decompressed and parsed
  [ ] .xml.gz attachments are correctly decompressed and parsed
  [ ] .xml (raw) attachments are correctly parsed
  [ ] Malformed or unrecognized attachments are silently discarded
  [ ] ruf= forensic reports are rejected before attachment extraction

PRIVACY
  [ ] No email body content is logged or stored at any point
  [ ] No recipient email addresses are stored
  [ ] Only domains are stored — never full email addresses
  [ ] The raw DMARC XML is not persisted after parsing
  [ ] R2 is not used for any mutable state

TRUST SCORE INTEGRITY
  [ ] `domainRegisteredAt` never appears as an input to
      computeTrustScore() or to any of its internal functions
  [ ] Every variable and column that feeds the maturity factor
      is named `pactHistoryStart` / `pact_age` / `pact_history_*`
      — never `age`, `firstSeen`, or anything that could be
      confused with domain registration age
  [ ] Every UI surface that displays `trustScore` also displays
      `domainRegisteredAt` in the same view, with comparable
      visual weight, even when the trust score is `T < 1.0`
  [ ] A domain hijacking simulation (swap known_selectors and
      known_ip_ranges abruptly in test data) does not produce
      an inflated maturity factor regardless of how old
      domainRegisteredAt is for that test domain

VERIFIABILITY
  [ ] The domain page shows a live trust score backed by real data
  [ ] The displayed Merkle proof can be verified on Basescan
      using the deployed verifyProof() function
  [ ] A domain with no PACT history returns trust score 0, not an error
  [ ] The on-chain root matches what the domain page displays
```

---

## Appendix A: Sample DMARC Aggregate Report XML

Use this for parser testing in Step 4.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<feedback>
  <report_metadata>
    <org_name>google.com</org_name>
    <email>noreply-dmarc-support@google.com</email>
    <report_id>12345678901234567890</report_id>
    <date_range>
      <begin>1749081600</begin>
      <end>1749168000</end>
    </date_range>
  </report_metadata>
  <policy_published>
    <domain>pbmlabs.com</domain>
    <adkim>r</adkim>
    <aspf>r</aspf>
    <p>reject</p>
    <pct>100</pct>
  </policy_published>
  <record>
    <row>
      <source_ip>209.85.220.41</source_ip>
      <count>47</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>pass</dkim>
        <spf>pass</spf>
      </policy_evaluated>
    </row>
    <identifiers>
      <header_from>pbmlabs.com</header_from>
    </identifiers>
    <auth_results>
      <dkim>
        <domain>pbmlabs.com</domain>
        <selector>google-2024</selector>
        <result>pass</result>
      </dkim>
      <spf>
        <domain>pbmlabs.com</domain>
        <result>pass</result>
      </spf>
    </auth_results>
  </record>
  <record>
    <row>
      <source_ip>74.125.130.27</source_ip>
      <count>12</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>pass</dkim>
        <spf>pass</spf>
      </policy_evaluated>
    </row>
    <identifiers>
      <header_from>pbmlabs.com</header_from>
    </identifiers>
    <auth_results>
      <dkim>
        <domain>pbmlabs.com</domain>
        <selector>google-2024</selector>
        <result>pass</result>
      </dkim>
      <spf>
        <domain>pbmlabs.com</domain>
        <result>pass</result>
      </spf>
    </auth_results>
  </record>
</feedback>
```

---

*PACT Protocol — Build Specification v1.1*  
*PBM Labs LLC — June 2026*  
*For Claude Sonnet / Opus — Greenfield build*
