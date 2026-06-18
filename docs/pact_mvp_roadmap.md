# PACT Protocol — MVP Strategy & Roadmap
**PBM Labs LLC**
**June 2026 — Internal Working Document**
**Protocol baseline:** [Protocol Specification v0.2](pact_protocol_v02.md)

---

## The Single Governing Principle

The MVP does not build a product. It proves the protocol works with real data from a real domain, visible to anyone on the internet. Everything else follows from that proof.

No domain connected means no leaves. No leaves means no trust score. No trust score means no Chain credential. No sustained history means no Signal baseline. The ecosystem layers are sequentially dependent. The only way to unlock them is to make the protocol real first.

The MVP is complete when `pact.pbm-labs.com/domain/pbm-labs.com` shows a live trust score (labeled **provisional** per v0.2 until ~139 days of history) backed by real DMARC aggregate reports, authenticated per the reporter allowlist, anchored in a real 32-level Merkle tree on Base. That page is the product. Everything before it is infrastructure. Everything after it is growth.

**Build sequence:** MVP is delivered in two internal phases. **Phase 0a (staging)** proves the pipeline with real data but no blockchain. **Phase 0b (MVP complete)** adds Base as the trust anchor. Do not call the MVP done until 0b ships.

---

## Phase 0a / Phase 0b — Staging Then Chain

| Phase | Name | Base? | Purpose |
|-------|------|-------|---------|
| **0a** | Staging / internal | No | Prove real DMARC → real leaves → real score |
| **0b** | MVP complete | Yes | Prove independent verification without trusting PBM Labs |

### Phase 0a — Staging (Week 1–2, no Base)

**Goal:** One connected domain (`pbm-labs.com`), real `rua=` reports, leaves in Supabase, trust score on a staging page — no blockchain.

**Build (same as MVP minus chain):**

1. SMTP receiver + reporter allowlist + SPF
2. DMARC parser + leaf aggregation (Appendix C)
3. 32-level Merkle tree in Supabase — do not simplify; required unchanged for 0b
4. `pact-score-0.2` on read
5. Staging page at `pact.pbm-labs.com/domain/{domain}` with a visible **"Staging — not yet anchored on-chain"** banner

**Staging root model (replaces on-chain in 0a):**

Roots are published daily into Supabase instead of Base. Same Merkle math; different trust anchor.

```
merkle_roots {
  root_hash:      bytes32
  leaf_count:     integer
  published_at:   timestamp
  anchor_type:    'staging' | 'base'
  tx_hash:        text      // null in 0a
  block_number:   bigint    // null in 0a
}
```

Verification in 0a recomputes the inclusion proof against the published staging root. Same cryptography as 0b — verifier still relies on PBM Labs for the root until chain ships.

**0a success criteria:**

```
[x] pbm-labs.com DNS + Email Routing configured (rua@pact.pbm-labs.com → worker)
[x] Ingest pipeline deployed (parse, allowlist, dedup, insert_leaf, staging root)
[ ] pbm-labs.com receiving authenticated rua= reports (awaiting ~24–48h)
[ ] At least one leaf from Gmail (or other allowlisted reporter)
[x] Leaf hash reproducible from Appendix C test vector (pnpm test)
[ ] Merkle inclusion proof verifies against staging root (live data)
[ ] Trust score visible with provisional label (live data)
[ ] End-to-end within 48h of first report batch
```

**Skip in 0a:** Solidity deploy, Base wallet, block explorer links, "verify without PBM Labs" claims, FluidRWA / external partnership demos.

### Phase 0a — Reference implementation status (June 2026)

The monorepo at repository root implements Phase 0a. Operational domain: **`pbm-labs.com`**.

| Component | Location | Status |
|-----------|----------|--------|
| DMARC parser + leaf encoding | `packages/pact-core` | Done |
| Reporter allowlist | `packages/pact-core/src/auth/allowlist.ts` | Done |
| 32-level sparse Merkle tree | `packages/pact-core` | Done |
| `pact-score-0.2` trust score | `packages/pact-core` | Done |
| Email intake worker | `workers/ingest` (Cloudflare) | Deployed |
| Queue processor | `pact-reports` → Supabase | Deployed |
| PostgreSQL schema | `supabase/schema.sql` | Done |
| Public domain page | `apps/web` → `/domain/{domain}` | Done |
| Intake address | `rua@pact.pbm-labs.com` | Live |
| First real DMARC report | Supabase `leaves` table | **Pending** (~24–48h) |

