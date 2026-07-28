export const whitepaperMeta = {
  title: 'PACT Protocol',
  subtitle: 'Provenance Attestation and Chain of Trust',
  version: '1.1',
  date: 'July 2026',
  contact: 'protocol@pbm-labs.com',
};

export type WhitepaperBlock =
  | { type: 'h2'; id: string; number: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string };

function h2(id: string, number: string, text: string): WhitepaperBlock {
  return { type: 'h2', id, number, text };
}
function h3(text: string): WhitepaperBlock {
  return { type: 'h3', text };
}
function p(text: string): WhitepaperBlock {
  return { type: 'p', text };
}

export const whitepaperAbstract: string[] = [
  'Every institutional email sent anywhere in the world is automatically cryptographically signed. Every receiving mail server validates that signature and generates a structured report of the result. These reports have been produced continuously, at global scale, since 2011. They have never been captured, persisted, or chained.',
  "PACT is an open protocol that captures these reports, anchors them in an append-only, publicly verifiable Merkle tree, and derives mathematically verifiable trust scores for institutional domains — without accessing, processing, or storing any message content, recipient identity, or personal data of any kind. On-chain publication of the Merkle root to a public blockchain, removing the need to trust PACT's own infrastructure entirely, is in active development (Section 8).",
  'The result is the first cryptographic record of institutional legitimacy built entirely from infrastructure that already exists, already operates, and requires no behavioral change from any sender or recipient.',
];

