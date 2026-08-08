# PACT Protocol — Documentation

**Reference domain:** `pbm-labs.com`  
**PACT app:** `https://pact.pbm-labs.com`  
**Intake address:** `rua@pact.pbm-labs.com`  
**Live staging page:** `https://pact.pbm-labs.com/domain/pbm-labs.com`

**Brand:** public site **“we build real”**; protocol name **PACT**.  
**Connect:** primary `/how-it-works` (`/connect` redirects). Paths: Cloudflare OAuth, manual DNS, existing-tool forwarding.  
**Statuses:** history-first UI — **Building** / **Proven**.  
**Legal:** Terms and Privacy on the live site.

Operational setup (DNS, Supabase, worker deploy) is in the root [README.md](../README.md).

---

## Protocol specifications

| Document | Description |
|----------|-------------|
| [pact_protocol_v01.md](pact_protocol_v01.md) | **Normative** — trust score (`pact-score-0.1`), two-clock model (§4.2), onboarding, privacy |
| [pact_protocol_v02.md](pact_protocol_v02.md) | **Historical draft** — Merkle tree, leaf encoding, allowlist; trust score formula superseded by v0.1 |

Implementation truth for Phase 0a also lives in `packages/pact-core/` and `supabase/schema.sql`. Trust score: raw algorithm **`pact-score-0.1`**; human display mapping **`pact-display-0.1`** (Sections 4.5–4.6).

---

## Narrative, whitepaper & brand

| Document / location | Role |
|---------------------|------|
| `apps/web/src/lib/i18n/dictionaries/` (EN/ES/DE/FR) + homepage video | **Manifesto SSOT** — live site copy |
| [pact_site_narrative_final.md](pact_site_narrative_final.md) | **Archival snapshot** — not canonical; do not edit expecting the site to update |
| [pact_site_narrative.md](pact_site_narrative.md) | Stub (superseded pointer) |
| GitHub [`pbm-labs/pact-protocol`](https://github.com/pbm-labs/pact-protocol/blob/main/white-paper.md) + on-site [`/whitepaper`](https://pact.pbm-labs.com/whitepaper) | **Live whitepaper** (v1.2) |
| [pact_whitepaper.md](pact_whitepaper.md) | Historical v1.0 only |

---

## Strategy & archaeology

| Document | Audience |
|----------|----------|
| [pact_mvp_roadmap.md](pact_mvp_roadmap.md) | Internal — MVP phases, infrastructure, success criteria (strategy; verify against repo) |
| [pact_movement_strategy.md](pact_movement_strategy.md) | Internal — adoption mechanism, signature line, ordinal counter (**not shipped**) |
| [pact_build_spec.md](pact_build_spec.md) | **OBSOLETE** — greenfield agent dump; wrong hostnames/deploy/tree; archaeology only |

---

## Implementation map (Phase 0a)

```
docs/                  ← you are here
packages/pact-core/    Protocol logic (spec Appendix C, §3, §4)
workers/ingest/        Cloudflare Email Worker + queue → Supabase
apps/web/              Public site (narrative, how-it-works, domain pages) on Cloudflare Workers
supabase/schema.sql    PostgreSQL schema (single file)
fixtures/              DMARC XML test fixtures
```

---

## DNS records (pbm-labs.com)

| Record | Value |
|--------|-------|
| Apex CNAME | Company site (e.g. Vercel) |
| Apex MX | `mail.protonmail.ch` (Proton — `hello@`, etc.) |
| `pact` subdomain | Worker route `pact.pbm-labs.com` (web) + MX (intake) |
| `_dmarc` TXT | `rua=mailto:rua@pact.pbm-labs.com` + Proton DMARC tags |
| `_report._dmarc.pact` TXT | `v=DMARC1` |
| Email Routing rule | `rua@pact.pbm-labs.com` → Worker `pact-ingest` only |

Full split-mail setup: root [README.md](../README.md#email-split-proton-apex--pact-subdomain).

Cloudflare OAuth redirect URL (connect): root [README.md](../README.md#cloudflare-oauth-connect).

---

## Phase status (June 2026)

| Phase | Goal | Status |
|-------|------|--------|
| **0a** | Real DMARC → leaves → staging page (no chain) | **Live** — `pbm-labs.com` receiving Google + Microsoft reports; Merkle proofs on domain page; connect via `/how-it-works` (Cloudflare + manual + existing tool) |
| **0b** | Anchor Merkle roots on Base | Not started |
| **Movement** | Counter, ordinal #, signature line | Specified in movement strategy; **not built** |

---

## Onboarding (MVP reference implementation)

| Path | Friction | Who it's for |
|------|----------|--------------|
| Cloudflare OAuth | Lowest | Domains on Cloudflare DNS |
| Manual DNS | Low | Everyone else (GoDaddy, Namecheap, Route 53 console, etc.) |
| Existing tool forwarding | Low | Postmark, EasyDMARC, or similar — point reports here |

Primary UI: `/how-it-works` (`/connect` redirects). Route 53 / AWS DNS automation is **deferred**.
