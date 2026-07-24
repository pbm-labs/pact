# PACT Protocol — Phase 0a

Domain provenance from DMARC aggregate reports. Protocol spec: [docs/pact_protocol_v01.md](docs/pact_protocol_v01.md). Full doc index: [docs/README.md](docs/README.md).

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
fixtures/            DMARC XML test fixtures
scripts/             Local dev tools
docs/                Protocol & roadmap specs
```

## Quick start

```bash
pnpm install
pnpm test                         # pact-core unit tests
pnpm --filter @pact/core build
pnpm dev:fixture                  # parse sample XML locally (no DB)
pnpm dev:ingest-fixture           # simulate rua report → Supabase
pnpm dev:web                      # http://localhost:3000
pnpm deploy:web                   # Cloudflare Workers (pact.pbm-labs.com)
```

## Environment

All secrets stay in **repo-root `.env.local`** (gitignored). Never commit it.

```bash
cp .env.example .env.local
# fill in Supabase, Cloudflare OAuth, API token, etc.
```

Used by `pnpm dev:web`, `pnpm dev:ingest-fixture`, and DNS sync scripts.

| Variable | Used by |
|----------|---------|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Web app, ingest fixture, worker (via wrangler secrets) |
| `CLOUDFLARE_OAUTH_CLIENT_ID`, `CLOUDFLARE_OAUTH_CLIENT_SECRET` | `/connect` OAuth flow |
| `NEXT_PUBLIC_APP_URL` | PACT app URL (`https://pact.pbm-labs.com` in prod) |
| `NEXT_PUBLIC_COMPANY_SITE_URL` | Company site (`https://pbm-labs.com`) |
| `CLOUDFLARE_API_TOKEN` | `scripts/sync-cloudflare-dns*.py` |
| `PROTON_VERIFICATION` | DNS sync scripts (Proton domain verify TXT) |
| `COMPANY_SITE_CNAME` | Apex/www CNAME target (default `cname.vercel-dns.com`) |
| `VERCEL_DOMAIN_VERIFY` | `_vercel` TXT from Vercel when connecting apex |
| `CLOUDFLARE_OAUTH_PUBLISHER` | OAuth publisher TXT on `pact` subdomain |

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

1. Cloudflare dashboard → **Manage Account → OAuth clients → Edit client**
2. Redirect URL: `https://pact.pbm-labs.com/api/connect/cloudflare/callback`
3. Client URL: `https://pact.pbm-labs.com` (HTTPS required; verify with TXT on `pact` subdomain)
4. Promote to **public** after domain verification on `client_uri` (required for external users)
   - **Logo URL:** `https://pact.pbm-labs.com/pact-logo.svg` (hosted in `apps/web/public/`)
   - Add `CLOUDFLARE_OAUTH_PUBLISHER=cloudflare_oauth_client_publisher=…` to `.env.local`, then run `scripts/sync-cloudflare-dns.py`
5. Add client ID and secret to `.env.local` (see `.env.example`)

After moving the app to `pact.pbm-labs.com`, update the OAuth client in the dashboard (API token needs **OAuth Clients Write**):

| Field | Value |
|-------|--------|
| Client URL | `https://pact.pbm-labs.com` |
| Redirect URL | `/api/connect/cloudflare/callback` |
| Logo URL | `https://pact.pbm-labs.com/pact-logo.svg` |

Copy the new **publisher TXT** from the client page → `CLOUDFLARE_OAUTH_PUBLISHER` in `.env.local` → run `scripts/sync-cloudflare-dns.py`.

Optional: `CLOUDFLARE_OAUTH_SCOPES`, `CONNECT_STATE_SECRET` — see `.env.example`.

### Manual DNS connect

Copy the `_dmarc` snippet on `/connect`, update DNS at any provider, then **Register domain**. Works for GoDaddy, Namecheap, Google Domains, Route 53 console, etc.

**Supabase upgrades** (existing projects): re-run the upgrade block at the bottom of `supabase/schema.sql` in the SQL editor (adds `domain_registered_at` if missing). Then backfill registration dates:

```bash
export $(grep -v '^#' apps/web/.env.local | xargs)
pnpm backfill:domain-age
```

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

Apply DNS with `python3 scripts/sync-cloudflare-dns.py` (see `.env.example` for optional vars).

## DNS (pbm-labs.com)

See `fixtures/dmarc-google-pbm-labs.xml` for sample report shape.

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
| `pnpm dev:fixture` | Parser + Merkle + trust score (stdout only) |
| `pnpm dev:ingest-fixture` | Full pipeline → Supabase (simulated Google report) |
| Send mail to `hello@pbm-labs.com` | Proton inbox (apex MX) |
| Wait ~24–48h | **Real** Google/Microsoft DMARC reports |

Real reports arrive from allowlisted senders (e.g. `noreply-dmarc-support@google.com`). Resend/test mail is rejected by the reporter allowlist — that is intentional.

To clear simulated data:

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
- [ ] First external domain via `/connect`
- [ ] OAuth client public + production redirect URLs

**Phase 0b**
- [ ] Deploy Base contract + `publishRoot`
- [ ] Replace staging banner with on-chain verification

## Protocol implementation

| Module | Spec reference |
|--------|----------------|
| Leaf encoding | v0.2 Appendix C |
| Sparse Merkle | v0.2 §3.3.1 (32 levels) |
| Trust score (raw) | `pact-score-0.1` — [v0.1 §4.3](docs/pact_protocol_v01.md) |
| Trust score (display) | `pact-display-0.1` — [v0.1 §4.5](docs/pact_protocol_v01.md) |
| Allowlist | §3.1.1 seed in `packages/pact-core/src/auth/allowlist.ts` |

## License

PBM Labs LLC — Protocol open, reference implementation private.
