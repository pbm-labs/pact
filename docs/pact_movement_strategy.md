# PACT Protocol — Movement Strategy & Specification
**PBM Labs LLC**
**June 2026 — Internal Working Document**
**Companion to: `pact_mvp_roadmap.md`**

> **NOT SHIPPED.** Ordinal counter and signature-line distribution are specified here but not built. Manifesto SSOT is `apps/web/src/lib/i18n/dictionaries/` (not narrative markdown in this folder). Public brand on the site is **“we build real”**; protocol name remains PACT.

---

## Purpose of This Document

The MVP roadmap describes how PACT Protocol gets built. This document describes how PACT Protocol gets adopted without PBM Labs pushing it domain by domain.

A protocol cannot out-sell its way to network effects. Every protocol that reached internet-scale adoption — HTTPS, DKIM itself, even email — did so because the adoption mechanism was structurally embedded in something people were already doing, not because someone convinced them one at a time. This document specifies that mechanism for PACT: a self-propagating movement, not a sales motion.

This is a refactor input for the MVP roadmap. Sections marked **[BUILD]** describe components that should be added to the MVP build sequence. Sections marked **[NARRATIVE]** describe positioning and language that should be carried consistently across every surface — the public site, onboarding flow, outreach, and the whitepaper.

---

## 1. The Strategic Problem This Solves

### 1.1 Why Outreach Alone Fails

A startup cannot manually convince enough domains to connect to reach the volume and diversity that the trust score formula requires. Direct outreach — to domain owners, to DMARC service providers, to enterprises — is linear: each connection costs roughly the same effort as the last. At that rate, reaching meaningful network density takes years and a sales team PBM Labs does not have.

### 1.2 The Asymmetry PACT Has That Most Protocols Don't

PACT has one property almost no early-stage protocol has: the data it needs already exists, is already being generated for free, and the only friction is telling existing infrastructure where to also send a copy. This means the adoption bottleneck is not technical — it's attention and motivation. Solving for attention and motivation is a movement problem, not an engineering problem.

### 1.3 The Adoption Pattern That Actually Works

Protocols and tools that spread without a sales force share one mechanism: the act of using the thing already exposes other people to it, without the user doing anything extra. Hotmail's "Get your free email" footer rode on emails people were already sending. Calendly spreads through links people were already sharing to schedule meetings. The product's normal use *is* the distribution channel.

For PACT, the equivalent is: a connected domain's outbound email becomes, automatically, the thing that exposes every recipient to PACT. No domain has to promote anything. Sending email — which every business already does, constantly — becomes the distribution mechanism.

---

## 2. The Movement — Narrative Cornerstone

### 2.1 The Core Insight **[NARRATIVE]**

The internet was built in 1983 without any native way to verify who anyone really was. This was not an oversight — at the time, every node on the network already knew every other node. Identity verification wasn't a missing feature; it was a non-problem in a closed network of mutually known participants.

That world ended decades ago. The layer that was never built because it was never needed is still missing. PACT is not fixing something that broke. It is completing something that was never finished, using a mechanism — email authentication — that has quietly existed in parallel for over a decade without anyone using it for this purpose.

This framing matters because it changes what joining the movement *means* to a participant. "Fixing a broken thing" is defensive and remedial. "Completing something unfinished since the beginning" is cornerstone and historic. The second framing produces willing participants; the first produces, at best, compliant ones.

### 2.2 The Name **[NARRATIVE]**

**Building the Trust Layer.**

Not "The Trust Layer" alone — that names a destination, which invites observation rather than participation. "Building" makes every connected domain an active participant in something in progress, not a user of something finished. This is the difference between a credential and a membership.

### 2.3 Three Lengths of the Same Message **[NARRATIVE]**

The narrative must compress correctly at three different lengths, used in three different contexts, while remaining recognizably the same voice.

