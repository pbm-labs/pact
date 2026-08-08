# PACT Protocol — Phase 0a

Public brand is **we build real**; the protocol is **PACT**. Domain provenance from DMARC aggregate reports. Connect UX lives at [`/how-it-works`](https://pact.pbm-labs.com/how-it-works).

Protocol specs: [docs/pact_protocol_v01.md](docs/pact_protocol_v01.md) (trust score) and [docs/pact_protocol_v02.md](docs/pact_protocol_v02.md) (Merkle / encoding). Index: [docs/README.md](docs/README.md).

The manifesto video under `apps/web/public/` is ~11MB and tracked in git; prefer R2/CDN for future media updates.

**Reference domain:** `pbm-labs.com`  
**PACT app:** `https://pact.pbm-labs.com`  
**Company site:** `https://pbm-labs.com`  
**Intake address:** `rua@pact.pbm-labs.com`

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
pnpm deploy:web                   # Cloudflare Workers (pact.pbm-labs.com)
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
| `CLOUDFLARE_OAUTH_CLIENT_ID`, `CLOUDFLARE_OAUTH_CLIENT_SECRET` | `/how-it-works` Cloudflare connect |
| `NEXT_PUBLIC_APP_URL` | PACT app URL (`https://pact.pbm-labs.com` in prod) |
| `NEXT_PUBLIC_COMPANY_SITE_URL` | Company site (`https://pbm-labs.com`) |
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

### Cloudflare OAuth (`/how-it-works`)

1. Cloudflare dashboard → **Manage Account → OAuth clients → Edit client**
2. Redirect URL: `https://pact.pbm-labs.com/api/connect/cloudflare/callback`
3. Client URL: `https://pact.pbm-labs.com` (HTTPS required; verify with TXT on `pact` subdomain)
4. Promote to **public** after domain verification on `client_uri` (required for external users)
   - **Logo URL:** `https://pact.pbm-labs.com/pact-logo.svg` (hosted in `apps/web/public/`)
   - Add the publisher TXT from the OAuth client page on the `pact` subdomain in Cloudflare DNS
5. Add client ID and secret to `.env.local` (see `.env.example`)

After moving the app to `pact.pbm-labs.com`, update the OAuth client in the dashboard (API token needs **OAuth Clients Write**):

| Field | Value |
|-------|--------|
| Client URL | `https://pact.pbm-labs.com` |
| Redirect URL | `/api/connect/cloudflare/callback` |
| Logo URL | `https://pact.pbm-labs.com/pact-logo.svg` |

Optional: `CLOUDFLARE_OAUTH_SCOPES`, `CONNECT_STATE_SECRET` — see `.env.example`.

### Manual DNS connect

Copy the `_dmarc` snippet on `/how-it-works`, update DNS at any provider. Works for GoDaddy, Namecheap, Google Domains, Route 53 console, etc. Manual and existing-tool paths register on first report.

**Supabase upgrades** (existing projects): re-run the upgrade block at the bottom of `supabase/schema.sql` in the SQL editor (adds `domain_registered_at` if missing). New domains resolve registration age at connect/ingest time.

## Supabase setup

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Register your domain:

```sql
insert into domains (domain) values ('pbm-labs.com');
insert into domains (domain) values ('witnessed.cc');
```

## Hostnames

| Host | Role |
|------|------|
| `pbm-labs.com` / `www` | Company website (Vercel or other host — not the PACT Worker) |
| `pact.pbm-labs.com` | PACT web app (`pact-web` Worker) |
| `rua@pact.pbm-labs.com` | DMARC intake (`pact-ingest` Worker) |
| `hello@pbm-labs.com` | Proton mail (apex MX) |

Apply DNS in the Cloudflare dashboard (zone for `pbm-labs.com`).

## DNS (pbm-labs.com)

| Record | Purpose |
|--------|---------|
| `_dmarc` TXT with `rua=mailto:rua@pact.pbm-labs.com` | Send aggregate reports to PACT |
| `_report._dmarc.pact` TXT `v=DMARC1` | Authorize external rua destination |
| `pact` MX → `route1/route2.mx.cloudflare.net` | Receive DMARC mail on subdomain |
| `pact` proxied `A 192.0.2.1` | Worker HTTP (required alongside MX) |
| `pact` TXT SPF for Cloudflare Email Routing | Allow Cloudflare to receive |

**Note:** Some home routers mishandle names that have both MX and proxied A records (IPv4 missing, IPv6 only). Use Cloudflare DNS (`1.1.1.1`) on clients if the app URL fails to resolve.

Nameservers must point to Cloudflare for records to go live.

## Email (split: Proton apex + PACT subdomain)

Apex mail (`hello@pbm-labs.com`) and PACT intake (`rua@pact.pbm-labs.com`) use **different MX targets**:

| Address | MX | Handler |
|---------|-----|---------|
| `hello@pbm-labs.com` (apex) | `mail.protonmail.ch` | Proton inbox |
| `rua@pact.pbm-labs.com` (`pact`) | `route*.mx.cloudflare.net` | `pact-ingest` worker |

### 1. Proton — custom domain (receiving)

In [Proton Mail](https://mail.proton.me) → **Settings → All settings → Proton Mail → Domain names** → add `pbm-labs.com` and copy the DNS records Proton gives you (MX, SPF, DKIM).

### 2. Cloudflare — unlock apex MX

1. **Email** → **Email Routing** → **Settings**
2. Confirm subdomain **`pact`** is listed and **Configured**
3. For the **root domain** row, **unlock** MX records (so apex MX is not locked to Cloudflare)
4. Subdomain `pact` should stay **locked** to Cloudflare Email Routing

### 3. Cloudflare DNS

**Apex (`@`) — company site + Proton mail**

| Type | Name | Content |
|------|------|---------|
| CNAME | `@` | Company host (e.g. `cname.vercel-dns.com`) |
| CNAME | `www` | Same as apex |
| MX | `@` | `10 mail.protonmail.ch` |
| MX | `@` | `20 mailsec.protonmail.ch` |
| TXT | `@` | Proton SPF (from wizard) |
| TXT | `_dmarc` | Include `rua=mailto:rua@pact.pbm-labs.com` **and** Proton DMARC tags |
| CNAME | `protonmail._domainkey` etc. | From Proton wizard |

Remove apex **A** records that pointed the PACT Worker at the root domain.

**Subdomain `pact` — PACT web + DMARC intake**

| Type | Name | Content |
|------|------|---------|
| MX | `pact` | `route1/2/3.mx.cloudflare.net` (priorities from CF) |
| A | `pact` | Proxied `192.0.2.1` (Worker HTTP) |
| TXT | `pact` | `v=spf1 include:_spf.mx.cloudflare.net ~all` |
| TXT | `pact` | `cloudflare_oauth_client_publisher=…` |
| TXT | `_report._dmarc.pact` | `v=DMARC1` |

Worker route (wrangler): `pact.pbm-labs.com/*` → `pact-web`.

### 4. Cloudflare Email Routing — rules

Remove apex rules (catch-all, `hello@` forwards). Keep **only**:

| Custom address | Action |
|----------------|--------|
| `rua@pact.pbm-labs.com` | **Send to Worker** → `pact-ingest` |

### 5. Verify

```bash
dig @1.1.1.1 CNAME pbm-labs.com +short         # company site
dig @1.1.1.1 MX pbm-labs.com +short            # mail.protonmail.ch
dig @1.1.1.1 MX pact.pbm-labs.com +short       # route*.mx.cloudflare.net
dig @1.1.1.1 A pact.pbm-labs.com +short        # Cloudflare edge (web)
dig @1.1.1.1 TXT _dmarc.pbm-labs.com +short    # includes rua=mailto:rua@pact.pbm-labs.com
curl -sI https://pact.pbm-labs.com/ | head -1  # PACT app
```

Send test to `hello@pbm-labs.com` → Proton inbox.  
DMARC reports still go to `rua@pact.pbm-labs.com` → worker (~24–48h).

## Deploy PACT web app

```bash
pnpm deploy:web   # pact.pbm-labs.com (see apps/web/wrangler.jsonc)
```

After first deploy on the new hostname, remove any leftover Worker routes for `pbm-labs.com/*` in the Cloudflare dashboard.

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
- [x] DNS: `_dmarc`, `_report._dmarc.pact`, `pact` MX/SPF
- [x] Cloudflare Email Routing → `pact-ingest` worker
- [x] Worker deployed with Supabase secrets + queue
- [ ] First **real** DMARC report in Supabase (~24–48h after `_dmarc` live)

**Phase 0a**
- [x] Parser, dedup, leaves, staging roots
- [x] Public page at `/domain/{domain}`
- [x] Cloudflare OAuth at `/connect` + manual DNS
- [x] Merkle inclusion proofs on `/domain/{domain}`
- [ ] End-to-end with live reporter data (`pbm-labs.com`)

**Before Phase 0b (on-chain)**
- [ ] First external domain via `/how-it-works`
- [ ] OAuth client public + production redirect URLs

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
