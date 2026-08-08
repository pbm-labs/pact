# PACT Protocol — Documentation

**Public brand:** we build real  
**Protocol:** PACT  
**App:** https://pact.pbm-labs.com  
**Intake:** `rua@pact.pbm-labs.com`

Ops setup (DNS, Supabase, Worker deploy, OAuth): root [README.md](../README.md).

---

## Specs (aligned with this repo)

| Document | Role |
|----------|------|
| [pact_protocol_v01.md](pact_protocol_v01.md) | **Normative** for trust score (`pact-score-0.1`), two-clock model, display mapping (`pact-display-0.1`) |
| [pact_protocol_v02.md](pact_protocol_v02.md) | **Reference** for Merkle tree, leaf encoding, reporter allowlist, provisional/activated semantics. Trust-score formula in this file is **not** shipped — use v0.1 |

Implementation: `packages/pact-core/`, `workers/ingest/`, `apps/web/`, `supabase/schema.sql`.

---

## Live product (not duplicated here)

| Surface | Source of truth |
|---------|-----------------|
| Manifesto + UI copy | `apps/web/src/lib/i18n/dictionaries/` (EN/ES/DE/FR) + homepage video |
| Whitepaper | GitHub [`pbm-labs/pact-protocol`](https://github.com/pbm-labs/pact-protocol/blob/main/white-paper.md) · on-site `/whitepaper` |
| Connect | `/how-it-works` (Cloudflare / manual / existing tool); `/connect` redirects |
| Status labels | Building / Proven (history-first scores) |
| Terms / Privacy | `/terms`, `/privacy` |

---

## Phase status

| Phase | Status |
|-------|--------|
| **0a** — ingest → leaves → public record (staging roots) | **Live** |
| **0b** — anchor roots on Base | Not started |
