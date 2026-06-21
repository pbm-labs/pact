# PACT Protocol — Documentation

**Reference domain:** `pbm-labs.com`  
**PACT app:** `https://pact.pbm-labs.com`  
**Intake address:** `rua@pact.pbm-labs.com`  
**Live staging page:** `https://pact.pbm-labs.com/domain/pbm-labs.com`

Operational setup (DNS, Supabase, worker deploy) is in the root [README.md](../README.md).

---

## Protocol specifications

| Document | Description |
|----------|-------------|
| [pact_protocol_v02.md](pact_protocol_v02.md) | **Current** — normative spec (leaf encoding, Merkle tree, trust score, onboarding) |
| [pact_protocol_v01.md](pact_protocol_v01.md) | Superseded by v0.2 — retained for history |

Implementation truth for Phase 0a also lives in `packages/pact-core/` and `supabase/schema.sql`.

---

## Strategy, narrative & external positioning

| Document | Audience |
|----------|----------|
| [pact_mvp_roadmap.md](pact_mvp_roadmap.md) | Internal — MVP phases, infrastructure, success criteria |
| [pact_movement_strategy.md](pact_movement_strategy.md) | Internal — adoption mechanism, signature line, ordinal counter |
| [pact_site_narrative.md](pact_site_narrative.md) | Public — canonical homepage manifesto (long form) |
| [pact_whitepaper.md](pact_whitepaper.md) | External — non-technical overview for compliance / counterparty audiences |
| [pact_fincen_position.md](pact_fincen_position.md) | External — FinCEN / financial institution positioning |
| [pact_fluidrwa_partnership_strategy.md](pact_fluidrwa_partnership_strategy.md) | Internal — FluidRWA integration strategy |
| [pact_build_spec.md](pact_build_spec.md) | Agents — detailed build notes; **verify against repo before use** |

---

## Implementation map (Phase 0a)

```
docs/                  ← you are here
packages/pact-core/    Protocol logic (spec Appendix C, §3, §4)
workers/ingest/        Cloudflare Email Worker + queue → Supabase
apps/web/              Public site (narrative, connect, domain pages) on Cloudflare Workers
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

Cloudflare OAuth redirect URLs (connect + disconnect): root [README.md](../README.md#cloudflare-oauth-connect-and-disconnect).

---

## Phase status (June 2026)

| Phase | Goal | Status |
|-------|------|--------|
| **0a** | Real DMARC → leaves → staging page (no chain) | **Live** — `pbm-labs.com` receiving Google + Microsoft reports; Merkle proofs on domain page; connect/disconnect (Cloudflare + manual) |
| **0b** | Anchor Merkle roots on Base | Not started |
| **Movement** | Counter, ordinal #, signature line | Specified in movement strategy; not built |

---

## Onboarding (MVP reference implementation)

| Path | Friction | Who it's for |
|------|----------|--------------|
| Cloudflare OAuth | Lowest | Domains on Cloudflare DNS |
| Manual DNS | Low | Everyone else (GoDaddy, Namecheap, Route 53 console, etc.) |

Disconnect mirrors both paths at `/disconnect`. Route 53 automation and DMARC-service forwarding are **not** in MVP — see roadmap “What does not get built.”
