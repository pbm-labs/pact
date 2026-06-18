# FluidRWA × PACT Partnership Strategy

**PBM Labs LLC — Internal**  
**Date:** June 2026  
**Status:** Opportunity under evaluation  
**Contacts:** Shefali Sharma (Co-founder, FluidRWA) · Pablo Buitrago (PBM Labs)

---

## Executive Summary

**Verdict: Pursue — phased, narrow integration first.**

FluidRWA and PACT solve adjacent parts of the same problem: *who can you trust in a market where credentials, case studies, and references are trivially fakeable?*

FluidRWA's moat is **curation at scale** (250+ manually vetted vendors, verified badges, reviews launching). Pablo correctly identified that manual vetting does not scale against AI-generated proof artifacts. PACT does not replace FluidRWA's human judgment on category fit, regulatory status, or product quality — but it can **automate the one check that cannot be faked with a PDF**: whether a vendor's corporate domain has a real, independently witnessed history of authenticated institutional email activity.

This is a **distribution partnership**, not a product merger. FluidRWA gets a defensible trust signal competitors cannot copy without PACT. PACT gets institutional Web3 buyer traffic, vendor onboarding volume, and a concrete use case beyond FinCEN/banking narratives.

**Do not over-promise.** PACT verifies **domain operational history**, not client relationships, tokenization volume claims, or license status. Position accordingly.

---

## Opportunity Assessment

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Problem alignment | **High** | FluidRWA's "trust is the product" = PACT's thesis |
| Technical fit | **Medium-High** | Strong for vendor domain legitimacy; weak for client-reference verification |
| Timing | **Medium** | PACT MVP not live yet; partnership is forward-committed |
| Distribution value | **High** | 250+ vendors + institutional buyer funnel |
| Integration cost | **Low** | Public domain page + API + profile badge |
| Revenue near-term | **Low** | MVP phase = credibility and volume, not ARR |
| Strategic risk | **Low-Medium** | Mispositioning PACT as "client reference verifier" would damage both brands |

**Overall: 7.5/10 today (Protocol only) → 8.5/10 at full stack (Chain + Signal).** Worth a structured exploration call and pilot now; platform partnership pitch strengthens as layers ship.

