# The Problem FinCEN Named. The Solution They Didn't Build.

*PBM Labs LLC*

*Protocol baseline: [PACT Protocol Specification v0.2](pact_protocol_v02.md)*

---

## What FinCEN Said in November 2024

On November 13, 2024, the U.S. Financial Crimes Enforcement Network issued Alert FIN-2024-Alert004.

The message was direct: generative AI is being used to fabricate financial documents — pay stubs, bank statements, identity records, corporate authorizations — that are visually indistinguishable from legitimate ones. These documents are being submitted to banks and financial institutions to open accounts, access credit, and move money.

FinCEN told every financial institution in the United States to treat digital documents with a higher level of scrutiny. It told compliance teams to train staff to detect AI-generated documents. It told banks to flag suspicious activity involving synthetic materials using a specific reporting code.

What FinCEN did not do is tell institutions *how* to distinguish a document from a legitimate institutional domain from one fabricated to look like it.

That gap is the problem PACT solves. Not by inspecting documents — but by building a cryptographically verified provenance record for the domains those documents claim to come from.

---

## Why the Current Approach Fails

The standard response to document fraud has always been visual inspection, callback verification, and third-party data sources. These methods were designed for a world where fabricating a convincing document required skill, time, and resources.

That world ended in 2023.

Today, a photorealistic pay stub from any employer, a bank statement from any institution, or a corporate authorization letter on any letterhead can be generated in seconds at no cost. The document looks real because it was built to look real. No visual inspection catches it. No callback to a number on the document helps if the number was also fabricated. And third-party data sources only confirm what was registered — not what was actually sent.

The attack surface is not the document's appearance. It is the absence of a verifiable link between the document and its claimed origin.

---

## The Infrastructure That Already Exists — and Nobody Is Using

Every email sent by a bank, an employer, a payroll platform, or a financial institution is automatically authenticated by the sender's mail server using DKIM — a cryptographic standard that has operated silently and universally since 2011. Every receiving mail server in the world — Gmail, Outlook, Yahoo — already validates that signature on every email it receives.

And every one of those receiving mail servers already generates a structured report of those validations and sends it to the domain owner every 24 hours. This mechanism is called DMARC aggregate reporting. It is a standard defined in RFC 7489. It is already running today, across billions of email deliveries, without any action required from senders or recipients.

These reports contain authentication metadata: which domain sent the email, whether the DKIM signature was valid, what sending infrastructure was used, how many messages were processed, and which reporting organization produced the record. They contain nothing about the content of any message, the identity of any recipient, or any sender mailbox address.

No one has ever used this stream of authentication metadata to build a provenance layer. No one has ever anchored it, chained it, and made it independently verifiable. It has been generated, consumed by domain owners for internal monitoring, and discarded.

PACT changes that.

---

## What PACT Does

PACT Protocol receives DMARC aggregate reports as a co-recipient alongside the domain owner. A domain connects to PACT by adding a single address to one field in their existing DNS record — a change that takes under a minute and requires no software installation, no API integration, and no modification to any email infrastructure.

From that point forward, PACT authenticates each incoming report against a curated allowlist of known reporting organizations and forwarding agents, then processes verified aggregate data into a cryptographic record of that domain's authentication activity. Each authenticated report period generates a leaf in an append-only Merkle tree anchored on a public blockchain. The raw report XML is discarded immediately after extraction. No message content, recipient identity, or sender mailbox address is retained.

The result is a **domain provenance record**: a permanent, independently verifiable history that a specific institutional domain has been sending cryptographically authenticated email at a specific volume, from specific infrastructure, continuously over a specific period of time. That history cannot be fabricated retroactively. Published Merkle roots cannot be altered. Authentication metadata comes from independent mail servers — not from the domain owner alone.

PACT derives an **organic trust score** from this history: message volume, diversity of independent reporting organizations, and maturity over time. Scores are labeled **provisional** until approximately 139 days of continuous history; **activated** scores are suitable for high-stakes reliance in onboarding and compliance decisions.

PACT Protocol does not inspect documents, access message content, or verify individual emails. Document-level verification requires PACT Proof (Layer 2), with explicit user consent.

---

## The PACT Ecosystem

PACT Protocol is a domain provenance layer. It answers one question: does this institutional domain have a verified history of legitimate authenticated email activity?

Three applications are built on top of the protocol. They are not part of the protocol specification; each has its own privacy model:

**PACT Chain** packages a domain's provenance history — activated trust score, Merkle proofs, and on-chain root sequence — into a portable credential for compliance submissions, bank onboarding, and regulatory filings.

**PACT Signal** monitors connected domains for anomalies in aggregate authentication patterns — failure spikes, unauthorized infrastructure, suspicious selectors — and alerts domain operators. Lookalike detection is probabilistic and scoped to observable data sources; it does not claim perfect homograph detection.

**PACT Proof** addresses document-level authentication with explicit user consent. The user provides a specific email directly, and PACT Proof certifies that message and its attachments are authentic and unaltered. This is user-initiated — never passive, never automatic.

For FinCEN's purposes, **PACT Protocol** and **PACT Chain** are the primary layers. The question FinCEN's alert implies — can a financial institution determine whether a document originates from a legitimate institutional domain or a synthetic one — is answered at the domain level, without accessing any message content and without any action required from the sending institution beyond the DNS change they may already have made for DMARC reporting.

PACT cannot detect account takeover: when an attacker sends from a compromised account on a legitimate domain with valid DKIM, aggregate reports show a pass. Domain provenance addresses domain spoofing and infrastructure attacks, not insider or credential compromise.

---

## What This Means for a Compliance Team

A pay stub submitted as a PDF has no verifiable link to the employer who supposedly issued it. It could have been generated this morning. There is no way to know from the document alone.

