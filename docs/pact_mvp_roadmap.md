# PACT Protocol — MVP Strategy & Roadmap
**PBM Labs LLC**
**June 2026 — Internal Working Document**

> **Companion document:** `pact_movement_strategy.md` specifies the adoption mechanism — narrative, signature-line distribution, and the public ordinal counter — that should be built in parallel with the phases below, starting at MVP launch. See that document before implementing the public-facing site described in this roadmap.

---

## Implementation status (June 2026)

Reference deployment: `pact.pbm-labs.com` on Cloudflare Workers. Normative spec: [pact_protocol_v01.md](pact_protocol_v01.md) (trust score `pact-score-0.1`). Merkle/encoding details: [pact_protocol_v02.md](pact_protocol_v02.md) (historical).

| Item | Status |
|------|--------|
| SMTP intake `rua@pact.pbm-labs.com` | Live |
| Parser, dedup, leaves, staging Merkle roots | Live |
| Public domain page + Merkle inclusion proofs | Live |
| Homepage narrative (`pact_site_narrative.md`) | Live |
| Connect: Cloudflare OAuth + manual DNS | Live |
| Disconnect: Cloudflare OAuth + manual DNS | Live |
| Real reports for `pbm-labs.com` | Live (Google, Microsoft) |
| On-chain Base anchoring (Phase 0b) | Not started |
| Movement counter + ordinal # + signature line | Not started |
| DMARC service forwarding onboarding | Deferred |
| Route 53 / AWS DNS automation | Deferred |

**Phase 0a** is staging (off-chain roots). **MVP complete** per this roadmap still requires Phase 0b on-chain anchoring.

---

## The Single Governing Principle

The MVP does not build a product. It proves the protocol works with real data from a real domain, visible to anyone on the internet. Everything else follows from that proof.

No domain connected means no trust score. No trust score means no Chain credential. No Chain credential means no Signal baseline. No baseline means no Proof context. The four layers of the ecosystem are sequentially dependent. The only way to unlock them is to make the protocol real first.

The MVP is complete when `pact.pbm-labs.com/domain/pbm-labs.com` shows a live trust score backed by real DMARC aggregate reports anchored in a real Merkle tree on a real blockchain. That page is the product. Everything before it is infrastructure. Everything after it is growth.

---

## Why Cloudflare First

Cloudflare manages DNS for approximately 32% of all internet domains. More importantly, it is where technically competent domain operators already manage their email authentication infrastructure. A domain operator who has configured DKIM and DMARC is, by definition, the right early adopter for PACT Protocol — they already understand email authentication and have already solved the setup friction once.

Cloudflare also provides three specific advantages for the MVP:

First, its API allows reading and writing DNS TXT records programmatically via OAuth. Adding `rua@pact.pbm-labs.com` to an existing `_dmarc` record is a single API call after the user authorizes access. No manual DNS editing required.

Second, Cloudflare's Email Security product already has a DMARC management interface. Users in that context are already thinking about aggregate reporting. PACT appears as the next logical step, not as something foreign.

Third, Cloudflare Workers is the natural deployment environment for PACT's edge processing infrastructure — the same platform used for CLUTCH. The team already knows it.

The MVP connects PBM Labs' own domain via Cloudflare as the first proof. Then opens onboarding for external domains via the same OAuth flow.

**Everyone else** uses **manual DNS** on `/connect` — copy the `_dmarc` snippet, paste at any provider (GoDaddy, Namecheap, Route 53 console, etc.), register. Zero additional integrations for MVP.

---

## MVP — Weeks 1 Through 8

**The objective:** one domain connected, one trust score live, one public page verifiable by anyone.

### What Gets Built

**SMTP Receiver for rua= Reports**

A purpose-built SMTP receiver at `rua@pact.pbm-labs.com` that accepts incoming DMARC aggregate reports. Built on Cloudflare Email Workers or a minimal VPS with Postfix. Receives the XML report, validates the sender is a legitimate mail server, extracts the authentication records, and passes them to the processing pipeline. The raw report is discarded after extraction.

This is the only external-facing component that receives data. Everything else is internal processing or public read.

**Aggregate Report Parser**

Parses the DMARC aggregate report XML schema (RFC 7489). Extracts per-domain records: sending domain, DKIM result (pass/fail), message count, sending IP range, DKIM selector, reporting period start and end.

Produces a normalized struct per record. No message content. No recipient identity. No personal data.

**Leaf Construction and Merkle Tree**

Constructs a keccak256 leaf from each processed aggregate record:

```
leaf = keccak256(
  domain_hash,
  period_start,
  period_end,
  dkim_pass_count,
  dkim_fail_count,
  selector_hash,
  source_ip_hash,
  report_hash
)
```

