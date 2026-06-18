# PACT Protocol — Phase 0a

Domain provenance from DMARC aggregate reports. Protocol spec: [docs/pact_protocol_v02.md](docs/pact_protocol_v02.md). Full doc index: [docs/README.md](docs/README.md).

**Reference domain:** `pbm-labs.com`  
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
pnpm deploy:web                   # Cloudflare Workers (pbm-labs.com)
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
| `NEXT_PUBLIC_APP_URL` | OAuth redirect base URL |
| `CLOUDFLARE_API_TOKEN` | `scripts/sync-cloudflare-dns*.py` |
| `PROTON_VERIFICATION` | DNS sync scripts (Proton domain verify TXT) |

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

### Cloudflare OAuth onboarding (`/connect`)

1. Cloudflare dashboard → **Manage Account → OAuth clients → Create client**
2. Redirect URL: `https://pbm-labs.com/api/connect/cloudflare/callback`
3. Client URL: `https://pbm-labs.com` (HTTPS required; verify with TXT on apex)
4. Promote to **public** after domain verification on `client_uri` (required for external users)
   - **Logo URL:** `https://pbm-labs.com/pact-logo.svg` (hosted in `apps/web/public/`)
   - Logo, client URL, and scopes are required before going public
5. Add client ID and secret to `.env.local` (see `.env.example`)

Optional: `CLOUDFLARE_OAUTH_SCOPES`, `CONNECT_STATE_SECRET` — see `.env.example`.

## Supabase setup

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Register your domain:

```sql
insert into domains (domain) values ('pbm-labs.com');
insert into domains (domain) values ('witnessed.cc');
```

## DNS (pbm-labs.com)

See `fixtures/dmarc-google-pbm-labs.xml` for sample report shape.

| Record | Purpose |
|--------|---------|
| `_dmarc` TXT with `rua=mailto:rua@pact.pbm-labs.com` | Send aggregate reports to PACT |
| `_report._dmarc.pact` TXT `v=DMARC1` | Authorize external rua destination |
| `pact` MX → `route1/route2.mx.cloudflare.net` | Receive mail on subdomain |
| `pact` TXT SPF for Cloudflare Email Routing | Allow Cloudflare to receive |

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

**Apex (`@`) — Proton**

| Type | Name | Content |
|------|------|---------|
| MX | `@` | `10 mail.protonmail.ch` |
| MX | `@` | `20 mailsec.protonmail.ch` |
| TXT | `@` | Proton SPF (from wizard) |
| TXT | `_dmarc` | Include `rua=mailto:rua@pact.pbm-labs.com` **and** Proton DMARC tags |
| CNAME | `protonmail._domainkey` etc. | From Proton wizard |

Delete apex MX records pointing to `route*.mx.cloudflare.net`.

**Subdomain `pact` — PACT intake (keep)**

| Type | Name | Content |
|------|------|---------|
| MX | `pact` | `route1/2/3.mx.cloudflare.net` (priorities from CF) |
| TXT | `pact` | `v=spf1 include:_spf.mx.cloudflare.net ~all` |
| TXT | `_report._dmarc.pact` | `v=DMARC1` |

### 4. Cloudflare Email Routing — rules

Remove apex rules (catch-all, `hello@` forwards). Keep **only**:

| Custom address | Action |
|----------------|--------|
| `rua@pact.pbm-labs.com` | **Send to Worker** → `pact-ingest` |

### 5. Verify

```bash
dig @1.1.1.1 MX pbm-labs.com +short          # mail.protonmail.ch
dig @1.1.1.1 MX pact.pbm-labs.com +short     # route*.mx.cloudflare.net
dig @1.1.1.1 TXT _dmarc.pbm-labs.com +short  # includes rua=mailto:rua@pact.pbm-labs.com
```

Send test to `hello@pbm-labs.com` → Proton inbox.  
DMARC reports still go to `rua@pact.pbm-labs.com` → worker (~24–48h).

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
- [x] Cloudflare OAuth onboarding at `/connect`
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
| Trust score | `pact-score-0.2` §4.2 |
| Allowlist | §3.1.1 seed in `packages/pact-core/src/auth/allowlist.ts` |

## License

PBM Labs LLC — Protocol open, reference implementation private.
