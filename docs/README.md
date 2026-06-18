# PACT Protocol — Documentation

**Reference domain:** `pbm-labs.com`  
**Intake address:** `rua@pact.pbm-labs.com`  
**Staging page:** `/domain/pbm-labs.com` (Next.js app in `apps/web`)

## Protocol specifications

| Document | Description |
|----------|-------------|
| [pact_protocol_v02.md](pact_protocol_v02.md) | **Current** — normative spec (leaf encoding, Merkle tree, trust score, onboarding) |
| [pact_protocol_v01.md](pact_protocol_v01.md) | Superseded by v0.2 — retained for history |

## Strategy & positioning

| Document | Audience |
|----------|----------|
| [pact_mvp_roadmap.md](pact_mvp_roadmap.md) | Internal — Phase 0a/0b build sequence, infrastructure, 30-day plan |
| [pact_fluidrwa_partnership_strategy.md](pact_fluidrwa_partnership_strategy.md) | Internal — FluidRWA integration strategy |
| [pact_fincen_position.md](pact_fincen_position.md) | External — FinCEN / financial institution positioning |

## Implementation map (Phase 0a)

```
docs/                  ← you are here
packages/pact-core/    Protocol logic (spec Appendix C, §3, §4)
workers/ingest/        Cloudflare Email Worker + queue → Supabase
apps/web/              Public domain page
supabase/schema.sql    PostgreSQL schema (single file)
fixtures/              DMARC XML test fixtures
```

Operational setup (DNS, Supabase, worker deploy) is in the root [README.md](../README.md).

## DNS records (pbm-labs.com)

| Record | Value |
|--------|-------|
| Apex MX | `mail.protonmail.ch` (Proton — `hello@`, etc.) |
| `pact` MX | Cloudflare Email Routing (`rua@`) |
| `_dmarc` TXT | `rua=mailto:rua@pact.pbm-labs.com` + Proton DMARC tags |
| `_report._dmarc.pact` TXT | `v=DMARC1` |
| Email Routing rule | `rua@pact.pbm-labs.com` → Worker `pact-ingest` only |

Full split-mail setup: root [README.md](../README.md#email-split-proton-apex--pact-subdomain).

## Phase status

| Phase | Goal | Status |
|-------|------|--------|
| **0a** | Real DMARC → leaves → staging page (no chain) | Infrastructure live; awaiting first real report |
| **0b** | Anchor Merkle roots on Base | Not started |