Inserts the leaf into an append-only Merkle tree. The tree and all domain statistics are stored in Supabase (PostgreSQL) with atomic transactions via a stored procedure. This prevents race conditions between concurrent Workers processing reports simultaneously. R2 is used only for immutable, append-only storage of finalized leaf data after on-chain anchoring.

**On-Chain Root Publication**

Publishes the Merkle root to Base (Ethereum L2) at regular intervals — daily in the MVP, aligned with the natural 24-hour cadence of aggregate reports. Uses a minimal Solidity contract with a single `publishRoot(bytes32 root, uint256 timestamp, uint256 leafCount)` function. Gas cost on Base is negligible.

The contract is deployed once and is immutable. No upgrade mechanism.

**Domain Stats Index**

Maintains a simple off-chain index of per-domain statistics derived from processed leaves:

```
domain_stats {
  domain: string
  total_pass_count: integer
  total_fail_count: integer
  unique_selector_count: integer
  unique_ip_range_count: integer
  first_report_time: timestamp
  last_report_time: timestamp
  trust_score: float  // computed, not stored
}
```

Trust score is computed on read, not stored. This ensures the score always reflects the current state of the Merkle tree.

**Public Domain Page**

`pact.pbm-labs.com/domain/{domain}` — a public, no-authentication page that shows:

```
PACT Protocol — Domain Provenance Record

Domain:          wise.com
Connected since: March 14, 2026
Trust score:     7.4 / 10

Authentication history
  Total verified messages:    2,847,291
  DKIM pass rate:             99.94%
  Active since:               847 days
  Unique receiving servers:   312

Infrastructure
  Known DKIM selectors:       google-2024, ses-2024
  Known sending IP ranges:    4 verified ranges

Anomalies detected:           None

Merkle proof
  Latest on-chain root:       0x4a7f...c291
  Block:                      Base #18,472,981
  Timestamp:                  June 14, 2026 00:00 UTC
  [Download Merkle proof →]

Verification
  Anyone can verify this record independently
  using only the on-chain root and the proof above.
  No contact with PBM Labs required.
  [How to verify independently →]
```

No login. No paywall. Fully public. This page is what the bank, the compliance officer, the attorney, or the counterparty visits when they receive a document from a domain connected to PACT.

**Cloudflare OAuth Onboarding**

`pact.pbm-labs.com/connect` — two paths, zero provider sprawl for MVP:

Step 1: Enter your domain.
Step 2: **Cloudflare OAuth** — authorize DNS edit; PACT adds `rua@pact.pbm-labs.com` to `_dmarc` via API. One confirmation click.
Step 2 (alternate): **Manual DNS** — copy the `_dmarc` snippet, update DNS at any provider, click **Register domain**.
Step 3: First aggregate reports arrive within 24 hours. Trust score visible within 48 hours.

**Disconnect** — `pact.pbm-labs.com/disconnect` mirrors both paths. Cloudflare removes PACT from `_dmarc` and unregisters the domain; manual path unregisters after the operator edits DNS. Historical provenance already ingested remains public.

### What Does Not Get Built in the MVP

- Route 53 / AWS IAM DNS automation (manual DNS covers Route 53 users)
- DMARC service forwarding integrations (Postmark, Valimail, EasyDMARC)
- PACT Chain credential generation
- PACT Signal anomaly detection and alerting
- PACT Proof document verification
- Mobile application
- Payments or subscription management
- Email notifications of any kind
- Dashboard for connected domain operators
- API documentation for external developers
- Any ZK proof circuit

These are not deferred because they are unimportant. They are deferred because building them before the protocol has real data is building on sand.

### MVP Success Criteria

```
Week 2:  pbm-labs.com connected and receiving rua= reports.
         First leaf anchored on Base.
         Public page live at pact.pbm-labs.com/domain/pbm-labs.com.

Week 4:  First external domain connected via Cloudflare OAuth.
         Trust score computed from real aggregate report data.
         Merkle proof independently verifiable on-chain.

Week 8:  Five external domains connected.
         Public pages live for each.
         At least one domain with 30+ days of history
         showing meaningful trust score differentiation
         from a new domain with zero history.
         Jean Guerrier or equivalent contact shown
         the live system.
```

---

## V1 — PACT Chain (Months 2 Through 4)

**The objective:** a domain operator can generate a portable, auditable Chain credential from their PACT history and submit it to a bank, compliance body, or counterparty as proof of institutional legitimacy.

**Requires:** 60+ days of history for at least one connected domain. The Chain credential needs enough depth to be credible. A 3-day history proves the system works. A 90-day history proves the domain is legitimate.

