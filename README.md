# we build real

**we build real** is a movement for verifiable history.  
**PACT** is an open protocol (Provenance Attestation and Chain of Trust).  
**PBM Labs LLC** provides the first reference implementation, hosted at [webuildreal.dev](https://webuildreal.dev).

This repo is that reference implementation: domain provenance from DMARC aggregate reports. Connect UX lives at [`/connect`](https://webuildreal.dev/connect).

Protocol specification: [docs/pact_protocol.md](docs/pact_protocol.md).  
Whitepaper: [pbm-labs/pact-protocol](https://github.com/pbm-labs/pact-protocol/blob/main/white-paper.md).

The manifesto video under `apps/web/public/` is ~11MB and tracked in git; prefer R2/CDN for future media updates.

**Movement:** [we build real](https://webuildreal.dev)  
**Intake:** `rua@pact.webuildreal.dev`  
**Contact:** `hello@pbm-labs.com`  
**First reference implementation:** PBM Labs LLC  
**Legacy intake (still reaches ingest):** `rua@pact.pbm-labs.com`

## Monorepo structure

```
packages/pact-core   Protocol logic (leaf, merkle, trust, dmarc parser)
packages/contracts   Foundry — PactRoots (spec §9). Base Sepolia deployed; mainnet not.
apps/web             Next.js public record (webuildreal.dev)
workers/ingest       Cloudflare Email Worker + queue → D1 ledger + on-chain publishRoot
docs/                Protocol specification
```

## Quick start

```bash
pnpm install
pnpm test                         # pact-core unit tests
pnpm --filter @pact/core build
pnpm dev:web                      # http://localhost:3000
pnpm deploy:web                   # Cloudflare Workers (webuildreal.dev)
pnpm deploy:ingest                # Email ingest + ledger API (ledger.webuildreal.dev)
```

## Environment

All secrets stay in **repo-root `.env.local`** (gitignored). Never commit it.

```bash
cp .env.example .env.local
# fill in LEDGER_URL, Cloudflare OAuth, CONNECT_STATE_SECRET, etc.
```

Used by `pnpm dev:web` and (via wrangler secrets) the Workers.

| Variable | Used by |
|----------|---------|
| `LEDGER_URL` | Web app — ingest HTTP API (`https://ledger.webuildreal.dev` in prod) |
| `LEDGER_WRITE_SECRET` | Web + ingest — Bearer token for `POST /v1/domains` |
| `PUBLISHER_PRIVATE_KEY` | Ingest — `PactRoots` owner key (Sepolia) |
| `CLOUDFLARE_OAUTH_CLIENT_ID`, `CLOUDFLARE_OAUTH_CLIENT_SECRET` | `/connect` Cloudflare connect |
| `NEXT_PUBLIC_APP_URL` | App URL (`https://webuildreal.dev` in prod) |
| `CONNECT_STATE_SECRET` | HMAC for OAuth state |

Cloudflare Worker production secrets:

```bash
cd workers/ingest && npx wrangler secret put PUBLISHER_PRIVATE_KEY
cd workers/ingest && npx wrangler secret put LEDGER_WRITE_SECRET
cd apps/web && npx wrangler secret put LEDGER_WRITE_SECRET
cd apps/web && npx wrangler secret put CLOUDFLARE_OAUTH_CLIENT_ID
cd apps/web && npx wrangler secret put CLOUDFLARE_OAUTH_CLIENT_SECRET
cd apps/web && npx wrangler secret put CONNECT_STATE_SECRET
```

`LEDGER_URL` is a wrangler **var** on `pact-web` (not a secret): `https://ledger.webuildreal.dev`.

Local Cloudflare preview: `cp apps/web/.dev.vars.example apps/web/.dev.vars`

D1 schema (once, after creating `pact-ledger`):

```bash
cd workers/ingest
npx wrangler d1 execute pact-ledger --remote --file=src/schema.sql
```

### Cloudflare OAuth (`/connect`)

OAuth is pinned to `webuildreal.dev` only (`redirect_uri` + Client URL). Do not use `pact.pbm-labs.com` for the OAuth client.

1. Cloudflare dashboard → **Manage Account → OAuth clients → Edit client**
2. Redirect URL: `https://webuildreal.dev/api/connect/cloudflare/callback`
3. Client URL: `https://webuildreal.dev` (HTTPS required; verify with publisher TXT on the apex)
4. **Logo URL:** `https://webuildreal.dev/we-build-real-logo.png` (hosted in `apps/web/public/`)
5. Add the publisher TXT from the OAuth client page as an apex TXT on `webuildreal.dev`
6. Promote to **public** after domain verification (required for external users)
7. Put client ID and secret in `.env.local` and Worker secrets (see `.env.example`)

Optional: `CLOUDFLARE_OAUTH_SCOPES`, `CONNECT_STATE_SECRET` — see `.env.example`.

### Manual DNS connect

Copy the `_dmarc` snippet on `/connect`, update DNS at any provider. Works for GoDaddy, Namecheap, Google Domains, Route 53 console, etc. Manual and existing-tool paths do **not** submit a domain on the site — the ingest worker auto-creates the domain row on the first valid aggregate report.

## Hostnames

| Host | Role |
|------|------|
| `webuildreal.dev` / `www` | we build real movement + first PACT reference app (`pact-web` Worker) |
| `ledger.webuildreal.dev` | Public ledger HTTP API (`pact-ingest`) |
| `hello@pbm-labs.com` | Legal / operator contact (PBM Labs LLC) |
| `rua@pact.webuildreal.dev` | DMARC intake (canonical) |
| `rua@pact.pbm-labs.com` | Legacy DMARC intake (still has Cloudflare MX) |
| `pact.pbm-labs.com` (HTTP) | No app — DNS `A 192.0.2.1` proxied only for legacy MX / `rua@` mail |

Apply primary DNS in Cloudflare on the `webuildreal.dev` zone. Legacy `pact.pbm-labs.com` intake stays on the PBM Labs LLC zone only for backward compatibility.

## DNS (webuildreal.dev)

| Record | Purpose |
|--------|---------|
| Apex `A` proxied | Worker placeholder for `pact-web` |
| `www` CNAME → `webuildreal.dev` proxied | www → apex |
| Apex MX `mail.protonmail.ch` / `mailsec.protonmail.ch` | Proton (`hello@`) |
| TXT `@` SPF `v=spf1 include:_spf.protonmail.ch ~all` | Proton sending |
| CNAME `protonmail[123]._domainkey` | Proton DKIM |
| TXT `@` `cloudflare_oauth_client_publisher=…` | OAuth client URL verification |
| TXT `_dmarc` `rua=mailto:rua@pact.webuildreal.dev` | Zone’s own DMARC + PACT intake |
| `pact` MX → `route*.mx.cloudflare.net` | Email Routing for DMARC intake |
| `pact` TXT SPF | Cloudflare Email Routing |
| TXT `_report._dmarc.pact` `v=DMARC1` | Authorize external reports to canonical rua |
| Email Routing rule | `rua@pact.webuildreal.dev` → Worker `pact-ingest` |

Worker routes: `webuildreal.dev/*`, `www.webuildreal.dev/*` (`apps/web/wrangler.jsonc`); `ledger.webuildreal.dev` (`workers/ingest/wrangler.toml`).

## DNS (legacy `pact.pbm-labs.com` only)

Kept solely so existing DMARC records that still point at `rua@pact.pbm-labs.com` keep working. Not a public brand surface.

| Record | Purpose |
|--------|---------|
| `pact` MX → `route*.mx.cloudflare.net` | Legacy DMARC mail intake |
| `pact` proxied `A 192.0.2.1` | Needed alongside MX (not an app host) |
| `pact` TXT SPF | Cloudflare Email Routing |
| `_report._dmarc.pact` TXT `v=DMARC1` | Authorize external reports to legacy rua |

Do **not** keep OAuth publisher TXT on `pact.pbm-labs.com` — publisher verification lives on `webuildreal.dev` only.

## Email

| Address | MX | Handler |
|---------|-----|---------|
| `hello@pbm-labs.com` | PBM Labs LLC | Legal / operator inbox |
| `hello@webuildreal.dev` | Proton (apex) | Movement domain only — not a legal inbox |
| `rua@pact.webuildreal.dev` | `route*.mx.cloudflare.net` | `pact-ingest` (canonical) |
| `rua@pact.pbm-labs.com` | `route*.mx.cloudflare.net` | `pact-ingest` (legacy) |

### 1. Proton — `webuildreal.dev`

In [Proton Mail](https://mail.proton.me) → **Settings → Domain names** → add `webuildreal.dev` and publish the MX / SPF / DKIM / verification TXT Proton shows.

### 2. Cloudflare Email Routing — rules

**`webuildreal.dev`**

| Custom address | Action |
|----------------|--------|
| `rua@pact.webuildreal.dev` | **Send to Worker** → `pact-ingest` |

Legal contact is `hello@pbm-labs.com` (PBM Labs LLC). Keep `webuildreal.dev` apex MX on Proton if that mailbox still exists; it is not the legal inbox. Do not put Cloudflare Email Routing MX on the apex.

**Legacy (PBM Labs LLC zone)**

| Custom address | Action |
|----------------|--------|
| `rua@pact.pbm-labs.com` | **Send to Worker** → `pact-ingest` |

### 3. Verify

```bash
dig @1.1.1.1 MX webuildreal.dev +short              # mail.protonmail.ch
dig @1.1.1.1 MX pact.webuildreal.dev +short         # route*.mx.cloudflare.net
dig @1.1.1.1 MX pact.pbm-labs.com +short            # legacy rua MX
dig @1.1.1.1 TXT _dmarc.webuildreal.dev +short       # rua@pact.webuildreal.dev
dig @1.1.1.1 TXT webuildreal.dev +short | grep oauth # publisher TXT
curl -sI https://webuildreal.dev/ | head -1         # app
curl -s https://ledger.webuildreal.dev/v1/health    # ledger API
# pact.pbm-labs.com has no Worker route — HTTP is not the app (mail MX remains)
```

Send test to `hello@webuildreal.dev` → Proton on the movement domain (not the legal inbox).  
Legal / operator contact is `hello@pbm-labs.com`.  
New DMARC reports must use `rua@pact.webuildreal.dev` → worker (~24–48h). `rua@pact.pbm-labs.com` still reaches ingest. `rua@webuildreal.dev` does not (apex MX is Proton).

## Deploy PACT web app

```bash
pnpm deploy:web   # webuildreal.dev (+ www) — see apps/web/wrangler.jsonc
```

## Deploy ingest worker

```bash
cd workers/ingest
npx wrangler login                          # once
npx wrangler queues create pact-reports     # once
npx wrangler d1 create pact-ledger          # once; put database_id in wrangler.toml
npx wrangler d1 execute pact-ledger --remote --file=src/schema.sql
npx wrangler secret put PUBLISHER_PRIVATE_KEY
npx wrangler secret put LEDGER_WRITE_SECRET
pnpm run deploy                             # not `pnpm deploy`
```

Worker flow: email handler → `pact-reports` queue → parse/auth/dedup → D1 leaf → `publishRoot` on Base Sepolia `PactRoots`.

Google DMARC reports arrive as **ZIP** attachments (`application/zip`); the ingest worker must unzip before parsing XML.

Public ledger API (CORS open for GET):

| Method | Path | Notes |
|--------|------|--------|
| GET | `/v1/health` | Contract address + chain |
| GET | `/v1/root` | Latest on-chain root |
| GET | `/v1/domains` | Domains + leaf summaries |
| GET | `/v1/domains/:domain` | Domain, leaves, global hashes, on-chain root |
| POST | `/v1/domains` | Bearer `LEDGER_WRITE_SECRET` |

## Testing

| Method | What it tests |
|--------|----------------|
| `pnpm test` | pact-core and web unit tests |
| `forge test` (in `packages/contracts`) | PactRoots (Merkle root publication) |
| Send mail to `hello@pbm-labs.com` | PBM Labs LLC operator inbox |
| Wait ~24–48h | **Real** Google/Microsoft DMARC reports |

Real reports must pass wrapper DKIM whose `d=` matches the reporter (or an allowlisted forwarder), plus the `org_name` / envelope-from allowlist. Resend/test mail is rejected — that is intentional.

## Checklist

**Intake**
- [x] `webuildreal.dev` DNS: `_dmarc`, `_report._dmarc.pact`, MX/SPF/DKIM, OAuth publisher TXT
- [x] Email Routing `rua@pact.webuildreal.dev` → `pact-ingest`
- [x] Legacy `rua@pact.pbm-labs.com` still routed for existing DMARC records
- [x] Worker deployed with D1 + queue + publisher key

**Public record**
- [x] Parser, dedup, leaves
- [x] Public page at `/records/{domain}` on `webuildreal.dev`
- [x] Cloudflare OAuth + manual DNS + existing-tool path (`/connect`)
- [x] OAuth client on `webuildreal.dev` (callback + publisher TXT)
- [x] Legacy `pact.pbm-labs.com` kept for mail only (no HTTP app route)
- [x] Merkle inclusion proofs on `/records/{domain}`
- [ ] End-to-end with live reporter data after D1 cutover (`webuildreal.dev`)

**On-chain (boundary 1)**
- [x] Deploy `PactRoots` on Base Sepolia (`0x873e76897BC3Fe8EBdfa67cb73404dA75B2d64ee`)
- [ ] First `publishRoot` from ingest after a real leaf
- [ ] Base mainnet

**Reporter mail (boundary 2)**
- [x] DKIM-verify of Gmail/Microsoft wrapper mail (fail closed; forwarding-agent DKIM is weaker than the reporter's own signature)
- [x] Wrapper witness in the leaf (`d=` / selector + keccak256 of the RFC822; RFC822 not published)

## Protocol implementation

| Module | Spec reference |
|--------|----------------|
| Leaf encoding | [Appendix C](docs/pact_protocol.md) |
| Sparse Merkle | [§3.3.1](docs/pact_protocol.md) (32 levels) |
| On-chain roots | `PactRoots` — [§9](docs/pact_protocol.md). Base Sepolia: [`0x873e76897BC3Fe8EBdfa67cb73404dA75B2d64ee`](https://sepolia.basescan.org/address/0x873e76897BC3Fe8EBdfa67cb73404dA75B2d64ee) |
| Trust score (raw) | `pact-score-0.1` — [§4.3](docs/pact_protocol.md) |
| Trust score (display) | `pact-display-0.1` — [§4.6](docs/pact_protocol.md) |
| Allowlist + wrapper DKIM | §3.1.1 seed in `packages/pact-core/src/auth/allowlist.ts`; ingest verifies RFC 6376 on the wrapper, then commits keccak256(RFC822) + passing `d=`/`s=` in the leaf (Appendix C.5). The RFC822 is not stored. |

## License

**PACT** is an open protocol — freely implementable.  
**we build real** is the movement.  
**PBM Labs LLC** provides the first reference implementation (this repo).
