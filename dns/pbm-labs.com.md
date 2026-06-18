# pbm-labs.com — complete DNS

**Cloudflare → DNS → delete every record → add only these 14.**

| Type | Name | Content | Priority | Proxy |
|------|------|---------|----------|-------|
| A | `@` | `104.21.40.67` | — | Proxied |
| A | `@` | `172.67.179.28` | — | Proxied |
| TXT | `@` | `protonmail-verification=0f0cc5106a6ca47f73babea74cd7b4c6d738243f` | — | DNS only |
| MX | `@` | `mail.protonmail.ch` | 10 | DNS only |
| MX | `@` | `mailsec.protonmail.ch` | 20 | DNS only |
| TXT | `@` | `v=spf1 include:_spf.protonmail.ch ~all` | — | DNS only |
| CNAME | `protonmail._domainkey` | `protonmail.domainkey.daaj4dcu6lnnliilt6sgsscqbafafk5ns55aeuy7rrd7qf56y3uxa.domains.proton.ch` | — | DNS only |
| CNAME | `protonmail2._domainkey` | `protonmail2.domainkey.daaj4dcu6lnnliilt6sgsscqbafafk5ns55aeuy7rrd7qf56y3uxa.domains.proton.ch` | — | DNS only |
| CNAME | `protonmail3._domainkey` | `protonmail3.domainkey.daaj4dcu6lnnliilt6sgsscqbafafk5ns55aeuy7rrd7qf56y3uxa.domains.proton.ch` | — | DNS only |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:rua@pact.pbm-labs.com` | — | DNS only |
| TXT | `_report._dmarc.pact` | `v=DMARC1` | — | DNS only |
| MX | `pact` | `route1.mx.cloudflare.net` | 58 | DNS only |
| MX | `pact` | `route2.mx.cloudflare.net` | 39 | DNS only |
| MX | `pact` | `route3.mx.cloudflare.net` | 35 | DNS only |
| TXT | `pact` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | — | DNS only |

If Proton still shows “verify domain”, add the `protonmail-verification=…` TXT at `@` from the Proton wizard (one-time).

## Email Routing

- Apex MX **unlocked**; subdomain `pact` **configured**
- Only rule: `rua@pact.pbm-labs.com` → Worker `pact-ingest`

## Verify

```bash
dig @1.1.1.1 MX pbm-labs.com +short
dig @1.1.1.1 MX pact.pbm-labs.com +short
dig @1.1.1.1 TXT _dmarc.pbm-labs.com +short
```