A document claiming to originate from a domain connected to PACT is different. The compliance officer can verify that domain's provenance record: how long it has been sending DKIM-verified email, at what volume, from what infrastructure, and whether its trust score has reached **activated** status.

A domain with years of verified authentication history across hundreds of independent reporting organizations cannot be a synthetic identity created to commit fraud last week. A domain connected days ago with near-zero maturity cannot credibly claim to be an established institution — regardless of how polished the attached PDF appears.

For the compliance officer, the question changes from "does this document look real?" to "does this domain have a verifiable history of legitimate operation?" That is a question with a mathematically grounded answer, not a judgment call — provided the institution understands the difference between provisional and activated scores.

No AI system can fabricate years of independently reported authentication history retroactively. The Merkle tree is append-only. Published roots are immutable. The metadata comes from allowlisted reporting organizations around the world — not from PBM Labs alone.

---

## The Operational Model

**Protocol ingestion is passive.** Once a domain adds PACT to their DMARC aggregate report destination, mail servers send structured authentication records every 24 hours. PACT authenticates, processes, anchors, and updates the domain's provenance record and trust score. No message is ever read.

**Anomaly alerting is active (PACT Signal, post-MVP).** Domain operators receive alerts when authentication patterns deviate from baseline. This is a separate application layer, not required for core protocol operation.

For financial institutions, verification begins at the public domain page (`pact.pbm-labs.com/domain/{domain}`) or a **PACT Chain credential** submitted with an onboarding package. The response includes a trust score (with provisional/activated status), authentication history, and a Merkle inclusion proof verifiable against on-chain roots.

On-chain roots attest that a leaf was committed to the tree. Verifiers obtain leaf data and proofs from PBM Labs or archive proofs they rely on. The verification does not require trusting PBM Labs' ongoing operation — only the permanence of published blockchain roots and the cryptography of the proof.

No message content is accessed at any point in protocol-level verification. No recipient identity is exposed. Verification is based on domain-level authentication metadata already generated by global email infrastructure.

---

## Why This Is Different From Every Existing Solution

Existing document fraud detection relies on one of three approaches: visual inspection of the document itself, verification against third-party databases, or behavioral analysis of the submission. All three operate on the document as presented — they cannot detect a perfectly fabricated document that has never been seen before.

PACT does not inspect the document. It verifies the domain it claims to come from. A legitimate institution that has been sending DKIM-authenticated email for years has an authentication history that no attacker can replicate without operating as that institution for years — and having that activity reported by independent mail servers on the allowlist.

This approach is structurally privacy-preserving in a way that message-level inspection cannot be. PACT processes only aggregate authentication metadata — data that contains no message content, no recipient addresses, and no sender mailbox identifiers by design. For typical institutional domains, this generally does not implicate personal data processing obligations; specific deployments should be reviewed with legal counsel.

---

## The Timing

FinCEN identified the problem in November 2024. Synthetic identity exposures at U.S. lenders grew 18 percent year over year in 2024. The tools to fabricate documents are becoming faster, cheaper, and more accessible every month.

The question every compliance team is now asking is not whether AI document fraud is a threat. It is what standard of verification is defensible when a regulator asks how a fraudulent document was accepted.

A domain provenance record built from independently verified DMARC aggregate reports, anchored in an immutable public blockchain, with an **activated** trust score reflecting sustained institutional history, is a defensible answer. Visual inspection alone is not.

PACT Protocol is in active development. The MVP delivers a public, independently verifiable domain provenance page; PACT Chain and PACT Signal follow as history accumulates.

---

## Current Flow vs. PACT Flow

### How document verification works today

A compliance officer receives a document claiming to originate from a legitimate institution. They inspect it visually. They may call a number on the document to verify — a number that could itself be fabricated. They check the document against third-party databases that confirm registration data, not actual email activity. They make a judgment call. If the document is a high-quality AI fabrication from a lookalike domain registered last week, every one of these checks passes. The bank accepts the document. The fraud succeeds.

This is the flow that FinCEN's November 2024 alert identified as the attack surface. The problem is not the quality of the compliance officer's judgment. The problem is that no verifiable link exists between the document and the domain it claims to originate from.

### How the same process works with PACT Protocol

The domain the document claims to originate from has been connected to PACT Protocol. For two years, every 24 hours, allowlisted mail servers have been sending PACT structured records of that domain's DKIM authentication activity. PACT Protocol has authenticated those reports, anchored them in a Merkle tree, and published the roots on a public blockchain.

The compliance officer visits the public domain page or receives a **PACT Chain credential** with the onboarding package. They see: an **activated** trust score reflecting sustained authentication history, a maturity factor near maximum, diversity across independent reporting organizations, and Merkle inclusion proofs any auditor can verify against on-chain roots. The domain has the history expected of a legitimate institution.

If instead the document claims to originate from a domain connected three weeks ago — provisional score, near-zero maturity — or from a lookalike domain with no comparable history, the compliance officer has a mathematically grounded reason to escalate before relying on the document.

PACT Signal, when deployed, adds continuous anomaly monitoring for connected domains — failure spikes, unauthorized infrastructure, suspicious selectors — surfaced to domain operators without accessing message content.

No message content was accessed at the protocol level. No personal data from messages was processed. Verification takes seconds.

### What stays the same

The sending institution changes nothing. Their mail servers continue generating DKIM signatures exactly as before. Receiving mail servers continue generating DMARC aggregate reports exactly as before. The compliance officer's intake workflow is unchanged. The addition is a provenance check — public page or Chain credential — that returns a trust score, history depth, and cryptographic proof for the claimed domain.

The cryptographic record of that domain's legitimacy is built from existing infrastructure from the moment the domain connects to PACT.

---

*PBM Labs LLC*
*protocol@pbm-labs.com*