**Long form** — the manifesto. This is the actual copy that goes live on the public site, word for word, as the first thing a visitor reads. It contains no technical language, no mention of DNS, DKIM, or how to connect — that lives separately, lower on the same page, as the next step after someone has read this and wants to act.

> **Canonical source:** `pact_site_narrative.md`. That file is the single source of truth for this text — do not duplicate it here. If the manifesto is revised, update it there first; this document only references it.

**[BUILD note]** The text in `pact_site_narrative.md` is the entire content above the fold on the public homepage (`pact.pbm-labs.com` root). The connect flow, the movement counter, and any technical explanation appear below it, after the reader has finished — never interleaved with it.

**Medium form** — for onboarding emails, launch announcements, LinkedIn posts:

> Every layer of the internet was built except one: knowing who's real.
>
> We're building it now — not fixing something broken, completing something that was never finished.
>
> Add your domain. Be part of the cornerstone the internet was always missing.

**Short form** — for the badge, the email signature line, anywhere space is under a sentence:

> The internet never had a way to know who's real. We're building the cornerstone. Join us.

The short form is the most important of the three. It is the one that will travel furthest once it starts appearing in outbound email at scale, and it must work standalone, with zero context, for someone who has never heard of PACT before encountering it in someone else's email.

---

## 3. The Distribution Mechanism — Email as the Vector

### 3.1 The Mechanism **[BUILD]**

A connected domain's outbound email carries a small, automatically appended line referencing the movement and the domain's PACT status. Every email that domain sends — to existing customers, prospects, vendors, anyone — becomes a single, low-friction exposure of PACT to a new recipient who did nothing to opt into seeing it.

This is structurally identical to how a Calendly link or a "Sent from my iPhone" signature propagates: the tool's normal use distributes the tool, with zero additional behavior required from the person sending it beyond having already adopted it once.

### 3.2 What The Sender Sees

When a connected domain composes any outbound email, an opt-in signature line is available (not forced — see Section 3.4 on consent):

```
[Movement short-form line]
[Domain]'s status: Building the Trust Layer — domain #[N]
[Verify →]
```

### 3.3 What The Recipient Sees and Does

The recipient reads the line in the normal course of reading an email they were already going to read. No click is required for exposure to occur — exposure is the act of reading the email. A click is optional, and leads to the public PACT page for that domain, which carries the long-form narrative and the connect flow for the recipient's own domain if they don't yet have one.

This means the funnel has a zero-effort top of funnel (every email sent by every connected domain) and an opt-in next step (click to learn more, click to connect). No domain is required to do anything beyond connecting once.

### 3.4 Consent and Tone Discipline **[NARRATIVE + BUILD]**

The signature line is opt-in per domain, set once at connection time, not forced by the protocol or injected without the domain's knowledge. A domain that connects to PACT can enable or disable the signature line independently of being connected — connection and advertisement are separate decisions. This preserves the protocol's structural credibility: PACT does not inject anything into anyone's email without explicit configuration by the email's own sender.

The line must never read as a security certification badge ("✓ Verified") and must always read as participation in something collective. A checkmark icon implies an authority granted approval. A hammer, a building icon, or simply the words "Building the Trust Layer" implies the sender is one of many constructing something — which is the correct frame per Section 2.

---

## 4. The Public Counter and Ordinal Status

### 4.1 The Mechanism **[BUILD]**

The public PACT site (already specified in the MVP roadmap as `pact.pbm-labs.com/domain/{domain}`) gains a second public surface: a movement-level counter, not domain-specific, showing the running total of connected domains and framing it in the movement's language:

```
2,847 domains are building the Trust Layer —
the cornerstone the internet was missing since 1983.

You could be #2,848.
```

### 4.2 Why Ordinal Position Matters

Each connected domain receives a permanent, non-decaying ordinal number — the order in which it joined. Unlike a trust score, which changes over time, the ordinal number is fixed forever. "Domain #847" means something different and more durable than "current trust score: 6.2" — it is a historical fact about when this domain chose to participate, comparable to early membership numbers in any community, professional body, or platform.

