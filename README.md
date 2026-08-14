# we build real

**we build real** is a movement for verifiable history.  
**PACT** is an open protocol (Provenance Attestation and Chain of Trust).  
**PBM Labs LLC** provides the first reference implementation, hosted at [webuildreal.dev](https://webuildreal.dev).

This repo is that reference implementation: domain provenance from DMARC aggregate reports. Connect UX lives at [`/connect`](https://webuildreal.dev/connect).

Protocol specs: [docs/pact_protocol_v01.md](docs/pact_protocol_v01.md) (trust score) and [docs/pact_protocol_v02.md](docs/pact_protocol_v02.md) (Merkle / encoding).

The manifesto video under `apps/web/public/` is ~11MB and tracked in git; prefer R2/CDN for future media updates.

**Movement:** [we build real](https://webuildreal.dev)  
**Intake:** `rua@pact.webuildreal.dev`  
**Contact:** `hello@pbm-labs.com`  
**First reference implementation:** PBM Labs LLC  
**Legacy intake (still accepted):** `rua@webuildreal.dev`, `rua@pact.pbm-labs.com`

## Monorepo structure

```
packages/pact-core   Protocol logic (leaf, merkle, trust, dmarc parser)
apps/web             Next.js public domain page (staging banner)
workers/ingest       Cloudflare Email Worker + queue → Supabase
supabase/schema.sql  PostgreSQL schema (single file)
docs/                Protocol specs (v0.1 score, v0.2 Merkle/encoding)
```

## Quick start

```bash
pnpm install
pnpm test                         # pact-core unit tests
pnpm --filter @pact/core build
pnpm dev:web                      # http://localhost:3000
pnpm deploy:web                   # Cloudflare Workers (webuildreal.dev)
```

## Environment

All secrets stay in **repo-root `.env.local`** (gitignored). Never commit it.

```bash
cp .env.example .env.local
# fill in Supabase, Cloudflare OAuth, etc.
```

Used by `pnpm dev:web` and (via wrangler secrets) the Workers.

| Variable | Used by |
|----------|---------|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Web app, worker (via wrangler secrets) |
| `CLOUDFLARE_OAUTH_CLIENT_ID`, `CLOUDFLARE_OAUTH_CLIENT_SECRET` | `/connect` Cloudflare connect |
| `NEXT_PUBLIC_APP_URL` | PACT app URL (`https://webuildreal.dev` in prod) |
| `CONNECT_STATE_SECRET` | Optional HMAC for OAuth state |

Cloudflare Worker production secrets:

```bash
cd workers/ingest && npx wrangler secret put SUPABASE_URL
cd workers/ingest && npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
cd apps/web && npx wrangler secret put SUPABASE_URL
cd apps/web && npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
cd apps/web && npx wrangler secret put CLOUDFLARE_OAUTH_CLIENT_ID
cd apps/web && npx wrangler secret put CLOUDFLARE_OAUTH_CLIENT_SECRET
```

Local Cloudflare preview: `cp apps/web/.dev.vars.example apps/web/.dev.vars`

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

Copy the `_dmarc` snippet on `/connect`, update DNS at any provider. Works for GoDaddy, Namecheap, Google Domains, Route 53 console, etc. Manual and existing-tool paths do **not** submit a domain on the site — the ingest worker auto-creates the domain row on the first valid aggregate report (`insert_leaf`).

**Supabase upgrades** (existing projects): re-run the upgrade block at the bottom of `supabase/schema.sql` in the SQL editor (adds `domain_registered_at` if missing). New domains resolve registration age at connect/ingest time.

## Supabase setup

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Register your domain:

```sql
insert into domains (domain) values ('webuildreal.dev');
```

## Hostnames

| Host | Role |
|------|------|
| `webuildreal.dev` / `www` | we build real movement + first PACT reference app (`pact-web` Worker) |
| `hello@pbm-labs.com` | Legal / operator contact (PBM Labs LLC) |
| `rua@pact.webuildreal.dev` | DMARC intake (canonical) |
| `rua@webuildreal.dev` | Legacy intake — still accepted |
| `rua@pact.pbm-labs.com` | Legacy DMARC intake |
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

Worker routes (`apps/web/wrangler.jsonc`): `webuildreal.dev/*`, `www.webuildreal.dev/*`.

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
| `rua@webuildreal.dev` | — | Legacy; still accepted if a domain still points here |
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
# pact.pbm-labs.com has no Worker route — HTTP is not the app (mail MX remains)
```

Send test to `hello@webuildreal.dev` → Proton on the movement domain (not the legal inbox).  
Legal / operator contact is `hello@pbm-labs.com`.  
New DMARC reports should use `rua@pact.webuildreal.dev` → worker (~24–48h). Legacy rua still accepted.

## Deploy PACT web app

```bash
pnpm deploy:web   # webuildreal.dev (+ www, legacy pact redirect) — see apps/web/wrangler.jsonc
```

## Deploy ingest worker

```bash
cd workers/ingest
npx wrangler login                          # once
npx wrangler queues create pact-reports     # once
echo "https://YOUR_PROJECT_REF.supabase.co" | npx wrangler secret put SUPABASE_URL
echo "YOUR_SERVICE_ROLE_KEY" | npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
pnpm run deploy                             # not `pnpm deploy`
```

Worker flow: email handler → `pact-reports` queue → parse/auth/dedup → `insert_leaf` → staging Merkle root in Supabase.

Google DMARC reports arrive as **ZIP** attachments (`application/zip`); the ingest worker must unzip before parsing XML.

## Testing

| Method | What it tests |
|--------|----------------|
| `pnpm test` | pact-core unit tests (parser, Merkle, trust score) |
| Send mail to `hello@pbm-labs.com` | PBM Labs LLC operator inbox |
| Wait ~24–48h | **Real** Google/Microsoft DMARC reports |

Real reports arrive from allowlisted senders (e.g. `noreply-dmarc-support@google.com`). Resend/test mail is rejected by the reporter allowlist — that is intentional.

To clear simulated / old leaf data:

```sql
delete from merkle_roots;
delete from leaves;
delete from processed_reports;
```

## Phase 0a checklist

**Intake**
- [x] `webuildreal.dev` DNS: `_dmarc`, `_report._dmarc`, MX/SPF/DKIM, OAuth publisher TXT
- [x] Email Routing `rua@webuildreal.dev` → `pact-ingest`
- [x] Legacy `rua@pact.pbm-labs.com` still routed for existing DMARC records
- [x] Worker deployed with Supabase secrets + queue
- [ ] First **real** DMARC report via new intake in Supabase (~24–48h)

**Phase 0a**
- [x] Parser, dedup, leaves, staging roots
- [x] Public page at `/records/{domain}` on `webuildreal.dev`
- [x] Cloudflare OAuth + manual DNS + existing-tool path (`/connect`)
- [x] OAuth client on `webuildreal.dev` (callback + publisher TXT)
- [x] Legacy `pact.pbm-labs.com` kept for mail only (no HTTP app route)
- [x] Merkle inclusion proofs on `/records/{domain}`
- [ ] End-to-end with live reporter data (`webuildreal.dev`)

**Before Phase 0b (on-chain)**
- [ ] First external domain via `/connect`
- [x] OAuth client production redirect URLs on `webuildreal.dev`

**Phase 0b**
- [ ] Deploy Base contract + `publishRoot`
- [ ] Replace staging banner with on-chain verification

## Protocol implementation

| Module | Spec reference |
|--------|----------------|
| Leaf encoding | [v0.2 Appendix C](docs/pact_protocol_v02.md) |
| Sparse Merkle | [v0.2 §3.3.1](docs/pact_protocol_v02.md) (32 levels) |
| Trust score (raw) | `pact-score-0.1` — [v0.1 §4.3](docs/pact_protocol_v01.md) |
| Trust score (display) | `pact-display-0.1` — [v0.1 §4.5](docs/pact_protocol_v01.md) |
| Allowlist | §3.1.1 seed in `packages/pact-core/src/auth/allowlist.ts` |

## License

**PACT** is an open protocol — freely implementable.  
**we build real** is the movement.  
**PBM Labs LLC** provides the first reference implementation (this repo).
