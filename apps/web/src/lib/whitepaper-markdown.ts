export const LOCAL_WHITEOBER_MARKDOWN = `
# PACT Protocol
## Provenance Attestation and Chain of Trust

**Version 1.9 — August 2026**  
**hello@pbm-labs.com**

---

## Abstract

The internet was built without a durable way to tell who is real. Names on screens can be fabricated in minutes. History cannot.

Every domain that sends mail already participates in a quiet, global verification loop: outbound messages are cryptographically signed; receiving mail systems check those signatures and emit structured aggregate reports. Those reports have been produced continuously since 2011. They contain no message content and no personal identities — only whether a domain showed up honestly, how often, and through which infrastructure.

PACT is an open protocol that captures those reports, commits them to an append-only Merkle tree anyone can recompute, and publishes a public record of independently confirmed history. PACT does not define a score or a verdict; judgement stays outside. Domains join by pointing an existing DNS field at PACT. Nothing about how they send mail changes. No message is ever read.

The public record is stubbornly boring about what happened: days independently confirmed, reports, reporting organizations, and cryptographic proofs. Judgement stays outside. Merkle roots are published to a public blockchain so a verifier does not have to trust the operator's database for inclusion. Leaves stay off-chain: the chain attests inclusion, not availability.

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

## 3. History First

### 3.1 Independently confirmed, not assigned

PACT does not declare legitimacy. It measures verified history.

A domain that has been independently confirmed over time, across many reporting organizations, cannot fabricate that past after the fact. The cost of faking it equals the cost of operating honestly for the same period.

No committee assigns a verdict. No application process gates the record. No registry can be captured. The public page publishes what happened.

### 3.2 Two Clocks

Domain registration age and independently confirmed history are different clocks. They must never be collapsed into one number.

- **Domain registered** answers: how long has this name existed on the internet?
- **Verified since** answers: how long has independent infrastructure been confirming this domain inside PACT?

An institution that connects late still has a long registration history — and a short independently confirmed history. PACT reports both. Domain age MUST NOT be folded into any application's maturity of PACT history. Inflating that clock with registration age would let a hijacker inherit reputation the moment they seize DNS.

### 3.3 Interpretation is not protocol

PACT does not define a score, an activation label, or a verdict. Applications MAY interpret published fields (days independently confirmed, reports, reporting organizations, pass/fail counts). One informative example is \`example-score-0.1\` — see [docs/examples/scoring.md](https://github.com/pbm-labs/pact/blob/main/docs/examples/scoring.md). It is not part of the protocol.

The public reference UI does not display a score, a 0–100 gauge, interpretation bands, or a verdict badge. It publishes what happened. Anyone can share the record URL.

### 3.4 Thresholds Are Policy, Not Protocol

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

Applications that interpret this history should treat that interpretation as continuously re-evaluated. Leaf data already records infrastructure identifiers (selectors, IP ranges) so discontinuity monitoring can be added without migrating the past. When shipping, abrupt infrastructure breaks should discount inherited reputation until the new pattern stabilizes or is confirmed as intentional. That monitoring layer is on the roadmap (Section 8); the data it needs is already being collected.

---

## 6. What This Is For

### 6.1 A Primitive, Not a Product Pitch

PACT answers a question most systems only approximate: *what independently confirmed history does this domain have?*

It is not a replacement for KYC paperwork, credit bureaus, or government registries. Those are authorities' claims. PACT is evidence anyone can recheck.

The protocol does not answer whether a domain is legitimate. Applications may use the same history for counterpart checks, vendor diligence, underwriting, or agent decisions — each with its own policy.

### 6.2 The Deeper Architecture

Cryptographic identity solved ownership of identifiers. It did not solve empty containers: a fraudulent entity and a real institution can look identical on day one.

PACT binds real-world operational history to a domain identity without appointing a trusted intermediary as judge. Merkle roots are meant to be consumable by any downstream system. Applications MAY interpret the public record; the protocol does not. The base layer is the public record. What is built on top stays open.

---

## 7. Ecosystem Boundary

**PACT Protocol** is the base layer: ingest, Merkle tree, and public verification. Open to implement. Verifiable without contacting the authors.

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
- Public records ranked by independently confirmed history (days, then report count)
- Per-domain pages with clocks, observed pass rate, leaves, and cryptographic proofs — no score, Proven label, or verdict badge
- Documentation at \`/docs\` on the reference site: what the record is, honest limits, this whitepaper, status, the [protocol specification](https://github.com/pbm-labs/pact/blob/main/docs/pact_protocol.md), and an [informative scoring example](https://github.com/pbm-labs/pact/blob/main/docs/examples/scoring.md)

**Waiting on the world**

- First live leaves after D1 cutover, then the first \`publishRoot\`. Ingest already writes a leaf and publishes a root when a valid report arrives.

**Later**

- Base mainnet for \`PactRoots\`
- Permissionless publication
- Independent leaf mirrors
- Velocity as a companion signal for applications
- Infrastructure-discontinuity monitoring (Signal)

Waiting on reports is operational, not a code task. Later items shrink remaining operator trust. None of them are required for a record to exist once reports arrive. The status page at \`/docs/roadmap\` tracks the same split without duplicating the protocol specification.

The reference implementation is operated under [we build real](https://webuildreal.dev) — the movement. PACT is an open protocol. PBM Labs LLC provides the first reference implementation. The protocol specification and this whitepaper are public. Third-party implementations are encouraged.

---

*PACT — Provenance Attestation and Chain of Trust*  
*Whitepaper v1.9 — August 2026*  
*hello@pbm-labs.com*
`;