**Dependency note:** FluidRWA does not need PACT to operate. Full stack increases *want* and defensibility, not existential dependency. See [MVP vs Full Stack](#mvp-vs-full-stack--partnership-value-by-layer).

---

## What FluidRWA Actually Is

From [fluidrwa.com](https://www.fluidrwa.com) and the vendor ecosystem page:

- **Product:** Searchable directory of 257+ Web3 / digital-asset infrastructure vendors across tokenization, KYC/AML, custody, payments, legal, audits, etc.
- **Buyer side:** Institutions, enterprises, funds, and startups submit project briefs for vendor matchmaking.
- **Vendor side:** "Apply as Vendor" — reviewed, not auto-listed; verified badge earned through credential/track record review (per Shefali).
- **Differentiator claimed:** Vetting + trust, not a raw phonebook. Reviews launching next month.
- **Founder profile:** 7+ years Web3, 25+ years branding/growth, ecosystem reach.

**What the public site does not show:** The actual vetting checklist, documents reviewed, or verification SLA. Pablo's question ("what documents or proofs do you currently review?") is the right gating question before designing integration.

**Terminology note:** Pablo's correction on RWA semantics was fair — the directory spans broader Web3 infrastructure, not only real-world asset tokenization in the strict sense. Do not fight this on the call; align on "vendor trust infrastructure."

---

## What PACT Can and Cannot Verify for FluidRWA

### PACT verifies (automated, un-fakeable)

| Check | Mechanism |
|-------|-----------|
| Domain is not a fly-by-night registration | Maturity factor `A(d,t)` — ~139 days to activated status |
| Domain sends real authenticated email at scale | DKIM-pass volume from allowlisted reporters |
| Infrastructure is consistent over time | Selector/IP baselines, Merkle-anchored history |
| Domain is not a lookalike impersonator | Low score vs. similar established domain (Signal, v0.3) |
| History cannot be backdated | Append-only Merkle tree + on-chain roots |

### PACT does not verify (FluidRWA must keep manual or other sources)

| Check | Why PACT doesn't cover it |
|-------|---------------------------|
| "$5B+ tokenized" marketing claims | Self-declared; not in DMARC reports |
| SEC registration / license status | Regulatory databases, not email metadata |
| Client logos and case studies | Would require message-level proof (PACT Proof + consent) or direct client confirmation |
| Smart contract audit quality | Technical review, not domain provenance |
| Team identity / LinkedIn profiles | Identity verification vendors (FluidRWA already lists many) |
| Product actually works | Demos, references, technical diligence |

### The honest positioning line

> **FluidRWA vets whether a vendor is the right fit. PACT proves the vendor's domain is a real operational institution — not a website spun up last week with AI-generated credentials.**

---

## MVP vs Full Stack — Partnership Value by Layer

FluidRWA can operate without PACT today. The partnership **improves materially** as PACT layers ship — but no single layer makes FluidRWA dependent on PACT for survival.

### Partnership strength by PACT maturity

| PACT stage | What's live | FluidRWA gets | Partnership score | FluidRWA needs it? |
|------------|-------------|---------------|-------------------|-------------------|
| **MVP** (weeks 1–8) | Protocol + public domain page | Automated domain-legitimacy lookup during vetting | **6/10** | No — useful enhancement |
| **+ V1 Chain** (months 2–4) | Portable provenance credential | Vendors submit verifiable PDF/JSON; buyers audit without trusting PBM Labs | **7.5/10** | No — strong institutional story |
| **+ V2 Signal** (months 4–8) | Ongoing anomaly monitoring | Listed vendors monitored post-approval; spoofing/compromise alerts | **8.5/10** | No — hard to replicate in-house |
| **+ V3 Proof** (months 8–12) | Per-email authenticity (user consent) | Dispute resolution / premium tier: prove one real client email | **9/10** (niche) | No — edge cases only |

**Chain + Signal together** are the inflection point. That combination moves FluidRWA from "directory with a trust lookup" to **"vetted, credentialed, and monitored vendors"** — a story reviews and manual vetting alone cannot match.

Proof adds value for premium disputes ("prove this case study email is real") but does not scale across 250+ vendor listings.

### Layer-by-layer: what changes for FluidRWA

| Layer | Without it | With it | FluidRWA impact |
|-------|------------|---------|-----------------|
| **Protocol** (L1) | Manual domain checks (WHOIS, website age, gut feel) | Trust score, maturity factor, Merkle proof on public page | **Core** — automates first-pass legitimacy |
| **PACT Chain** (L2) | Reviewer visits public page; no portable artifact | Vendor attaches credential to application; buyer verifies independently | **High** — institutional onboarding, audit trail |
| **PACT Signal** (L2) | Trust frozen at approval date | Alerts if listed vendor domain is spoofed, compromised, or infra-anomalous | **High** — "trust doesn't expire at listing" |
| **PACT Proof** (L2) | Cannot verify case studies or client refs | Voluntary .eml upload proves one message authentic | **Medium** — premium tier / disputes only |

### FluidRWA pitch by what's shipping

**Start the conversation now (MVP):**

> "We can already strengthen your vetting on domain legitimacy — one automated check that PDFs can't fake. No vendor action required for shadow-mode lookups."

**Endgame pitch (Chain + Signal live):**

> "FluidRWA vendors are vetted by your team, credentialed with portable provenance proofs, and monitored continuously for impersonation and infrastructure attacks. Buyers verify without trusting either of us."

**Do not wait for full stack to engage.** Phase 0–1 runs on Protocol alone. Expand integration as each layer ships per roadmap below.

### Dependency asymmetry (negotiation reality)

| Party | Without the other |
|-------|-------------------|
| **FluidRWA without PACT** | Keeps operating; trust story harder to defend at scale; reviews remain gameable |
| **PACT without FluidRWA** | Slower distribution; one fewer reference customer in Web3 vendor trust |
| **FluidRWA without full PACT stack** | Still fine near-term; misses ongoing monitoring and portable credentials |
| **PACT without FluidRWA** | Still builds protocol; FluidRWA is strategic, not sole channel |

**PACT needs FluidRWA more than FluidRWA needs PACT** — for distribution, connected domains, and a concrete trust use case. Full stack reverses the *value exchange* (FluidRWA gets much more) but not the *survival dependency*.

### What full stack does NOT change

Even with all layers live, PACT still does not verify:

- Self-declared metrics ("$5B tokenized")
- License / regulatory status
- Product quality or smart contract audit results
- Bilateral client relationships at scale (Proof is per-message, consent-based)

FluidRWA manual vetting remains essential. Full stack **narrows** what humans must do, not eliminates it.

### Layer-to-integration tier mapping

| PACT layer | Integration tier (see below) | PACT roadmap timing |
|------------|------------------------------|---------------------|
| Protocol | Tier 0 (passive lookup) + Tier 1 (opt-in badge) | MVP weeks 1–8 |
| PACT Chain | Tier 2 (credential in vendor application) | V1 months 2–4 |
| PACT Signal | Tier 2b (ongoing monitoring for listed vendors) | V2 months 4–8 |
| PACT Proof | Tier 4 (optional — premium dispute resolution) | V3 months 8–12 |
| Protocol + buyer UX | Tier 3 (buyer-side verification inline) | Months 6+ |

### Tier 2b — Ongoing vendor monitoring (V2 Signal)

Not in original tier list; added for full-stack partnership:

- FluidRWA subscribes to Signal alerts for all PACT-connected listed vendors
- If `wise-vendor.com` (listed) shows failure spike or unknown infra → FluidRWA ops notified
- Action: flag listing, request re-verification, or suspend pending review
- **Buyer-facing copy:** "Monitored by PACT Signal" badge on active listings

**Effort:** Webhook integration + FluidRWA ops playbook. Ships with PACT V2.

### Tier 4 — Proof for disputes (V3, optional)

- Triggered when buyer or FluidRWA disputes a case study / reference claim
- Vendor or client voluntarily uploads .eml; PACT Proof generates certificate
- **Not** part of standard onboarding — too much friction for 250+ vendors

---

## Integration Model

### Tier 0 — Passive lookup (MVP, zero vendor friction)

FluidRWA ops queries `pact.pbm-labs.com/domain/{vendor-domain}` during manual vetting.

- **Input:** Domain from vendor application (e.g., `securitize.com`)
- **Output:** Provisional or activated trust score, history depth, Merkle proof link
- **FluidRWA action:** Factor into vetting decision; no vendor action required
- **Badge:** None displayed until vendor opts in (avoid showing "unverified" as stigma before launch)

**Effort:** 1 API integration or manual lookup. Ships when PACT public page is live.

### Tier 1 — Vendor opt-in badge (Months 2–4)

Vendor adds `rua@pact.pbm-labs.com` to DMARC during FluidRWA onboarding (or post-approval).

- **Badge on listing:** `PACT Domain Verified` with score status (Provisional / Activated)
- **Display:** Score, history depth, unique reporting orgs, link to public proof
- **FluidRWA filter:** "Show only PACT-connected vendors" (optional directory filter)
- **Co-marketing:** "FluidRWA Vetted + PACT Verified" dual badge

**Effort:** FluidRWA adds DNS instruction step to vendor onboarding; PACT provides embed/widget.

### Tier 2 — PACT Chain in vendor application (V1, Months 3–5)

Vendors submit a PACT Chain credential with their FluidRWA application package.

- **Activated score required** for premium "Institutional Trust" tier on FluidRWA
- **PDF + JSON** credential attached to vendor profile (auditor-readable)
- **FluidRWA reviewer** verifies credential via `pact.pbm-labs.com/verify/{id}` without trusting PBM Labs

**Effort:** Chain credential generator (PACT V1 roadmap item).

### Tier 3 — Buyer-side verification (Months 6+)

When a buyer evaluates a matched vendor, FluidRWA surfaces PACT provenance inline.

- Buyer question: "Is this vendor's domain legitimate?"
- Answer: Public provenance record, not vendor-supplied PDF

**Effort:** Profile UI + buyer education content.

### Tier 2b — Ongoing vendor monitoring (V2 Signal, months 4–8)

FluidRWA receives Signal webhooks for all PACT-connected listed vendors.

- **Trigger:** Failure spike, unknown infrastructure, suspicious selector on a live listing
- **FluidRWA action:** Flag listing, request re-verification, or suspend pending ops review
- **Buyer-facing:** "Monitored by PACT Signal" badge on active vendor profiles

**Effort:** Webhook endpoint + ops playbook. Requires PACT V2.

### Tier 4 — Proof for disputes (V3, optional, months 8–12)

Triggered when a case study, reference, or client claim is disputed — not standard onboarding.

- Vendor or client uploads .eml with explicit consent
- PACT Proof generates certificate; FluidRWA factors into listing decision
- **Scope:** Premium tier or dispute resolution only — does not scale to 250+ vendors

**Effort:** Proof upload UI + FluidRWA dispute workflow.

---

## What NOT to build

- **"PACT verifies client references"** — unless PACT Proof is invoked with explicit client consent per message. Do not imply bilateral relationship verification.
- **Auto-reject vendors without PACT** — most legitimate vendors won't have connected yet; use PACT as uplift, not gate, until density is high.
- **Replace FluidRWA reviews with PACT scores** — reviews capture product quality; PACT captures domain legitimacy. Complementary.
- **White-label PACT as FluidRWA technology** — PACT is open protocol; co-brand, don't absorb.

---

## Commercial Model Options

| Phase | Model | Rationale |
|-------|-------|-----------|
| **Pilot (0–6 mo)** | Free API + badge | PACT needs distribution and real domains; FluidRWA needs differentiation |
| **Growth (6–12 mo)** | Vendors pay for PACT Chain generation; FluidRWA rev-share or referral fee | Aligns incentive: vendors want premium badge |
| **Mature** | FluidRWA "Trust Plus" tier for buyers — includes PACT lookup on shortlisted vendors | Buyer-side monetization without taxing directory listing |

**Near-term revenue expectation: $0.** Value is proof points, domain connections, and case study ("FluidRWA uses PACT to verify 250+ vendors").

---

## Phased Roadmap

```
PHASE 0 — Discovery (now)
  Pablo receives FluidRWA vetting flow documentation
  30-min call: map PACT signals to their checklist
  Mutual NDA only if sharing proprietary vetting rubric

PHASE 1 — Shadow mode (PACT MVP live, weeks 8–12)
  FluidRWA ops uses PACT public page on 10–20 new applications
  Compare PACT signal vs. manual vetting outcome
  Document: false positive / false negative rate

PHASE 2 — Pilot badge (months 2–4)
  5–10 willing vendors connect domain via PACT during FluidRWA onboarding
  "PACT Domain Verified" badge on profiles
  Joint blog post / LinkedIn case study

PHASE 3 — Scale (months 4–8)
  API integration in vendor application flow
  Optional filter for buyers
  PACT Chain for premium vendor tier
  PACT Signal webhook for listed vendor monitoring (Tier 2b)

PHASE 3b — Full stack (months 8–12)
  Tier 4 Proof available for dispute resolution
  Joint positioning: "vetted, credentialed, monitored"
  Evaluate FluidRWA "Trust Plus" buyer tier

PHASE 4 — Evaluate exclusivity (month 6+)
  Only if pilot metrics justify it:
    - % vendors connecting PACT voluntarily
    - Buyer engagement with trust signals
    - Reduction in manual vetting time per vendor
  Default: non-exclusive protocol partnership
```

---

## Metrics That Prove the Partnership Works

| Metric | Target (6 months) |
|--------|-------------------|
| Vendors with PACT-connected domain | 25+ (10% of base) |
| New vendor applications using PACT lookup | 50%+ of intake |
| Manual vetting time per vendor | 20%+ reduction on domain-legitimacy checks |
| Buyer clicks on PACT proof from vendor profile | Track; no target yet |
| Scam/low-quality vendor caught by PACT before manual review | ≥1 documented case study |
| FluidRWA referral traffic to pact.pbm-labs.com | 500+ visits/month |

### Full-stack targets (12 months, Chain + Signal live)

| Metric | Target |
|--------|--------|
| Listed vendors with PACT Chain credential | 15+ premium tier |
| Signal alerts acted on by FluidRWA ops | ≥3 documented workflows |
| Buyer-facing "Monitored by PACT Signal" listings | 25+ |
| Documented post-listing compromise caught by Signal | ≥1 case study |

---

## Conversation Playbook — Next Message to Shefali

**Goal:** Get vetting flow documentation; schedule call; set expectations.

Suggested reply (adapt before sending):

---

Thanks Shefali — a partnership makes sense if we scope it precisely.

PACT doesn't review PDFs or case studies. It verifies something harder to fake: whether a vendor's corporate domain has a real, independently witnessed history of authenticated email — the operational footprint behind the marketing.

For FluidRWA, the practical integration is a **PACT Domain Verified** badge on vendor profiles, powered by a public provenance record any buyer can check. That complements your manual vetting; it doesn't replace license checks or product diligence.

Before a call, could you share:
1. Your current vendor vetting checklist (what documents/proofs you review)
2. What % of applications fail at domain/company legitimacy vs. product fit
3. Whether vendors submit a corporate domain you could check programmatically

I'll map each step to what PACT automates vs. what stays human. If there's overlap, we can design a pilot with 5–10 vendors once our public verification page is live in the next few weeks.

**Roadmap note (share if she asks "what's the full vision"):** We start with domain provenance lookups now. Over the next year we add portable credentials (PACT Chain), continuous monitoring for listed vendors (PACT Signal), and optional per-email proof for disputes (PACT Proof). You don't need to wait for all of that to start — but that's the endgame for bulletproof vetting at scale.

---

## Risks and Guardrails

| Risk | Mitigation |
|------|------------|
| PACT MVP not ready | Honest timeline; start with shadow-mode lookups |
| Vendor DMARC not configured | Provide onboarding guide; PACT connect is one DNS field |
| FluidRWA expects client-reference verification | Clear capability matrix before call |
| "Verified" badge confusion (FluidRWA vs. PACT) | Distinct badges: "FluidRWA Vetted" + "PACT Domain Verified" |
| Low-tier scammers pass with new domain + good deck | PACT catches zero-history domains; combine with FluidRWA manual review |
| Established vendor fails PACT (no DMARC) | PACT as optional uplift, not hard gate in Phase 1–2 |
| Witnessed.cc confusion | Witnessed = showcase; FluidRWA integration uses PACT Protocol directly |

---

## Competitive Angle for FluidRWA

Why Shefali should care beyond politeness:

1. **Reviews launching next month are fakeable.** Star ratings and text reviews can be AI-generated or astroturfed. Domain provenance cannot.
2. **Clutch, G2, LinkedIn recommendations** — same vulnerability Pablo named. FluidRWA + PACT = first vendor directory with cryptographic domain legitimacy layer.
3. **Institutional buyers** (FluidRWA's stated audience) will increasingly ask "how do you know this vendor exists?" post-FinCEN Alert004. PACT is a defensible answer.
4. **Manual vetting of 250+ does not scale to 2,500+.** PACT automates the first pass on domain legitimacy so humans focus on regulatory and product fit.

---

## Internal Prerequisites Before Committing

- [ ] PACT public domain page live (`pact.pbm-labs.com/domain/{domain}`)
- [ ] At least 5 external connected domains for demo credibility
- [ ] One-page "FluidRWA Integration" explainer PDF for Shefali to share with co-founder
- [ ] API or stable public page URL pattern documented
- [ ] Legal: partnership term sheet template (non-exclusive, no IP assignment)

---

## Decision

| Action | Owner | When |
|--------|-------|------|
| Send vetting-flow request message | Pablo | This week |
| Discovery call (30 min) | Pablo + Shefali | After she shares flow |
| Shadow-mode evaluation on 10 applications | Pablo | Post-MVP week 8 |
| Pilot MOU (non-exclusive, 5 vendors) | Both | Month 2 |
| Joint announcement | Both | After 5 connected vendor profiles live |

**Bottom line:** FluidRWA is one of the better distribution partners PACT could have at this stage — they already sell trust, they feel the AI-fake pain, and they have inventory (250+ vendors). Start narrow (Protocol lookup + badge). **Full stack (Chain + Signal) is the platform partnership endgame** — credentialed, monitored vendors that reviews and PDFs cannot replicate. FluidRWA never *needs* PACT to survive; they *want* full stack if they're serious about trust at scale. PACT needs FluidRWA more than the reverse for distribution and proof points.

---

*PBM Labs LLC — Confidential*
