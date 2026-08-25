export const LOCAL_WHITEPAPER_MARKDOWN = `
Identifiers are cheap. A domain, a profile, a badge — all of it can be manufactured this afternoon. Yesterday cannot, if someone else was already watching.

PACT is a public record of traces independent systems already emit. Mail systems generate aggregate authentication reports. Browsers already required public certificate logs. Nobody joins a new network. DNS only points the mail feed here. The record publishes what happened. It does not decide what it means.

## Mail and certificates stay apart

Receiving systems — Gmail, Outlook, Yahoo, and others — already report whether authenticated mail showed up, how often, and according to whom. Those reports contain no messages, no inboxes, no people.

Certificate logs already record issuance. A name that appears there has a first-seen date someone else wrote down. A new certificate can be issued in minutes. That is a weak calendar, not proof that HTTPS is trustworthy.

Both sit on the same append-only tree. They are never blended into a score. Applications may interpret the fields. This protocol will not.

## A name gets a record by pointing DNS

Add a report destination so those mail reports are kept. History starts when the first independent report arrives — not when the DNS line is saved. Certificate logs are indexed after the name is on the ledger. There is no second ritual.

## Anyone can check

Each trace is a leaf. Roots are published on-chain, outside this operator, so a different past cannot be swapped in quietly. A checker recomputes inclusion against that root.

Mail leaves carry what arrived: a hash of the report wrapper, and the DKIM key on record. Certificate leaves carry a first-seen date from public logs.

The page is boring on purpose. How long independent mail reporters have been confirming the name. How many reports. From which organizations. When a covering certificate first appeared. No score. No badge. No verdict.

Two clocks stay distinct. Registration is how long the name has existed. Confirmed since is how long this record has been accumulating traces. Seizing DNS inherits none of that mail clock.

## What it is not

Not KYC. Not a claim that a name is legitimate. Not an HTTPS badge. Not a personal credential. Not a replacement for registries or credit bureaus. Judgement stays outside.

## What is true today

Roots are on Base Sepolia — testnet, a permissioned publisher. This operator holds the leaves. Roots attest inclusion, not availability.

That is the honest limit. The thesis does not wait on mainnet.

PACT — Provenance of Accumulated Checkable Traces.
`.trim();
