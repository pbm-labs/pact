# PACT Protocol — Phase 0a

Public brand is **we build real**; the protocol is **PACT**. Domain provenance from DMARC aggregate reports. Connect UX lives at [`/connect`](https://webuildreal.dev/connect).

Protocol specs: [docs/pact_protocol_v01.md](docs/pact_protocol_v01.md) (trust score) and [docs/pact_protocol_v02.md](docs/pact_protocol_v02.md) (Merkle / encoding).

The manifesto video under `apps/web/public/` is ~11MB and tracked in git; prefer R2/CDN for future media updates.

**Reference domain:** `pbm-labs.com`  
**PACT app:** `https://webuildreal.dev`  
**Company site:** `https://pbm-labs.com`  
**Intake address:** `rua@webuildreal.dev` (legacy `rua@pact.pbm-labs.com` still accepted)

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
4. **Logo URL:** `https://webuildreal.dev/pact-logo.svg` (hosted in `apps/web/public/`)
5. Add the publisher TXT from the OAuth client page as an apex TXT on `webuildreal.dev`
6. Promote to **public** after domain verification (required for external users)
7. Put client ID and secret in `.env.local` and Worker secrets (see `.env.example`)

Optional: `CLOUDFLARE_OAUTH_SCOPES`, `CONNECT_STATE_SECRET` — see `.env.example`.

### Manual DNS connect

Copy the `_dmarc` snippet on `/connect`, update DNS at any provider. Works for GoDaddy, Namecheap, Google Domains, Route 53 console, etc. Manual and existing-tool paths register the domain when the form is submitted (reports still arrive later).

**Supabase upgrades** (existing projects): re-run the upgrade block at the bottom of `supabase/schema.sql` in the SQL editor (adds `domain_registered_at` if missing). New domains resolve registration age at connect/ingest time.

## Supabase setup

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Register your domain:

```sql
insert into domains (domain) values ('pbm-labs.com');
```

## Hostnames

| Host | Role |
|------|------|
| `webuildreal.dev` / `www` | PACT web app (`pact-web` Worker) |
| `rua@webuildreal.dev` | DMARC intake for **new** connects |
| `rua@pact.pbm-labs.com` | Legacy DMARC intake — keep for domains already pointing here |
| `pact.pbm-labs.com` (HTTP) | Retired app host — `pact-web` route + middleware **308** → `webuildreal.dev` |
| `pbm-labs.com` / `www` | Company website (Vercel — not the PACT Worker) |
| `hello@pbm-labs.com` | Proton mail (apex MX) |

Apply DNS in Cloudflare (zones for `webuildreal.dev` and `pbm-labs.com`).

## DNS (webuildreal.dev)

| Record | Purpose |
|--------|---------|
| Apex `A` `192.0.2.1` proxied | Worker placeholder for `pact-web` |
| `www` CNAME → `webuildreal.dev` proxied | www → apex (middleware 308) |
| MX `route*.mx.cloudflare.net` | Email Routing for DMARC intake |
| TXT `_dmarc` `v=DMARC1; p=none; rua=mailto:rua@webuildreal.dev` | Zone’s own DMARC + PACT intake |
| TXT `_report._dmarc` `v=DMARC1` | Authorize external rua destination (required) |
| TXT `@` SPF `include:_spf.mx.cloudflare.net` | Cloudflare Email Routing |
| TXT `@` `cloudflare_oauth_client_publisher=…` | OAuth client URL verification (value from CF OAuth client page) |
| DKIM `cf2024-1._domainkey` | Email Routing DKIM |
| Email Routing rule | `rua@webuildreal.dev` → Worker `pact-ingest` |

Worker routes (`apps/web/wrangler.jsonc`): `webuildreal.dev/*`, `www.webuildreal.dev/*`, and legacy `pact.pbm-labs.com/*` (redirect only).

## DNS (pbm-labs.com)

| Record | Purpose |
|--------|---------|
| Apex / `www` → Vercel | Company site |
| Apex MX / SPF / DKIM | Proton (`hello@`) |
| `_dmarc` | Company policy + `rua=mailto:rua@webuildreal.dev` (legacy `rua@pact.pbm-labs.com` may remain as secondary) |
| `pact` MX → `route*.mx.cloudflare.net` | Legacy DMARC mail intake |
| `pact` proxied `A 192.0.2.1` | Needed alongside MX; also serves HTTP redirect via Worker |
| `pact` TXT SPF | Cloudflare Email Routing |
| `_report._dmarc.pact` TXT `v=DMARC1` | Authorize external reports to legacy rua |

Do **not** keep OAuth publisher TXT on `pact.pbm-labs.com` — publisher verification lives on `webuildreal.dev` only.

**Note:** Some home routers mishandle names that have both MX and proxied A records (IPv4 missing, IPv6 only). Use Cloudflare DNS (`1.1.1.1`) on clients if resolution fails.

## Email

| Address | MX | Handler |
|---------|-----|---------|
| `hello@pbm-labs.com` (apex) | `mail.protonmail.ch` | Proton inbox |
| `rua@webuildreal.dev` | `route*.mx.cloudflare.net` | `pact-ingest` (canonical) |
| `rua@pact.pbm-labs.com` (`pact`) | `route*.mx.cloudflare.net` | `pact-ingest` (legacy) |

### 1. Proton — custom domain (receiving)

In [Proton Mail](https://mail.proton.me) → **Settings → All settings → Proton Mail → Domain names** → add `pbm-labs.com` and copy the DNS records Proton gives you (MX, SPF, DKIM).

### 2. Cloudflare — unlock apex MX on `pbm-labs.com`

1. **Email** → **Email Routing** → **Settings**
2. Confirm subdomain **`pact`** is listed and **Configured**
3. For the **root domain** row, **unlock** MX records (so apex MX is not locked to Cloudflare)
4. Subdomain `pact` should stay **locked** to Cloudflare Email Routing

### 3. Cloudflare DNS (summary)

**`pbm-labs.com` apex — company site + Proton**

| Type | Name | Content |
|------|------|---------|
| CNAME | `@` | `cname.vercel-dns.com` (or current host) |
| CNAME | `www` | Same as apex |
| MX | `@` | Proton MX (from wizard) |
| TXT | `@` | Proton SPF / verification |
| TXT | `_dmarc` | Policy tags + `rua=mailto:rua@webuildreal.dev` (optional legacy rua secondary) |
| CNAME | `protonmail._domainkey` etc. | From Proton wizard |

**`pact.pbm-labs.com` — legacy intake + HTTP redirect**

| Type | Name | Content |
|------|------|---------|
| MX | `pact` | `route1/2/3.mx.cloudflare.net` |
| A | `pact` | Proxied `192.0.2.1` |
| TXT | `pact` | `v=spf1 include:_spf.mx.cloudflare.net ~all` |
| TXT | `_report._dmarc.pact` | `v=DMARC1` |

### 4. Cloudflare Email Routing — rules

**`webuildreal.dev`**

| Custom address | Action |
|----------------|--------|
| `rua@webuildreal.dev` | **Send to Worker** → `pact-ingest` |

**`pbm-labs.com`** (legacy)

| Custom address | Action |
|----------------|--------|
| `rua@pact.pbm-labs.com` | **Send to Worker** → `pact-ingest` |

Keep apex `hello@` on Proton (not Cloudflare Email Routing).

### 5. Verify

```bash
dig @1.1.1.1 CNAME pbm-labs.com +short              # company site
dig @1.1.1.1 MX pbm-labs.com +short                 # mail.protonmail.ch
dig @1.1.1.1 MX webuildreal.dev +short              # route*.mx.cloudflare.net
dig @1.1.1.1 MX pact.pbm-labs.com +short            # legacy rua MX
dig @1.1.1.1 TXT _dmarc.webuildreal.dev +short       # rua@webuildreal.dev
dig @1.1.1.1 TXT _dmarc.pbm-labs.com +short         # includes rua@webuildreal.dev
dig @1.1.1.1 TXT webuildreal.dev +short | grep oauth # publisher TXT
curl -sI https://webuildreal.dev/ | head -1         # PACT app
curl -sI https://pact.pbm-labs.com/ | head -5       # 308 → webuildreal.dev
```

Send test to `hello@pbm-labs.com` → Proton inbox.  
New DMARC reports should use `rua@webuildreal.dev` → worker (~24–48h). Legacy rua still accepted.

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
| Send mail to `hello@pbm-labs.com` | Proton inbox (apex MX) |
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
- [x] Legacy `pact.pbm-labs.com` HTTP → 308 `webuildreal.dev`
- [x] Merkle inclusion proofs on `/records/{domain}`
- [ ] End-to-end with live reporter data (`pbm-labs.com`)

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

PBM Labs LLC — Protocol open, reference implementation private.