export const whitepaperBlocks: WhitepaperBlock[] = [
  h2('problem', '1', 'The Problem'),
  h3('1.1 The End of Document Trust'),
  p("For decades, verifying a document's origin relied on human judgment: does the letterhead look right, does the domain match, does the formatting seem legitimate? These checks were imperfect but sufficient when fabricating a convincing document required meaningful skill and resources."),
  p("Generative AI ended that. A photorealistic pay stub, bank statement, or signed contract can now be produced in seconds at negligible cost, indistinguishable from a legitimate document by any visual or metadata inspection. The attack surface is no longer the document's appearance. It is the absence of any verifiable link between a document and the institutional domain it claims to originate from."),
  p('In November 2024, FinCEN issued Alert FIN-2024-Alert004, explicitly identifying AI-generated synthetic financial documents as an active threat to the US financial system. The alert told institutions to increase scrutiny of digital documents. It could not tell them how — because no technical standard for doing so exists.'),
  h3('1.2 The Hidden Audit Trail'),
  p('There is a fact about the global email system that almost no one outside of infrastructure engineering knows.'),
  p('Since 2011, every major institutional sender has been cryptographically signing their outbound email using DKIM (DomainKeys Identified Mail, RFC 6376). Every receiving mail server — Gmail, Outlook, Yahoo, and hundreds of others — validates that signature on every email it receives. And every one of those receiving mail servers already generates a structured aggregate report of those validations and sends it to the domain owner every 24 hours.'),
  p('These reports contain: the sending domain, the validation result, the sending IP range, the DKIM selector, the message count, and the reporting period. They contain nothing about the content of any message, the identity of any recipient, or any personally identifiable information.'),
  p('They are generated today, continuously, for every institutional domain that has published a DMARC record. They have never been systematically captured, persisted, or chained into a provenance layer.'),
  p('PACT captures them.'),

  h2('protocol', '2', 'The Protocol'),
  h3('2.1 Connecting a Domain'),
  p("A domain connects to PACT by adding a single address to one field in its existing DNS record. That is the only change required. No software to install, no API to integrate, no behavioral change for any sender or recipient. The global mail infrastructure continues operating exactly as before — and now sends a copy of each aggregate report to PACT alongside the domain's existing destination."),
  p('For most domain operators, this is a single click through an OAuth-based onboarding flow. For others, it is one DNS field edit.'),
  h3('2.2 From Report to Proof'),
  p('When an aggregate report arrives at PACT, the authentication metadata is extracted and committed as a cryptographic leaf in an append-only Merkle tree. The raw report is discarded immediately after extraction. Only the extracted signals — domain, period, pass and fail counts, selector and IP range identifiers — are preserved, in hashed form.'),
  p("Once daily, the Merkle root is published to a public, append-only ledger. Every new root supersedes the last; none can be edited, backdated, or withdrawn once issued. Publishing that root to a public blockchain smart contract — removing the need to trust PACT's own infrastructure for that last step — is the protocol's next milestone, tracked in Section 8."),
  h3('2.3 Independent Verification'),
  p("Any party can recompute any domain's Merkle inclusion proof directly from the published leaves and check it against the published root, without contacting PACT's operators or asking permission. No API key, no subscription required."),
  p("This is not a design choice made for convenience. It is a design constraint made deliberately: a trust record that requires trusting its operator is not a trust record. Once root publication moves on-chain (Section 8), that verification will no longer require trusting PACT's infrastructure at all — only public, independently queryable state. PACT is designed to be verifiable by construction, and is built in that order: real data first, trustless anchoring next."),

  h2('trust-score', '3', 'The Trust Score'),
  h3('3.1 Organic, Not Assigned'),
  p('Trust scores in PACT are not declared, granted, or assigned by any authority. They emerge mathematically from the accumulated history of verified aggregate reports in the public Merkle tree.'),
  p('The intuition is direct: a domain that has been sending authenticated email at scale, validated by hundreds of independent mail servers globally, continuously for years, cannot have fabricated that history. The cost of constructing it retroactively is identical to the cost of having operated as a legitimate institution for that period.'),
  p('No committee governs the score. No application process exists. No registry can be captured. The score is a mathematical consequence of observable, independently verifiable reality.'),
  h3('3.2 Three Components'),
  p('The trust score for a domain is the product of three factors:'),
  p('**Volume** — the logarithm of total authenticated message count. Logarithmic scaling ensures that doubling message volume does not double the score. Bulk inflation yields diminishing returns.'),
  p('**Diversity** — the ratio of unique receiving mail servers to total verified events. A domain whose authenticated email is received by hundreds of independent providers globally scores higher than one concentrated in a single infrastructure. This reflects real institutional reach and resists artificial inflation through controlled or coordinated receiver networks.'),
  p("**Maturity** — an asymptotic function of time since the domain's first verified event in the tree. A domain registered yesterday cannot achieve a high maturity score regardless of message volume. Maturity approaches its maximum over approximately two years of continuous presence. Time cannot be compressed or purchased."),
  p('The maturity factor is the most consequential defense. Lookalike domains and synthetic entities face an insurmountable time gap versus the domains they attempt to impersonate. The global mail infrastructure has been certifying `wise.com` for years. No attacker can replicate that accumulation.'),
  h3('3.3 Maturity Is Not the Whole Story'),
  p('A pure maturity-weighted score penalizes legitimate new entities by construction. A well-funded startup three months old will score below an inactive small business with a ten-year-old domain, even though the startup is unambiguously more legitimate in any practical sense. If PACT is consumed as a single number, this is a real distortion — not a cosmetic one.'),
  p("The distortion exists because maturity collapses two distinct questions into one score: *has this domain existed long enough that its history could not have been fabricated* and *is this domain's current activity consistent with legitimate operation*. These are different questions with different answers for different entities."),
  p('The protocol\u2019s design addresses this by planning to expose velocity as an independent signal alongside maturity, rather than fusing both into a single opaque number. Velocity would measure whether a domain\u2019s growth in volume and receiver diversity is gradual and broadly distributed — consistent with organic adoption — or sudden and concentrated, consistent with artificially manufactured traffic. A new domain with high volume, high diversity, and gradual, multi-receiver velocity is a different signal than a new domain with an abrupt, narrow spike in traffic from a small set of receivers. The first is consistent with a real, fast-growing institution. The second is consistent with manufactured history.'),
  p('Once shipped, applications consuming PACT should read maturity and velocity together, not maturity alone — a young domain with strong velocity and strong diversity should not be treated identically to a young domain with neither. Velocity is on the near-term roadmap (Section 8) and is not yet part of the live score; today\u2019s score is volume, diversity, and maturity only.'),
  h3('3.4 Thresholds Are Policy, Not Protocol'),
  p("PACT produces a measurement. Applications consuming the score define their own acceptance thresholds based on their risk tolerance and use case. The protocol enforces no threshold. This separation of measurement from policy is deliberate — it allows the same underlying trust score to serve a bank's onboarding workflow, a procurement platform's vendor screening, and an automated decision system's counterparty evaluation, each with appropriate calibration."),

  h2('privacy', '4', 'Privacy by Architecture'),
  h3('4.1 A Structural Guarantee'),
  p("PACT's privacy guarantee is architectural, not contractual. It does not rest on a privacy policy or a compliance certification. It rests on the fact that DMARC aggregate reports — PACT's sole data source — contain no personal data by design."),
  p('PACT never accesses, processes, transmits, or stores any message content, subject lines, recipient identities, sender email addresses, or any personally identifiable information. This cannot be changed by policy, misconfiguration, or breach, because the data never enters the system.'),
  p("The privacy guarantee is enforced by the data source, not by PACT's operators."),
  h3('4.2 What Is Public'),
  p('Each entry in the Merkle tree commits to the sending domain, the reporting period, aggregate authentication counts, and hashed infrastructure identifiers. Every element is either already public information (domain names) or opaque (hashes that reveal nothing about their preimages to observers).'),
  p('The published record proves that a domain was authenticated at a certain volume in a certain period. It reveals nothing about any message, any person, or any communication.'),
  h3('4.3 Regulatory Posture'),
  p('Domain names are not personal data under GDPR. The information PACT processes falls entirely outside the scope of data subject rights under current privacy frameworks in the EU, UK, and US. No data processing agreements are required for core protocol operation. Organizations with specific compliance requirements should obtain their own legal guidance.'),

  h2('proof-of-operational-work', '5', 'Proof of Operational Work'),
  h3('5.1 A Consensus Mechanism Hidden in Plain Sight'),
  p("PACT's Sybil resistance can be understood through a mechanism that already operates at global scale without being recognized as such."),
  p('Maintaining authenticated institutional email requires a registered domain, DNS infrastructure, DKIM key management, a mail server or provider, and continuous delivery to real recipients over time — recipients whose mail servers then certify the delivery through aggregate reports. These are real operational costs that compound over time and cannot be trivially manufactured.'),
  p("The receiving mail servers — Gmail, Outlook, Yahoo, and hundreds of others — act as independent validators. They have no relationship with PACT, no incentive to coordinate, and no awareness that their reports are being used as evidence of anything beyond their immediate filtering function. Their aggregate reports are, in effect, an independent and uncoordinated consensus that a domain's authenticated email activity occurred exactly as recorded."),
  p("PACT packages that consensus into an immutable, append-only public record, with on-chain anchoring as the next step toward removing trust in PACT's own infrastructure entirely (Section 8)."),
  h3('5.2 Why the Attack Fails'),
  p('To achieve a high trust score through illegitimate means, an attacker would need to send authenticated email at institutional volume, consistently, over years, from infrastructure that passes the spam and abuse filters of every major mail provider globally, to recipients spread across hundreds of independent receiver domains — and maintain this without interruption long enough for the maturity factor to accumulate.'),
  p("That is not an attack. That is legitimate operation. The economic cost of the attack equals the economic cost of being a real institution. PACT's Sybil resistance is not enforced by a gatekeeper — it is enforced by the economics of the global email infrastructure itself."),
  h3('5.3 Inherited Trust Is Not Permanent Trust'),
  p('Proof of Operational Work defends against an attacker building fraudulent history from zero. It does not, by itself, defend against an attacker who seizes control of a domain that already has accumulated history — through DNS compromise, registrar account takeover, or any other mechanism that transfers control of the domain\u2019s infrastructure to an unauthorized party.'),
  p("This is a meaningful distinction. A domain hijacker who gains control of `wise.com`'s DNS does not need to build trust — they inherit it. The protocol's default assumption, that current control of a domain's DNS implies legitimate continuity with its past, is true in the overwhelming majority of cases and false in exactly the cases that matter most."),
  p("PACT's protocol design addresses this by treating the trust score as continuously re-evaluated, not retroactively fixed. The leaf schema already records the infrastructure identifiers this requires — DKIM selectors and IP ranges are committed per leaf today — precisely so that this defense can be built without a data migration. PACT Signal, the monitoring application described in Section 7, is designed to watch each connected domain's sending infrastructure against its established baseline. A domain hijacking event almost always produces an observable infrastructure discontinuity: new selectors, unfamiliar sending ranges, or a receiver distribution inconsistent with the domain's history, often appearing abruptly rather than gradually."),
  p("When such a discontinuity is detected, the design calls for the trust score to stop reflecting the pre-existing history unconditionally — provisionally discounted until the new infrastructure pattern either stabilizes into a consistent, sustained baseline or is confirmed by the domain operator as an intentional, authorized change. Accumulated history is meant to establish a prior, not to grant indefinite, unconditional inheritance of trust independent of what the domain's infrastructure is doing today."),
  p('This monitoring layer is on the roadmap and not yet live (Section 8) — the underlying data it needs is already being collected. Even once shipped, it will not eliminate the risk entirely; no system that relies on DNS as its root of authority can. The goal is that hijacking a high-trust domain produces a visible signal rather than a silent, permanent transfer of reputation.'),

  h2('endgame', '6', 'The Endgame'),
  h3('6.1 FICO for Institutional Identity'),
  p('The credit bureau model is the closest existing analog. A credit score is calculated by a neutral third party from behavioral history, consumed by independent institutions that trust the score rather than the subject, and so infrastructural that most of its users no longer ask why it exists.'),
  p("PACT builds the same model for institutional domain identity. The behavioral history is authenticated email activity as certified by the global mail infrastructure. The validators are independent mail servers. The output is a trust score consumable by any system that needs to answer a single question: *Is this institutional domain real, operationally stable, and consistent with its claimed history?*"),
  p('No existing system provides a satisfactory answer to that question.'),
  p('KYB and document verification rely on self-declared or third-party-validated documents — all fabricable, increasingly so. Domain reputation systems produce real-time filtering signals with no persistent, independently verifiable record. Blockchain analytics address on-chain behavior but are inapplicable to the vast majority of institutional actors whose legitimacy is established off-chain. Credit bureaus address individuals and financial behavior, not institutional operational continuity.'),
  p('PACT answers the question none of these address: not what an entity declares, but what it has demonstrably done — as independently certified by the global mail infrastructure — over a verifiable period of time.'),
  h3('6.2 The Scope'),
  p('The trust signal PACT produces is not a compliance tool. It is a primitive. Any system requiring institutional trust verification can consume it.'),
  p('Financial institutions verifying that a counterparty\u2019s domain has a credible operational history before a transaction or account opening. Compliance and due diligence teams requiring verifiable evidence of institutional legitimacy beyond documentation. Insurance underwriters using operational maturity as a proxy for security hygiene. Procurement platforms distinguishing established vendors from entities with no verifiable track record.'),
  p('The most consequential category is forward-looking: automated decision systems and AI agents making procurement, contracting, and payment decisions that previously required human judgment. As these systems scale, they will require trust signals that are cryptographically verifiable, machine-readable, and structurally resistant to manipulation. A signal that cannot be manufactured by producing better documentation or more convincing synthetic content.'),
  p('PACT is that signal.'),
  h3('6.3 The Deeper Architecture'),
  p('The commercial endgame is the FICO model. The architectural endgame is something more foundational.'),
  p('Decentralized identity systems have solved cryptographic ownership — anyone can generate a unique identifier whose control is provable. What they have not solved is the empty container problem: a fraudulent entity and a legitimate multinational have identical cryptographic validity on day one. There is no primitive that binds real-world operational history to a cryptographic identity without a trusted intermediary.'),
  p('PACT is that primitive. It converts the existing email authentication infrastructure into a Proof of Operational Work oracle: a verifiable record that a specific domain has been operating at scale in the real world, as independently certified by the global mail infrastructure, designed to be anchored permanently on-chain (Section 8). This record can be consumed by any identity protocol, any smart contract, or any automated system that needs to answer the question of institutional legitimacy without trusting a centralized authority.'),
  p('The architecture supports this extension. The protocol is designed so that its Merkle roots and trust scores can be consumed by any downstream system, on any chain, through any interface. The base layer is the trust record. What is built on top is open.'),

  h2('ecosystem', '7', 'Ecosystem'),
  p('PACT Protocol is the base layer — open, freely implementable, and independent of any single operator for verification correctness. Any organization can verify the public Merkle tree against the published roots without contacting the protocol\u2019s authors.'),
  p('Three applications are defined in the PACT ecosystem, each consuming the protocol as infrastructure:'),
  p('**PACT Chain** packages a domain\u2019s full provenance history into a portable, independently verifiable credential for compliance submissions, financial institution onboarding, regulatory filings, and due diligence.'),
  p('**PACT Signal** monitors connected domains for anomalies in their aggregate authentication patterns — failure rate spikes, unrecognized infrastructure, lookalike domain activity — and delivers actionable alerts to domain operators. No message content is accessed at any point.'),
  p('**PACT Proof** enables document-level authentication with explicit user consent. A user provides a specific received email voluntarily; PACT Proof validates the individual cryptographic signature and generates a certificate of authenticity referencing the sending domain\u2019s PACT Protocol trust history. This is always an active, user-initiated action.'),
  p('The protocol boundary is absolute: PACT Protocol never crosses into message-level data. Applications built on top operate under their own privacy models and consent mechanisms, independently of the protocol.'),

  h2('status', '8', 'Status and Availability'),
  p('PACT Protocol is at the specification and early build stage. The protocol specification is open and freely available. Third-party implementations are encouraged.'),
  p('**Live today:** domain connection via a single DNS record or OAuth-based onboarding; continuous ingestion of real DMARC aggregate reports; extraction and hashing of leaf data (domain, period, reporter, DKIM pass/fail counts, selectors, IP ranges); construction of the append-only Merkle tree; daily publication of the tree root to a public, append-only ledger; and a public, per-domain page showing the trust score, authentication history, and a Merkle inclusion proof recomputed live against the latest published root.'),
  p('**In active development, not yet live:** on-chain anchoring of the Merkle root to a public blockchain smart contract, so that root verification no longer requires trusting PACT\u2019s own infrastructure; the velocity signal described in Section 3.3; and PACT Signal, the infrastructure-discontinuity monitoring described in Section 5.3 and Section 7. None of these are required for the core trust score or the public verification page to function today — they extend what\u2019s already live.'),
  p('Early adoption is expected to concentrate among domains with a specific, immediate incentive to be independently verifiable — entities operating under regulatory scrutiny, compliance-sensitive vendors, and organizations seeking to differentiate themselves from less established competitors. Broad adoption by default-trusted institutions follows once the protocol\u2019s verification value is established by precedent, not before.'),
  p('The protocol is designed to evolve toward permissionless node operation. The initial reference implementation operates a single node; the architecture supports and anticipates multiple independent nodes. Once root publication moves on-chain, the verification function will ensure that the correctness of any published root is independently verifiable regardless of who operates the publishing infrastructure.'),
];
