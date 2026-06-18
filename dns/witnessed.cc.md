# witnessed.cc — Proton Mail DNS

Applied via `scripts/sync-cloudflare-dns-witnessed.py`.

| Type | Name | Content |
|------|------|---------|
| CNAME | `@` | `cname.vercel-dns.com` (website) |
| MX | `@` | `mail.protonmail.ch` (10), `mailsec.protonmail.ch` (20) |
| TXT | `@` | `protonmail-verification=…` (from Proton; set via `PROTON_VERIFICATION` in `.env.local` for sync script) |
| TXT | `@` | `v=spf1 include:_spf.protonmail.ch ~all` |
| CNAME | `protonmail._domainkey` | `protonmail.domainkey.d6q3nx4mbqk7ybno3bvhwynpmarusfsxps57blwnwfr5lp7o6vrya.domains.proton.ch` |
| CNAME | `protonmail2._domainkey` | `protonmail2.domainkey.d6q3nx4mbqk7ybno3bvhwynpmarusfsxps57blwnwfr5lp7o6vrya.domains.proton.ch` |
| CNAME | `protonmail3._domainkey` | `protonmail3.domainkey.d6q3nx4mbqk7ybno3bvhwynpmarusfsxps57blwnwfr5lp7o6vrya.domains.proton.ch` |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; …; rua=mailto:rua@pact.pbm-labs.com` |

DMARC aggregate reports go **only** to PACT (`rua@pact.pbm-labs.com`), not Proton. External destination is authorized by `_report._dmarc.pact` on `pbm-labs.com`.

In **Email Routing** for witnessed.cc, **disable or delete**:

- `hello@witnessed.cc` → forward to Gmail (disabled via API)
- Catch-all → `witnessed-email-router` worker (disable manually if still on)

Email Routing will show **misconfigured** on apex — expected with Proton MX (same as pbm-labs.com).

## Proton

Create mailbox `hello@witnessed.cc` in Proton. Confirm DKIM/SPF/MX green in domain settings.
