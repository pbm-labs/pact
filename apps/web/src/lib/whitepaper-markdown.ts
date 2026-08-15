export const LOCAL_WHITEOBER_MARKDOWN = `
# PACT Protocol
## Provenance Attestation and Chain of Trust

**Version 1.8 — August 2026**  
**hello@pbm-labs.com**

---

## Abstract

The internet was built without a durable way to tell who is real. Names on screens can be fabricated in minutes. History cannot.

Every domain that sends mail already participates in a quiet, global verification loop: outbound messages are cryptographically signed; receiving mail systems check those signatures and emit structured aggregate reports. Those reports have been produced continuously since 2011. They contain no message content and no personal identities — only whether a domain showed up honestly, how often, and through which infrastructure.

PACT is an open protocol that captures those reports, commits them to an append-only Merkle tree anyone can recompute, and derives an organic trust signal from verified history. Domains join by pointing an existing DNS field at PACT. Nothing about how they send mail changes. No message is ever read.

The public record leads with verified history — days independently confirmed — because early scores are still forming. A scaled trust score appears as a technical verification detail once that history is meaningful. Merkle roots are published to a public blockchain so a verifier does not have to trust the operator's database for inclusion. Leaves stay off-chain: the chain attests inclusion, not availability.

---

## 1. The Problem

### 1.1 A Foundation Missing in Plain Sight

The internet grew into a civilization of strangers without a shared way to tell who is real. We got used to it. Almost everything that looks like proof on a screen can now be manufactured cheaply: aged domains, polished profiles, perfect paperwork, synthetic documents.

What cannot be manufactured is yesterday. Real history only accumulates while independent parties are watching. That is the gap PACT exists to close — not as an alarm, and not as another authority's claim, but as a public record of what actually happened.

### 1.2 The Hidden Audit Trail

Since 2011, institutional senders have been signing outbound mail with DKIM (DomainKeys Identified Mail, RFC 6376). Receiving mail systems validate those signatures and already generate DMARC aggregate reports for domain owners — typically daily.

Those reports include the sending domain, validation results, sending infrastructure identifiers, message counts, and the reporting period. They do not include message bodies, subjects, recipients, or any personal identity.

They are produced today for every domain that publishes a DMARC record. They have never been systematically captured into a public, independently verifiable provenance layer.

PACT captures them.

---

## 2. The Protocol

### 2.1 Connecting a Domain

A domain joins PACT by adding PACT as a report destination in DNS — one field, usually on an existing DMARC record. No software to install. No API to integrate. No change to how mail is sent or received.

Paths that work today:

- **Cloudflare** — OAuth connection; PACT updates the DNS record after the operator confirms the zone.
- **Manual** — paste one DNS line wherever the domain's DNS is managed.
- **Existing email-security tools** — point an additional report destination at PACT.

Manual and tool-based paths do not require returning to the site to "confirm" the domain. The domain appears in the public record automatically when the first valid aggregate report arrives. That keeps friction low and ensures domains enter the ledger only after real independent verification.

### 2.2 From Report to Proof

When a report arrives, the wrapper RFC822 is DKIM-verified. Authentication metadata is extracted and committed as a leaf in an append-only Merkle tree. The leaf also commits the wrapper witness: keccak256 of the RFC822 and the passing DKIM \`d=\` / selector pairs. The raw report and the wrapper bytes are discarded after that. What remains is hashed signal: domain, period, pass and fail counts, selector and infrastructure identifiers, the reporting organization, and those wrapper openings.

The tree root is published to \`PactRoots\` — a minimal contract that records roots, leaf counts, and timestamps. Roots supersede one another; none can be edited, backdated, or withdrawn once issued. Anyone can call \`getLatestRoot()\` and recompute inclusion proofs against that root without asking PACT's operators.

The contract does not store leaves. A verifier still needs the off-chain leaf data (and its Merkle path) to check a specific domain. The chain proves that a given root was published; it does not guarantee that leaf bytes remain available. Verifiers who rely on a proof should archive it.

The first on-chain deployment is **Base Sepolia** (a public testnet), with a permissioned publisher. That is independently checkable. It is not Base mainnet, and it is not permissionless publication.

### 2.3 Independent Verification

Anyone can recompute a domain's inclusion proof from the published leaves and check it against the on-chain root, without permission, API keys, or operator involvement for the inclusion check itself.

A trust record that requires trusting its operator for the root is not finished. PACT publishes the root on-chain so that check no longer depends on the operator's database. Remaining operator trust is narrower: leaf availability, a permissioned publisher key, and that the reference implementation does not independently SPF-check the connecting MTA (Cloudflare Email Routing accepted the hop). Report-source authentication requires a passing DKIM signature on the reporter's wrapper mail whose \`d=\` is an allowlisted reporter or forwarding agent. The passing \`d=\` / selector and the wrapper message hash are openings on the public leaf, so a stranger can recompute the commitment without asking ingest to re-verify. Without a copy of the RFC822 they cannot re-run DKIM. The mail itself is not published. Those are honest limits, not hidden ones.

---

## 3. History First, Then Score

### 3.1 Organic, Not Assigned

PACT does not declare legitimacy. It measures verified history.

A domain that has been independently confirmed over time, across many reporting organizations, cannot fabricate that past after the fact. The cost of faking it equals the cost of operating honestly for the same period.

No committee assigns the score. No application process gates it. No registry can be captured. The signal is a mathematical consequence of observable activity.

### 3.2 Two Clocks

Domain registration age and PACT-verified history are different clocks. They must never be collapsed into one number.

- **Domain registered** answers: how long has this name existed on the internet?
- **Verified since** answers: how long has independent infrastructure been confirming this domain inside PACT?

An institution that connects late still has a long registration history — and a short verified history. PACT reports both. Only verified history enters the score. Inflating maturity with domain age would let a hijacker inherit reputation the moment they seize DNS.

### 3.3 The Trust Score

The live score (\`pact-score-0.1\`) is the product of three factors:

**Volume** — logarithm of authenticated pass count. Bulk inflation yields diminishing returns.

**Diversity** — unique reporting organizations relative to verified events, capped at 1. Broad, independent confirmation scores higher than activity concentrated in a single reporter.

**Maturity** — an asymptotic function of days since the domain's first verified PACT event (λ = 0.005). Roughly two years of continuous presence approaches the ceiling. Time cannot be bought.

Status thresholds:

- **Building** — verified history is accumulating; maturity has not yet crossed the activation threshold (~139 days).
- **Proven** — maturity has crossed that threshold; the history is long enough to support third-party reliance more seriously.

### 3.4 How Humans Should See It

Raw \`T\` is correct and not legible on its own. Early domains with different histories can collapse to the same tiny display number if forced onto a 0–100 gauge too soon.

The public interface therefore leads with **verified history** — days independently confirmed, reports, and reporting organizations — and treats the scaled 0–100 display as technical verification, introduced once the raw signal leaves the compressed early band (or reaches Proven). Progress toward the next interpretation band can be estimated without changing the formula.

The formula and the display layer are separate (\`pact-score-0.1\` vs \`pact-display-0.1\`). Changing how people see the score must never rewrite what was measured.

### 3.5 Thresholds Are Policy, Not Protocol

PACT produces a measurement. It is stubbornly boring about what happened. Judgement stays outside. Applications define their own acceptance policy. The same history can inform onboarding, vendor screening, underwriting, or automated counterpart checks — each with its own calibration. A stronger wrapper witness still does not inherit the decision: PACT is not KYC, not a verdict that a domain is legitimate, and not an instruction that an agent should transact.

---

## 4. Privacy by Architecture

### 4.1 A Structural Guarantee

PACT's privacy guarantee is architectural. DMARC aggregate reports — the sole data source — contain no personal data by design.

PACT never accesses, processes, transmits, or stores message content, subject lines, recipient identities, mailbox addresses, or any personally identifiable information. That cannot be changed by policy or breach, because the data never enters the system.

### 4.2 What Is Public

Each leaf commits to the sending domain, reporting period, aggregate authentication counts, hashed infrastructure identifiers, and the wrapper witness (keccak256 of the RFC822 and passing \`d=\` / selector). Domain names are already public. The wrapper openings are published with the leaf so the commitment can be recomputed. The RFC822 itself is not stored.

The record proves that a domain was confirmed at a certain volume in a certain period, and which wrapper DKIM signed the report. It reveals nothing about any message body or any person.

On-chain, only Merkle roots, leaf counts, and timestamps are stored.

### 4.3 Regulatory Posture

Domain names are not personal data under GDPR. Core protocol processing falls outside ordinary data-subject regimes in the EU, UK, and US for this data source. Organizations with specific compliance requirements should obtain their own legal guidance.

---

## 5. Proof of Operational Work

### 5.1 Consensus Hidden in Plain Sight

Authenticated institutional mail requires a domain, DNS, signing keys, delivery infrastructure, and continuous receipt by real systems that then certify the result. Those costs compound over time and cannot be trivially manufactured.

Receiving mail systems act as independent validators. They have no relationship with PACT, no incentive to coordinate, and no awareness their reports are being used as provenance. Their uncoordinated agreement over time is the evidence.

### 5.2 Why Fabrication Fails

To forge a strong history, an attacker would need to send authenticated mail at real volume, over a long time, through infrastructure that survives major providers' abuse filters, to recipients spanning many independent reporting organizations — without interruption long enough for maturity to accumulate.

That is not an exploit. That is legitimate operation. Sybil resistance is economic, not bureaucratic.

### 5.3 Inherited Trust Is Not Permanent Trust

Proof of Operational Work stops attackers building fake history from zero. It does not, by itself, stop an attacker who seizes a domain that already has history.

PACT treats scores as continuously re-evaluated. Leaf data already records infrastructure identifiers (selectors, IP ranges) so discontinuity monitoring can be added without migrating the past. When shipping, abrupt infrastructure breaks should discount inherited reputation until the new pattern stabilizes or is confirmed as intentional. That monitoring layer is on the roadmap (Section 8); the data it needs is already being collected.

---

## 6. What This Is For

### 6.1 A Primitive, Not a Product Pitch

PACT answers a question most systems only approximate: *what independently verified history does this domain have?*

It is not a replacement for KYC paperwork, credit bureaus, or government registries. Those are authorities' claims. PACT is evidence anyone can recheck.

Useful wherever "is this domain real and operationally continuous?" matters — counterpart checks, vendor diligence, underwriting inputs, agent and automation decisions that need a signal resistant to synthetic documents and purchased aging.

### 6.2 The Deeper Architecture

Cryptographic identity solved ownership of identifiers. It did not solve empty containers: a fraudulent entity and a real institution can look identical on day one.

PACT binds real-world operational history to a domain identity without appointing a trusted intermediary as judge. Merkle roots and scores are meant to be consumable by any downstream system. The base layer is the public record. What is built on top stays open.

---

## 7. Ecosystem Boundary

**PACT Protocol** is the base layer: ingest, Merkle tree, public verification, organic score. Open to implement. Verifiable without contacting the authors.

Applications that may sit on top — without expanding the protocol's data boundary — include:

- **Portable credentials** packaging a domain's provenance for diligence workflows.
- **Signal / monitoring** watching connected domains for authentication anomalies and infrastructure discontinuities.
- **Message-level proof** only with explicit user action on a specific message the user already possesses — never by reading mailboxes through the protocol.

The protocol boundary is absolute: PACT Protocol never crosses into message-level content. Applications that do operate under their own consent models.

---

## 8. Status and Availability

**Live today**

- Domain connection via Cloudflare OAuth, manual DNS, or existing reporting tools (\`/connect\`)
- Automatic public-record creation on the first valid aggregate report
- Ingest fail-closed on reporter-wrapper DKIM (Gmail, Microsoft, Yahoo, Apple, and allowlisted forwarders)
- Wrapper witness in the leaf: passing \`d=\` / selector and keccak256 of the RFC822 (the mail itself is not published)
- Append-only Merkle tree with publicly recomputable inclusion proofs
- Merkle roots published to \`PactRoots\` on Base Sepolia (testnet; permissioned publisher). First \`publishRoot\` waits on the first leaf after the D1 cutover
- Off-chain leaf availability via a public HTTP API (Cloudflare D1)
- Public records ranked by verified history; scaled score as technical verification when meaningful
- Per-domain pages with clocks, activity, and technical verification
- Unlisted documentation at \`/docs\` on the reference site (not linked from the homepage): a short note on what makes PACT different, this whitepaper, the roadmap, and the [protocol specification](https://github.com/pbm-labs/pact/blob/main/docs/pact_protocol.md)

**In active development**

- First live leaves after D1 cutover, then the first \`publishRoot\`
- Base mainnet for \`PactRoots\`
- Velocity as a companion signal to maturity
- Infrastructure-discontinuity monitoring (Signal)
- Broader multi-node / permissionless publication

None of the remaining roadmap items are required for today's public verification to function. They shrink remaining operator trust. The unlisted roadmap page tracks the same Now / Next split without duplicating the protocol specification.

The reference implementation is operated under [we build real](https://webuildreal.dev) — the movement. PACT is an open protocol. PBM Labs LLC provides the first reference implementation. The protocol specification and this whitepaper are public. Third-party implementations are encouraged.

---

*PACT — Provenance Attestation and Chain of Trust*  
*Whitepaper v1.8 — August 2026*  
*hello@pbm-labs.com*
`;