### What Gets Built

**Chain Credential Generator**

Takes a connected domain's full Merkle history and produces a structured credential containing:

- Domain identity and connection date
- Trust score with component breakdown (volume, diversity, maturity)
- Summary of authentication history (message counts, pass rates, periods covered)
- Merkle inclusion proofs for a representative sample of anchored leaves
- The sequence of on-chain roots that cover the full history period
- A verification URL that any party can use to independently confirm the credential

Output formats: PDF for human consumption, JSON for machine verification.

The PDF is designed to be attached to a bank account opening request, a vendor onboarding submission, or a regulatory filing. It is not a marketing document. It reads like an auditor's report.

**Independent Verification Path**

`pact.pbm-labs.com/verify/{credential-id}` — a public page that takes a Chain credential and confirms its validity against the on-chain roots. No PBM Labs trust required — the page shows the verification math and links to the relevant Base block explorer entries.

This page must work even if PBM Labs ceases to operate. The on-chain roots are permanent. The Merkle proofs are self-contained. The verification logic is published as open source.

**Operator Dashboard (minimal)**

A simple authenticated view for connected domain operators showing their domain's current trust score, history, and a button to generate a Chain credential. Authentication via magic link to the domain's admin email address — no password, no OAuth.

### V1 Success Criteria

```
Month 3:  First Chain credential generated for an
          external domain with 60+ days of history.

Month 4:  First Chain credential submitted by a domain
          operator to a real bank, compliance body,
          or counterparty as part of an actual process.
          Outcome documented (accepted, questioned,
          or rejected — all outcomes are useful data).
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
- Normal distribution across receiving mail server domains

Baseline is recomputed after each new aggregate report batch. Stored per domain. Never exposed publicly — only used internally for anomaly scoring.

**Anomaly Detection Engine**

Scores each incoming aggregate report against the domain's baseline across four dimensions:

```
Failure rate delta:
  Current failure rate vs baseline mean.
  Alert threshold: > 3 standard deviations.

Unknown infrastructure:
  Sending IPs outside the known authorized range.
  Alert threshold: any failure from unknown IP.

Unknown selector:
  DKIM selector not seen in prior 90 days.
  Alert threshold: any occurrence.

Lookalike domain activity:
  Domains visually similar to connected domains
  appearing in aggregate reports from the same
  receiving mail servers.
  Detection: Levenshtein distance ≤ 2 from
  any connected domain name.
  Alert threshold: any occurrence.
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
- The sending domain's current PACT Protocol trust score and Chain history
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

On-chain           Base (Ethereum L2)  Low gas cost.
(root publication)                     EVM compatible.
                                       Mature ecosystem.

Frontend           Next.js on          Same platform as
(public pages,     Cloudflare Workers  ingest; OpenNext
onboarding)                            deploy to pact.pbm-labs.com

DNS Integration    Cloudflare OAuth    Lowest friction (~32%
                                       of DNS market).
                   Manual DNS          Everyone else.

Authentication     Magic link to       No password
(operator          domain admin email  management.
dashboard)                             Self-verifying
                                       domain ownership.
```

---

## Capital Requirement

```
MVP (weeks 1-8)
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
DAY 1-3
  Deploy SMTP receiver at rua@pact.pbm-labs.com
  Connect pbm-labs.com as the first domain
  Add rua@pact.pbm-labs.com to pbm-labs.com DMARC record

DAY 4-7
  Build aggregate report parser
  Verify first real rua= reports are being received
  and parsed correctly from Gmail and other providers
  sending to pbm-labs.com

DAY 8-14
  Build leaf construction and Merkle tree
  Deploy Base smart contract
  Publish first on-chain root

DAY 15-21
  Build trust score computation
  Build public domain page
  pact.pbm-labs.com/domain/pbm-labs.com goes live

DAY 22-30
  Build Cloudflare OAuth onboarding flow
  Connect second domain (external, from network)
  Verify end-to-end: domain connects →
  rua= reports arrive → leaves anchored →
  trust score visible → Merkle proof downloadable
  → on-chain root verifiable on Base explorer
```

---

## The Signal That MVP Is Working

Not a metric. Not an MRR number. One specific event:

A compliance officer, attorney, or bank employee visits `pact.pbm-labs.com/domain/{domain}`, reads the trust score and history of a domain they received a document from, and says — unprompted — "this is what I needed."

That conversation is the signal. Everything before it is setup. Everything after it is scale.

---

*PBM Labs LLC — Internal document*
*PACT Protocol MVP Strategy & Roadmap v1.0*
*June 2026*