**Page behavior:** Connected domains with no reports yet show a waiting state. The full dashboard (trust score, Merkle root, staging banner) appears after the first authenticated leaf is ingested.

**Local testing:** `pnpm dev:ingest-fixture` simulates a Google report into Supabase without email. Use only for pipeline verification — production staging page waits for real reporter data.

See root [README.md](../README.md) for DNS, Email Routing, and deploy steps.

### Phase 0b — MVP Complete (Week 2–3, add Base)

**Goal:** Same pipeline; only the trust anchor changes — staging root → on-chain root.

**Add (minimal delta):**

1. Deploy v0.2 contract on Base
2. Daily job: read latest canonical root → `publishRoot(root, leafCount)`
3. Store `tx_hash` and `block_number` on `merkle_roots` row with `anchor_type = 'base'`
4. Update public page: Base explorer link; remove staging banner
5. Proofs verifiable via contract `verifyProof` + on-chain `roots[]`

**Critical rule:** Do not change leaf format or Merkle algorithm between 0a and 0b. Only the root publication destination changes. 0a leaves must remain valid when anchored.

**0b success criteria:** See [MVP Success Criteria](#mvp-success-criteria) below (Week 2–8 gates).

### Who sees what when

| Audience | Minimum phase |
|----------|----------------|
| Engineering / internal | 0a |
| FluidRWA / partnerships | 0b + 1–2 external domains |
| Compliance / FinCEN pitch | 0b — "anchored on Base" is the line |

---

## Why Cloudflare First

Cloudflare manages DNS for approximately 32% of all internet domains. More importantly, it is where technically competent domain operators already manage their email authentication infrastructure. A domain operator who has configured DKIM and DMARC is, by definition, the right early adopter for PACT Protocol — they already understand email authentication and have already solved the setup friction once.

Cloudflare also provides three specific advantages for the MVP:

First, its API allows reading and writing DNS TXT records programmatically via OAuth. Adding `rua@pact.pbm-labs.com` to an existing `_dmarc` record is a single API call after the user authorizes access. No manual DNS editing required.

Second, Cloudflare's Email Security product already has a DMARC management interface. Users in that context are already thinking about aggregate reporting. PACT appears as the next logical step, not as something foreign.

Third, Cloudflare Workers is the natural deployment environment for PACT's edge processing infrastructure — the same platform used for CLUTCH. The team already knows it.

The MVP connects PBM Labs' own domain via Cloudflare as the first proof. Then opens onboarding for external domains via the same OAuth flow.

---

## MVP — Weeks 1 Through 8

**The objective:** Phase 0a proves the pipeline with real data (staging). Phase 0b adds Base and delivers the public, independently verifiable domain page. One domain connected, one trust score live, one page verifiable by anyone without trusting PBM Labs — **at 0b completion**.

### What Gets Built

**SMTP Receiver for rua= Reports**

A purpose-built SMTP receiver at `rua@pact.pbm-labs.com` that accepts incoming DMARC aggregate reports. Built on Cloudflare Email Workers or a minimal VPS with Postfix.

Per v0.2 §3.1.1, each report MUST pass source authentication before processing:

- **Direct delivery:** SPF validation; envelope sender matches reporter allowlist or report `org_name`.
- **Forwarded delivery (Path B):** Forwarding agent (Valimail, Postmark, etc.) on allowlist; original `org_name` preserved for leaf construction.
- **Anti-abuse:** Rate limits, deduplication on `(report_id, org_name, date_range, header_from)`.

Reports failing authentication are discarded. Authenticated reports are parsed, aggregated into leaf candidates, and passed to the processing pipeline. Raw XML is discarded after extraction.

This is the only external-facing component that receives data. Everything else is internal processing or public read.

**Aggregate Report Parser**

Parses the DMARC aggregate report XML schema (RFC 7489). Extracts per record: sending domain (`header_from`), DKIM result (pass/fail), message count, sending IP, DKIM selector, reporting period (`date_range`), and reporting organization (`report_metadata/org_name`).

Produces normalized structs per Appendix C of the v0.2 spec. No message content. No recipient identity. No personal data.

**Leaf Construction and Merkle Tree**

Aggregates rows into one leaf per leaf key: `(domain, period_start, period_end, reporter_org)`. Constructs a keccak256 leaf per v0.2 §3.2:

```
leaf = keccak256(
  domain_hash,
  period_start,
  period_end,
  reporter_hash,    // keccak256 of normalized org_name
  dkim_pass_count,  // summed across rows in this key
  dkim_fail_count,
  selector_hash,    // keccak256 of lexicographically sorted selectors
  source_ip_hash,   // keccak256 of sorted /24 IP ranges
  report_hash
)
```

Inserts the leaf into a 32-level append-only sparse Merkle tree (v0.2 §3.3.1). Leaf insertion index is monotonic; trust scoring uses report period timestamps, not insertion order.

Mutable state (leaf index, domain stats, pending batches, staging roots) lives in Supabase (PostgreSQL) with atomic transactions via a stored procedure. R2 stores immutable finalized leaf blobs after on-chain anchoring (0b; optional in 0a).

**Root Publication — Staging (Phase 0a)**

Publishes the Merkle root to the `merkle_roots` table daily (`anchor_type = 'staging'`). Staging page shows root hash, leaf count, and downloadable inclusion proofs verified against this root. No gas cost. No wallet required.

**On-Chain Root Publication (Phase 0b)**

Publishes the Merkle root to Base (Ethereum L2) daily, aligned with aggregate report cadence. Uses the v0.2 minimal contract:

```solidity
publishRoot(bytes32 root, uint256 leafCount)
// timestamp = block.timestamp at publication

verifyProof(bytes32 leaf, uint32 index, bytes32[] proof, bytes32 root)
```

Gas cost on Base is negligible. Contract is deployed once and immutable.

**Domain Stats Index**

Maintains an off-chain index of per-domain statistics derived from processed leaves:

```
domain_stats {
  domain: string
  total_pass_count: integer       // V(d,t): sum of dkim_pass_count
  total_fail_count: integer
  unique_reporter_count: integer    // distinct org_name values (R)
  unique_selector_count: integer
  unique_ip_range_count: integer
  first_report_time: timestamp      // first authenticated leaf period
  last_report_time: timestamp
}
```

Trust score is computed on read using algorithm `pact-score-0.2` (v0.2 §4.2):

```
T(d,t) = log(V + 1) × min(1, log(|R| + 1) / log(50)) × (1 - e^(-0.005 × age_days))
```

Score status is derived at read time: **provisional** when maturity `A(d,t) < 0.5` (~139 days); **activated** when `A(d,t) ≥ 0.5`. Neither score nor status is stored.

**Public Domain Page**

`pact.pbm-labs.com/domain/{domain}` — a public, no-authentication page.

**Phase 0a** shows a staging banner and a staging root (no block explorer). **Phase 0b** removes the banner and shows Base anchoring as below:

```
PACT Protocol — Domain Provenance Record

Domain:          wise.com
Connected since: March 14, 2026
Trust score:     7.4  (Activated)
Score algorithm: pact-score-0.2
Anchor:          Base  [or: Staging — not yet on-chain]

Authentication history
  Total verified messages:    2,847,291
  DKIM pass rate:             99.94%
  History depth:              847 days
  Unique reporting orgs:      312
  Maturity factor:            0.98

Infrastructure
  Known DKIM selectors:       google-2024, ses-2024
  Known sending IP ranges:    4 verified /24 ranges

Merkle proof
  Latest on-chain root:       0x4a7f...c291
  Leaf index:                 1,847,291
  Block:                      Base #18,472,981
  Timestamp:                  June 14, 2026 00:00 UTC
  [Download Merkle proof →]

Verification
  Anyone can verify this record independently using the
  on-chain root, leaf index, and inclusion proof.
  Leaf data provided by PBM Labs; roots attest inclusion.
  [How to verify independently →]
```

New domains show **Provisional** status and a lower maturity factor until ~139 days of continuous history. No login. No paywall. Fully public.

This page is what the bank, the compliance officer, the attorney, or the counterparty visits when they receive a document from a domain connected to PACT. High-stakes reliance (Chain credentials, onboarding decisions) requires **activated** status per v0.2 §4.3.

**Cloudflare OAuth Onboarding**

`pact.pbm-labs.com/connect` — a single-page onboarding flow:

Step 1: Enter your domain.
Step 2: Choose connection method — Cloudflare OAuth, manual DNS, or DMARC service forwarding.
Step 3 (Cloudflare path): Authorize via Cloudflare OAuth with zone-scoped DNS edit scope only (v0.2 §2.3). PACT reads the existing `_dmarc` TXT record, adds `rua@pact.pbm-labs.com` as a co-recipient, writes the updated record via the Cloudflare API. One confirmation click.
Step 4: Done. First aggregate reports arrive within 24 hours. Provisional trust score visible within 48 hours.

The manual DNS path shows the exact string to add to the existing `_dmarc` record with a copy button. The DMARC service path shows per-service instructions for the most common providers (Postmark, Valimail, EasyDMARC), with forwarding-agent authentication per §3.1.1.

### What Does Not Get Built in the MVP

- PACT Chain credential generation (requires activated scores)
- PACT Signal anomaly detection and alerting
- PACT Proof document verification
- Lookalike passive DNS monitoring (optional v0.3 feed)
- Mobile application
- Payments or subscription management
- Email notifications of any kind
- Dashboard for connected domain operators
- API documentation for external developers
- Any ZK proof circuit
- Permissionless root publication (v0.3)

These are not deferred because they are unimportant. They are deferred because building them before the protocol has real data is building on sand.

### Protocol Spec Blockers (Week 1)

These v0.2 requirements MUST ship before the first leaf:

1. Reporter and forwarding-agent allowlist (§3.1.1)
2. Leaf aggregation per `(domain, period, reporter_org)` (§3.2.1)
3. Canonical encoding per Appendix C (sorted selectors/IPs, domain normalization)
4. 32-level Merkle tree with indexed inclusion proofs (§3.3.1)
5. `pact-score-0.2` trust computation with provisional/activated labeling (§4.2–4.3)

### Phase 0a Success Criteria (Week 1–2)

```
Day 14:  pbm-labs.com connected and receiving authenticated rua= reports.
         Reporter allowlist rejecting unauthenticated submissions.
         First leaf in Supabase with verifiable staging-root inclusion proof.
         Staging page live at pact.pbm-labs.com/domain/pbm-labs.com
         showing provisional trust score and staging banner.
```

### MVP Success Criteria (Phase 0b — Weeks 2 Through 8)

```
Week 2–3: 0b complete.
          First root published on Base.
          Staging root hash == on-chain root hash for same leaf_count.
          Staging banner removed; Base block explorer link on public page.
          Merkle proof verifiable via contract (leaf + index + proof + root).

Week 4:   First external domain connected via Cloudflare OAuth.
          Trust score computed from real data (pact-score-0.2).
          Merkle proof independently verifiable on-chain.

Week 8:   Five external domains connected. Public pages live for each.
          Provisional vs. activated labeling visible; new domains
          show near-zero maturity vs. established domains.
          Jean Guerrier or equivalent contact shown the live system.
```

---

## V1 — PACT Chain (Months 2 Through 4)

**The objective:** a domain operator can generate a portable, auditable Chain credential from their PACT history and submit it to a bank, compliance body, or counterparty as proof of institutional legitimacy.

**Requires:** At least one connected domain reaching **activated** trust score status (`A(d,t) ≥ 0.5`, approximately 139 days of continuous history per v0.2 §4.3). Chain credentials MUST use activated scores for third-party reliance. Early credentials with provisional status may be generated for demonstration but are labeled as such.

### What Gets Built

**Chain Credential Generator**

Takes a connected domain's full Merkle history and produces a structured credential containing:

- Domain identity and connection date
- **Activated** trust score with component breakdown (V, D, A) and algorithm version `pact-score-0.2`
- Summary of authentication history (message counts, pass rates, periods covered)
- Merkle inclusion proofs for a representative sample of anchored leaves (with leaf indices)
- The sequence of on-chain roots that cover the full history period
- A verification URL that any party can use to independently confirm the credential
- Data availability notice: on-chain roots attest inclusion; verifiers should archive proofs they rely on (v0.2 §9.3)

Output formats: PDF for human consumption, JSON for machine verification.

The PDF is designed to be attached to a bank account opening request, a vendor onboarding submission, or a regulatory filing. It is not a marketing document. It reads like an auditor's report.

**Independent Verification Path**

`pact.pbm-labs.com/verify/{credential-id}` — a public page that takes a Chain credential and confirms its validity against the on-chain roots. No PBM Labs trust required — the page shows the verification math and links to the relevant Base block explorer entries.

This page must work even if PBM Labs ceases to operate. The on-chain roots are permanent. The Merkle proofs are self-contained. The verification logic is published as open source.

**Operator Dashboard (minimal)**

A simple authenticated view for connected domain operators showing their domain's current trust score, history, and a button to generate a Chain credential. Authentication via magic link to the domain's admin email address — no password, no OAuth.

### V1 Success Criteria

```
Month 3:  First Chain credential generated for an external
          domain (provisional label if < 139 days history).

Month 4:  First activated Chain credential submitted by a
          domain operator to a real bank, compliance body,
          or counterparty. Outcome documented (accepted,
          questioned, or rejected — all outcomes are useful).
```

---

## V2 — PACT Signal (Months 4 Through 8)

**The objective:** connected domain operators receive real-time alerts when their domain's aggregate authentication patterns deviate from established baseline, indicating active spoofing, infrastructure compromise, or lookalike domain activity.

**Requires:** 90+ days of history per domain to establish a statistically meaningful baseline. Anomaly detection without a baseline produces noise, not signal.

### What Gets Built

**Baseline Engine**

Computes a rolling statistical baseline per connected domain from historical aggregate report data:

- Normal DKIM pass rate (mean and standard deviation)
- Known sending IP ranges (set of authorized ranges)
- Known DKIM selectors (set of authorized selectors)
- Normal daily message volume range
- Normal distribution across reporting organizations (`org_name`)

Baseline is recomputed after each new aggregate report batch. Stored per domain. Never exposed publicly — only used internally for anomaly scoring.

**Anomaly Detection Engine**

Implements v0.2 §3.4 signals. Scores each incoming leaf against the domain's baseline:

```
Failure rate delta (TYPE 1):
  Current failure rate vs baseline mean.
  Alert threshold: > 3 standard deviations.

Unknown infrastructure (TYPE 2):
  DKIM failures from IP ranges outside authorized set.
  Alert threshold: any failure from unknown /24.

Unknown selector (TYPE 3):
  Selector not seen in prior 90 days.
  Suppressed during 30-day selector learning mode (§3.4.1).
  Informational only if new selector + 0% failures + known IPs.

Lookalike domain activity (TYPE 4):
  Scoped per v0.2 §3.4.2 — not all lookalikes are visible.
  Sources: connected lookalike domains with low trust;
  spoofing failures in connected domain telemetry;
  optional passive DNS monitoring (v0.3).
  Methodology: Levenshtein ≤ 2 on punycoded labels.
  Alerts MUST label their data source.
```

**Alert Delivery**

Email to the domain's registered contact address. Webhook for operators who prefer programmatic consumption. No mobile push in V2 — that is V3 scope.

Alert format is minimal and actionable:

```
Subject: PACT Signal — Anomaly detected for wise.com

Domain: wise.com
Detected: June 14, 2026 at 14:23 UTC
Type: Failure rate spike + Unknown sending infrastructure

Details:
  DKIM failure rate: 4.2% (baseline: 0.09%)
  Failures from: 185.234.47.0/24 (not in authorized ranges)
  Affected period: June 13, 2026 22:00–23:59 UTC

This pattern is consistent with an active BEC campaign
impersonating your domain from unauthorized infrastructure.

No message content was accessed in generating this alert.
This analysis is based on DMARC aggregate report metadata only.

[View details →]  [Mark as known / dismiss →]
```

### V2 Success Criteria

```
Month 5:  Baseline engine operational for all domains
          with 90+ days of history.
          Anomaly detection running on live report stream.

Month 6:  First real anomaly alert sent and confirmed
          by the domain operator as a genuine event
          (not a false positive).

Month 8:  Alert system demonstrated to Jean Guerrier
          or FinCEN-adjacent contact as a live example
          of the protocol detecting institutional
          domain attacks from aggregate data alone.
```

---

## V3 — PACT Proof (Months 8 Through 12)

**The objective:** a user can voluntarily submit a specific received email to PACT Proof and receive a Certificate of Provenance for that individual message and its attachments, corroborated by the sending domain's PACT Protocol trust score.

**Requires:** the protocol has established credibility. Multiple domains have trust scores that verifiers recognize. The Chain credential has been used in at least one real compliance or legal process. Users have a reason to trust PACT Proof with an individual email.

### What Gets Built

**Email Submission Interface**

A simple upload interface at `proof.pact.pbm-labs.com`. The user exports the email from their inbox as a .eml file (supported natively by Gmail, Outlook, and Apple Mail) and uploads it. Explicit consent prompt before upload: "You are sharing this email with PACT Proof to generate an authenticity certificate. The email content will be used only to validate the DKIM signature and will not be stored."

**DKIM Validation for Individual Messages**

Extracts the `DKIM-Signature` header from the uploaded .eml file. Retrieves the sending domain's public key from DNS. Validates the signature. Extracts the `bh=` field (the hash of the message body as computed by the sending server).

If validation passes: the message is authentic and unaltered since it left the sending server.
If validation fails: the message has been modified, the signature is invalid, or the key has rotated since the message was sent (in which case the user is instructed that the proof window has closed and they cannot generate a certificate for this message).

**Certificate of Provenance**

A PDF certificate containing:

- The sending domain and the validated DKIM selector
- The body hash (`bh=`) — proof of content integrity
- The timestamp of the DKIM signature
- The sending domain's activated PACT Protocol trust score (if available) and Chain history
- A statement that the DKIM signature was valid at the time of certificate generation
- A unique certificate ID and a public verification URL

The certificate is designed to support declarations under Federal Rules of Evidence 902(13) and 902(14). The attorney or compliance officer attaches it to their filing. No forensic specialist required for routine cases.

**No Storage of Email Content**

The uploaded .eml file is processed in memory. The body content is used only to verify the `bh=` hash. It is never written to disk, never logged, never transmitted beyond the processing function. Only the `bh=` hash, the DKIM signature metadata, and the certificate data are retained.

### V3 Success Criteria

```
Month 9:   PACT Proof live for beta users.
           First Certificate of Provenance generated
           for a real email from a connected domain.

Month 11:  First Certificate of Provenance attached
           to a real legal filing, compliance submission,
           or bank document verification process.

Month 12:  Certificate format reviewed by a US attorney
           familiar with FRE 902(13) and 902(14).
           Any required adjustments documented.
```

---

## Infrastructure Stack

```
LAYER              TECHNOLOGY          RATIONALE
────────────────────────────────────────────────────────
SMTP Receiver      Cloudflare Email    Zero server
(rua= intake)      Workers             management.
                                       Already used
                                       for CLUTCH.

Queue              Cloudflare Queues   Decouples email
                                       ingestion from
                                       processing.
                                       Handles retries.

Report Processing  Cloudflare Workers  Edge processing,
                   + Supabase          no cold start.
                                       Supabase handles
                                       atomic writes and
                                       concurrent Worker
                                       race conditions.

Database           Supabase            Postgres with
(mutable state:    (PostgreSQL)        row-level locking.
domain stats,                          Free tier sufficient
pending leaves,                        for MVP. All mutable
leaf index)                            state lives here.

Immutable Storage  Cloudflare R2       Append-only blobs.
(finalized leaves                      Used only after
after anchoring)                       on-chain publication.
                                       Never for mutable
                                       state.

Root publication   Supabase (0a)       Staging roots in merkle_roots
                   Base (0b)           Low gas cost. EVM compatible.
                                       Added in Phase 0b only.

Frontend           Next.js + Vercel    Fast deployment.
(public pages,                         Edge rendering
onboarding)                            for public pages.

DNS Integration    Cloudflare API      OAuth available.
                                       32% of DNS market.

Authentication     Magic link to       No password
(operator          domain admin email  management.
dashboard)                             Self-verifying
                                       domain ownership.
```

---

## Capital Requirement

```
Phase 0a (weeks 1-2)
  Development:    PBM Labs (founder time)
  Infrastructure: < USD 20/month
    Cloudflare Workers: free tier
    Supabase: free tier
    Base gas: none (chain deferred to 0b)
    Domain + SSL: already owned
  External:       Zero

MVP / Phase 0b (weeks 2-8)
  Development:    PBM Labs (founder time)
  Infrastructure: < USD 50/month
    Cloudflare Workers: free tier
    Supabase: free tier
    Base gas: < USD 10/month at daily root publication
    Domain + SSL: already owned
  External:       Zero

V1 (months 2-4)
  Infrastructure: < USD 100/month
  Legal review:   USD 500-1,500
    (PDF certificate language review
     by a US attorney — one time)
  External:       USD 500-1,500 total

V2 (months 4-8)
  Infrastructure: < USD 200/month
    (scales with connected domains)
  External:       Zero

V3 (months 8-12)
  Infrastructure: < USD 300/month
  Legal review:   USD 1,000-3,000
    (FRE 902(13)/902(14) certificate
     format review — one time)
  External:       USD 1,000-3,000 total

Total external capital required
through month 12: USD 1,500-4,500
```

The protocol is default alive from infrastructure cost perspective within existing PBM Labs runway. External capital, if any, accelerates legal review and potential partnership development — it is not required for the technical build.

---

## The First 30 Days in Order

```
DAY 1-3   [0a]
  Deploy SMTP receiver at rua@pact.pbm-labs.com
  Implement reporter allowlist and SPF validation (§3.1.1)
  Connect pbm-labs.com as the first domain
  Add rua@pact.pbm-labs.com to pbm-labs.com DMARC record

DAY 4-7   [0a]
  Build aggregate report parser (incl. org_name, date_range)
  Verify authenticated rua= reports from Gmail and other
  allowlisted reporters are received and parsed correctly

DAY 8-10  [0a]
  Build leaf aggregation and canonical encoding (Appendix C)
  Build 32-level Merkle tree with indexed proofs
  Implement staging root publication (merkle_roots table)

DAY 11-14 [0a] ← Phase 0a complete
  Build pact-score-0.2 trust computation
  Build public domain page with staging banner
  pact.pbm-labs.com/domain/pbm-labs.com goes live (staging root)
  Verify: leaf + index + proof against staging root

DAY 15-17 [0b]
  Deploy Base smart contract (v0.2 interface)
  Publish first on-chain root
  Confirm staging root hash == on-chain root for same leaf_count

DAY 18-21 [0b] ← MVP complete
  Remove staging banner; add Base explorer link to public page
  Merkle proofs verifiable via contract + explorer

DAY 22-30 [0b]
  Build Cloudflare OAuth onboarding (zone-scoped scope)
  Connect second domain (external, from network)
  Verify end-to-end: domain connects → authenticated reports
  arrive → leaves anchored on-chain → provisional score visible
```

---

## The Signal That MVP Is Working

Not a metric. Not an MRR number. One specific event:

A compliance officer, attorney, or bank employee visits `pact.pbm-labs.com/domain/{domain}`, reads the trust score and history of a domain they received a document from, verifies the on-chain root independently, and says — unprompted — "this is what I needed."

That conversation is the signal. It requires **Phase 0b** — staging alone is not sufficient for external trust conversations. Everything before 0b is internal validation. Everything after it is scale.

---

*PBM Labs LLC — Internal document*
*PACT Protocol MVP Strategy & Roadmap v1.2*
*Aligned with Protocol Specification v0.2 — June 2026*
*Phase 0a (staging) + Phase 0b (Base) build sequence*
