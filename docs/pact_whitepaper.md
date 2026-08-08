> **Historical v1.0.**  
> The live whitepaper is **v1.2** at [GitHub `pbm-labs/pact-protocol`](https://github.com/pbm-labs/pact-protocol/blob/main/white-paper.md) and on-site at [`/whitepaper`](https://pact.pbm-labs.com/whitepaper).  
> Do not treat this file as current.

# PACT Protocol
## Provenance Attestation and Chain of Trust

**Version 1.0 — June 2026**  
**protocol@pbm-labs.com**

---

## Abstract

Since 2011, every major email provider has cryptographically signed outbound mail and independently checked the signatures on mail it receives. Every check produces a report, sent to the domain owner roughly once a day, continuously, at global scale, as a routine byproduct of running mail infrastructure. This has been happening for over a decade. Nobody has kept it.

PACT (Provenance Attestation and Chain of Trust) keeps it. The protocol takes these reports, anchors them in a permanent public record, and turns them into a verifiable history of a domain's operational activity — without ever touching message content, recipient identity, or any personal data.

The result is a simple, durable answer to a question nothing else answers well: has this institutional domain actually been operating, continuously, at the scale it claims — not according to its own claims, but according to infrastructure it does not control.

---

## 1. A Decade of Discarded Proof

### 1.1 What Already Happens, Invisibly

Every institutional domain that sends email signs it using DKIM, a signing standard in place since 2011. Every receiving mail provider — Gmail, Outlook, Yahoo, and hundreds of others — checks that signature on its own. The check produces a result: valid or not.

DMARC, a companion standard, takes this one step further. Each receiving provider that performs a check also sends the domain owner a report summarizing what it saw: how many messages, from where, with what result, over what period. This happens automatically, for almost any domain that sends real volumes of email, whether anyone is reading the reports or not.

### 1.2 Why It Has Gone Unused

Domain owners use these reports for one narrow purpose: tuning their own mail policy. Is someone sending unauthorized mail using our name? Should we be stricter? Once that question is answered, the report is discarded.

Nobody has treated the report itself as a record worth keeping. A single report only proves that one provider checked one domain's mail on one day — not interesting by itself. But hundreds of these reports, from independent providers, kept continuously over years, are something else entirely: an outside, third-party account of a domain's activity that nobody built on purpose and nobody can rewrite after the fact.

That accumulated record is what PACT keeps.

### 1.3 The Question Nothing Else Answers

There is no good existing way to verify, with evidence instead of a claim: has this domain been operating, at this scale, continuously, for as long as it says?

A company's own materials say what the company wants known. A domain's registration date says only when it was created, not what has happened since. Checking incorporation papers confirms paperwork exists, not that anything real is still happening behind it. None of these draw on a source the subject doesn't control. The mail reports do — which is exactly why they are hard to fake and why nobody has used them this way.

---

## 2. How It Works

### 2.1 Connecting a Domain

A domain connects to PACT by adding one address to one line in its existing DNS settings. Nothing else changes — no software, no new process, no change in how the domain sends mail. The same reports that were already being generated now also go to PACT.

### 2.2 Turning Reports Into a Record

Each report contains only authentication metadata: which domain, what period, how many messages passed or failed, which infrastructure sent them. It contains nothing about what any message said or who received it.

PACT extracts that metadata, discards the original report immediately, and adds the result to a permanent, tamper-evident record. Once a day, that record is sealed and published publicly. After publication, nothing in it can be changed, backdated, or removed.

### 2.3 Checking It Yourself

Anyone can check any domain's record without asking PACT for permission or access. The published record is public. Checking it requires nothing more than reading it.

A trust record that requires trusting whoever runs it isn't really a trust record. PACT is built so it doesn't need to be trusted — only checked.

---

## 3. Turning History Into a Score

### 3.1 Earned, Not Granted

PACT calculates a trust score for each connected domain from its accumulated history. Nobody assigns this score. Nobody grants it. It is simply the mathematical result of activity that hundreds of independent mail providers have already certified, on their own, over time.

### 3.2 Three Ingredients

**Volume** — how much authenticated mail, scaled so that raw traffic doesn't dominate. Sending more does not proportionally increase the score.

**Diversity** — how many independent providers have verified this domain's mail, not just one. A domain confirmed by hundreds of separate providers scores higher than one confirmed by only a handful.

**Maturity** — how long this has been going on. The score grows toward its ceiling over roughly two years and cannot be rushed. A domain trying to imitate one with years of history faces a gap that no amount of traffic can close quickly.

### 3.3 Maturity Isn't the Whole Picture

Maturity alone unfairly penalizes new, legitimate organizations. A well-funded company three months old will score below an inactive ten-year-old domain — even though the newer one is clearly more credible in practice.

So PACT also tracks how a domain is growing, not just how long it has existed. Growth that is gradual and spread across many independent providers looks different from growth that spikes suddenly through one narrow channel. A new domain growing the first way is a different signal than one growing the second way, even at identical age. PACT reports both age and growth pattern — it does not collapse them into one number.

### 3.4 The Score Is a Measurement, Not a Verdict

PACT reports a number. Whoever uses it decides what threshold matters for their own purpose — a bank's onboarding process needs a different bar than a vendor checklist. PACT doesn't set that bar. It just makes the underlying fact checkable.

---

## 4. Privacy, by Design Rather Than by Promise

PACT's privacy guarantee isn't a policy choice — it's a structural fact. The reports PACT reads contain no personal data, so none ever enters the system. PACT never sees message content, never sees who sent or received anything, and never stores anything beyond domain-level activity counts.

The published record shows a domain name, a time period, and aggregate counts. Nothing in it reveals what was said, to whom, or by whom personally. Domain names are not personal data under privacy law in the EU, UK, or US, so this approach sits outside the kinds of data rules that complicate most verification systems.

---

## 5. Why the History Is Hard to Fake

### 5.1 The Mechanism Already Exists

Keeping up authenticated mail at real volume requires a working domain, properly configured signing, and continuous, genuine delivery to real recipients — recipients whose mail providers independently confirm that delivery on their own. Those providers have no relationship with PACT and no reason to coordinate with each other. Their independence is exactly what makes the resulting record meaningful. PACT didn't invent this. It just started keeping the record.

### 5.2 Why Faking It Doesn't Work

To manufacture a high score dishonestly, someone would need to send authenticated mail at real volume, for years, through infrastructure that survives the spam filters of every major provider it touches, reaching hundreds of independent recipients the whole time. That isn't a shortcut — it's the actual cost of being legitimate. The history is hard to fake because faking it costs about the same as not faking it.

### 5.3 A Stolen Domain Doesn't Keep Its Score Forever

This protects against someone building fake history from nothing. It does not, by itself, protect against someone who takes over a domain that already has real history — by hijacking its DNS or its registrar account. Without a safeguard, that person would simply inherit the score along with the domain.

So PACT keeps watching, not just recording. Each domain's usual sending pattern — which servers, which signing setup, which providers see its mail — is tracked as a baseline. A takeover usually breaks that pattern abruptly. When it does, the score is automatically discounted until the new pattern either settles into something consistent or the domain owner confirms the change was intentional. History earns trust. It doesn't grant it forever, no matter what happens next.

---

## 6. The FICO Score for Institutional Domains

There's already a model for what this is, just applied to people instead of domains.

A credit score is calculated by an outside party, not by the person it describes. It comes from behavior — payment history — not from what the person says about themselves. Banks, landlords, and lenders trust the score, not the person, and they all rely on the same one without ever talking to each other. Most people who use a credit score every day never stop to ask who calculates it or why it works.

PACT is that, for domains instead of people, using mail authentication history instead of payment history. The score comes from outside observers — mail providers — not from the domain itself. Anyone who needs to answer "is this real and ongoing" can use the same score without coordinating with anyone else, and without trusting the domain's own claims about itself.

The difference is that nobody had to build the underlying data collection for credit scores — banks already reported payments for their own reasons. PACT works the same way: mail providers were already generating these reports for their own reasons, long before anyone thought to use them this way.

---

## 7. Who This Is For

PACT answers one question for anyone who currently has no good way to answer it: is this domain's activity real and ongoing?

That's useful to a bank deciding whether to open an account, a company deciding whether to trust a new vendor, an insurer assessing how seriously an applicant takes its own infrastructure, and a marketplace trying to tell an established business apart from one that didn't exist last month. It's also useful to anything — automated or not — that needs to check an unfamiliar party's legitimacy without relying only on what that party says about itself.

---

## 8. What's Built on Top

The protocol itself stays narrow on purpose: domain-level history, nothing else. What gets built on top of it can go further, as long as it stays separate.

A reporting layer can package a domain's history into something portable enough to attach to an onboarding form or a compliance file. A monitoring layer can watch for the kind of sudden changes described in Section 5.3 and alert someone when they happen. A document-checking layer can let a person voluntarily verify one specific email they've received — but only with their explicit say-so each time, never automatically.

The line is firm: the protocol itself never looks at anything beyond domain-level activity. Anything that needs more than that is a separate tool, with its own rules, built on top — not part of PACT itself.

---

## 9. Where This Stands Today

PACT is still early — the design is settled, the first working version is in progress. The goal for that first version is simple: a public page for a real domain, showing a real score, backed by real reports, that anyone can check without asking permission.

The system is meant to outgrow its own operator. It starts running as one implementation, but it's built so that anyone could run an equivalent one, and so that checking a published result never requires trusting whoever published it.

---

*PACT — Provenance Attestation and Chain of Trust*  
*Whitepaper v1.0 — June 2026*  
*protocol@pbm-labs.com*
