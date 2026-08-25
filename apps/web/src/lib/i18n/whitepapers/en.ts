export const WHITEPAPER_EN = `
Identifiers are cheap. A domain, a profile, a badge — all of it can be manufactured this afternoon. Yesterday cannot, if someone else was already watching.

PACT is a public record of traces independent systems already emit. Mail systems generate aggregate authentication reports. Browsers already required public certificate logs. Nobody joins a new network. DNS only points the mail feed here. The record publishes what happened. It does not decide what it means.

The name is Provenance of Accumulated Checkable Traces. Provenance: the traces have a source that is not this operator. Accumulated: the record grows with time; it cannot be backfilled. Checkable: anyone can recompute inclusion against a published root.

Generative models made new identifiers and new documents cheap. They did not make yesterday cheap. The only record that survives that is a record someone else was already writing down.

## Leftover traces

A new identity system usually asks the world to perform a new ritual: install an app, mint a credential, pass a ceremony, trust a new issuer. Those systems fail at the scale that matters, because the people who would need to join are not waiting for another network.

PACT records leftover exhaust. Receiving mail systems already emit reports. Public certificate logs already exist because browsers required a diary of issuance. This protocol does not invent a feed and ask the world to fill it. It keeps what is already being thrown away.

Mail and certificates are leftover kinds of different origin. They sit on the same append-only tree so a checker has one root to recompute against. They are never blended into a score. A later leftover source may be added as another tagged kind. Each kind keeps its own preimage. Applications may interpret the fields. This protocol will not.

## Mail reports

Every institutional domain that sends mail is already signing it with DKIM. Receiving systems — Gmail, Outlook, Yahoo, and others — already validate those signatures and already emit aggregate reports: whether authenticated mail showed up, how often, from which infrastructure, and according to whom.

Those reports contain no messages, no subjects, no inboxes, no people. They are summaries of authentication outcomes over a period. Privacy here is structural. The pipeline never sees the content, so policy cannot later collect it by accident.

A name gets a mail record by pointing DNS. Add a report destination so a copy of those reports is kept. The domain's existing policy and other destinations stay. Nothing about how mail is sent or received changes. History starts when the first independent report arrives — not when the DNS line is saved.

Each mail leaf commits to the domain, the reporting period, the reporting organization, pass and fail counts, and a hash of the signed wrapper that carried the report. Fake reports do not get in because the wrapper has to authenticate and the reporter has to be a known organization. The raw report is discarded after extraction.

## Certificate logs

Certificate Transparency logs already record issuance. They exist because browsers required a public diary, not because this protocol asked anyone to log. A name that appears there has a first-seen date someone else wrote down.

A new certificate can be issued in minutes. That is a weak calendar, not proof that HTTPS is trustworthy, and not a quality claim about the certificate. A real certificate can cover a name that did not exist yesterday.

This site indexes public logs after the name is on the ledger. There is no second ritual. The subject can cause a certificate to be issued. The subject cannot be the log.

Certificate leaves carry a first-seen date, issuer, validity window, and fingerprint. They share the tree and the leaf index space with mail leaves. They are never merged into mail leaves.

The reference ingest reads a public index over those logs, not a log operator. That is weaker than a specific log's signed tree head. It is still leftover calendar from infrastructure that already existed.

## One tree, two kinds

Both kinds are keccak256 leaves in one sparse Merkle tree. Bindings must not share a preimage layout, so a mail leaf cannot collide with a certificate leaf for the same name.

The public page shows both. It does not add them. It does not average them. It does not produce a badge. Anyone building an application on top may interpret the fields. Folding them into a single number is that application's choice, and it is not this protocol.

## Anyone can check

Each trace is a leaf. Roots are published on-chain, outside this operator, so a different past cannot be swapped in quietly. A checker recomputes inclusion against that root: leaf hash, index, sibling hashes, published root. Verification does not require contacting this operator.

Mail leaves can be opened further. The operator stores the received wrapper and a DNS snapshot of the DKIM key at ingest. A checker hashes the stored bytes against the leaf, and checks that the key was on record. That is not a claim that this operator is honest about availability. Roots attest inclusion, not that the bytes will still be served tomorrow.

## Two clocks

Registration is how long the name has existed. Confirmed since is how long this record has been accumulating traces. They are never collapsed.

A name eight years old that connected today has a long registration clock and a confirmed-since clock of zero. That is expected. Seizing DNS inherits the registration date and none of the mail clock. Mixing the two would let a hijacker borrow yesterday.

## What the page shows

The page is boring on purpose. How long independent mail reporters have been confirming the name. How many reports. From which organizations. When a covering certificate first appeared. Clocks, reports, organizations, certificate dates. No score. No badge. No verdict.

## What it is not

Not KYC. Not a claim that a name is legitimate. Not an HTTPS badge. Not a personal credential. Not a replacement for registries or credit bureaus. Not a document-authentication protocol — it answers what independently confirmed history has been published for a domain, not whether a particular message or attachment is authentic.

Judgement stays outside.

## What is true today

Roots are on Base Sepolia — testnet, a permissioned publisher. This operator holds the leaves. Roots attest inclusion, not availability.

That is the honest limit. The thesis does not wait on mainnet. The feeds, the tree, and the public page already exist. Anyone can recheck what is published.

PACT — Provenance of Accumulated Checkable Traces.

we build real is the movement. PACT is the open protocol. The first reference implementation is this site.
`.trim();