This single number does three things simultaneously: it rewards early adopters permanently regardless of how large the network later becomes, it creates urgency for hesitant adopters (the number only grows, never available retroactively), and it gives every connected domain something concrete and personal to put in their signature line and share externally.

### 4.3 No Economic Reward, By Design **[NARRATIVE]**

There is no monetary incentive anywhere in this mechanism — no donation, no payment, no credit. This is a deliberate choice, not a placeholder for a future paid incentive. A monetary incentive turns connection into a transaction, which invites evaluation, scrutiny, and skepticism about hidden costs or conditions. A non-monetary, belonging-based incentive — status, ordinal position, participation in something historic — invites association instead of evaluation. The absence of money is the credibility, not a limitation to be patched later.

---

## 5. Sequencing — How This Fits the Existing MVP Roadmap

This does not replace the MVP roadmap's existing phases (MVP core protocol → V1 PACT Chain → V2 PACT Signal → V3 PACT Proof). It runs as a parallel narrative and distribution layer that should be present from MVP launch, not bolted on later — because the first domains to connect are the ones who get the lowest ordinal numbers, and that scarcity is most valuable if it exists from day one.

### 5.1 Recommended Build Additions

```
ADD TO MVP (Weeks 1–8, alongside existing scope)

  — Movement counter on the public site:
    total connected domains + ordinal position
    per domain. Simple read from the existing
    domain_stats table (connection order = row
    insertion order; no new infrastructure needed
    beyond a sequence/ordinal column).

  — Long-form narrative copy on the public
    homepage (pact.pbm-labs.com root, not the
    per-domain page).

  — Opt-in signature line generator: a small
    snippet (HTML email signature block) that
    a connected domain operator can copy into
    their company's email signature tooling.
    No new infrastructure — this is a static
    template populated with the domain's name,
    ordinal number, and a link back to their
    public PACT page.

ADD TO V1 (Months 2–4, alongside PACT Chain)

  — Native integration of the signature line
    into common email signature tools (Gmail
    signature settings export, Outlook signature
    file, HubSpot/Exclaimer template snippets)
    so connected domains don't need to manually
    edit signature HTML.

DEFER (not required for early traction)

  — Browser extension for automatic detection
    of PACT status on inbound email (this remains
    a valid future direction but is not required
    for the movement mechanism to start working —
    the signature line alone is sufficient to start
    the loop).
```

### 5.2 Success Criteria for the Movement Mechanism

```
Week 4 of MVP:  Movement counter live, showing
                real ordinal positions for every
                connected domain, including PBM
                Labs' own.

Week 8 of MVP:  At least one external domain has
                voluntarily added the signature
                line to their outbound email
                without being asked twice.

Month 3:        First instance of a domain
                connecting to PACT because they
                received an email containing the
                signature line from another
                connected domain — i.e., the loop
                has demonstrably closed at least
                once, organically.
```

That last criterion — one domain joining because it saw the line in someone else's email, with no direct outreach from PBM Labs involved — is the signal that the mechanism described in this document is actually working as a self-propagating loop rather than as a feature nobody notices.

---

## 6. What This Document Does Not Cover

This document does not replace or duplicate the technical build specification (`pact_build_spec.md`), the protocol specification (`pact_protocol_v01.md`), or the whitepaper (`pact_whitepaper.md`). It assumes those remain the canonical sources for protocol mechanics, trust score formula, and architectural narrative. This document covers only the adoption mechanism and the language used at every consumer-facing touchpoint.

The outreach strategy to third-party DMARC providers (Postmark, EasyDMARC, etc.), discussed separately, remains a complementary, slower-moving channel and is not superseded by this document — the movement mechanism and direct provider outreach can run in parallel without conflict.

---

*PACT — Building the Trust Layer*
*Movement Strategy & Specification v1.0 — PBM Labs LLC — June 2026*
