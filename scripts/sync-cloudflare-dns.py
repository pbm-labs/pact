#!/usr/bin/env python3
"""Apply pbm-labs.com DNS (company apex + Proton mail + PACT pact subdomain) via Cloudflare API.

Requires CLOUDFLARE_API_TOKEN with Zone DNS Edit + Email Routing Edit.

Usage:
  export CLOUDFLARE_API_TOKEN=...   # or set in repo-root .env.local
  export PROTON_VERIFICATION='protonmail-verification=...'  # optional if already live
  export COMPANY_SITE_CNAME=cname.vercel-dns.com             # apex/www website
  export VERCEL_DOMAIN_VERIFY='vc-domain-verify=...'         # from Vercel dashboard
  export CLOUDFLARE_OAUTH_PUBLISHER='cloudflare_oauth_client_publisher=...'  # pact subdomain
  python3 scripts/sync-cloudflare-dns.py
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

from env_local import load_env_local

ZONE_ID = "eda4b298d663534da9d8868b7b60c084"
ZONE = "pbm-labs.com"
PACT = f"pact.{ZONE}"

PROTON_VERIFICATION = os.environ.get("PROTON_VERIFICATION", "").strip()
COMPANY_SITE_CNAME = os.environ.get("COMPANY_SITE_CNAME", "cname.vercel-dns.com").strip()
VERCEL_DOMAIN_VERIFY = os.environ.get("VERCEL_DOMAIN_VERIFY", "").strip()
OAUTH_PUBLISHER = os.environ.get("CLOUDFLARE_OAUTH_PUBLISHER", "").strip()

DESIRED: list[tuple[str, str, str, int | None]] = [
    ("CNAME", ZONE, COMPANY_SITE_CNAME, None),
    ("CNAME", f"www.{ZONE}", COMPANY_SITE_CNAME, None),
]
if VERCEL_DOMAIN_VERIFY:
    DESIRED.append(("TXT", f"_vercel.{ZONE}", VERCEL_DOMAIN_VERIFY, None))
if PROTON_VERIFICATION:
    DESIRED.append(("TXT", ZONE, PROTON_VERIFICATION, None))
DESIRED += [
    ("MX", ZONE, "mail.protonmail.ch", 10),
    ("MX", ZONE, "mailsec.protonmail.ch", 20),
    ("TXT", ZONE, "v=spf1 include:_spf.protonmail.ch ~all", None),
    (
        "CNAME",
        f"protonmail._domainkey.{ZONE}",
        "protonmail.domainkey.daaj4dcu6lnnliilt6sgsscqbafafk5ns55aeuy7rrd7qf56y3uxa.domains.proton.ch",
        None,
    ),
    (
        "CNAME",
        f"protonmail2._domainkey.{ZONE}",
        "protonmail2.domainkey.daaj4dcu6lnnliilt6sgsscqbafafk5ns55aeuy7rrd7qf56y3uxa.domains.proton.ch",
        None,
    ),
    (
        "CNAME",
        f"protonmail3._domainkey.{ZONE}",
        "protonmail3.domainkey.daaj4dcu6lnnliilt6sgsscqbafafk5ns55aeuy7rrd7qf56y3uxa.domains.proton.ch",
        None,
    ),
    (
        "TXT",
        f"_dmarc.{ZONE}",
        "v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:rua@pact.pbm-labs.com",
        None,
    ),
    ("TXT", f"_report._dmarc.pact.{ZONE}", "v=DMARC1", None),
    ("MX", PACT, "route1.mx.cloudflare.net", 58),
    ("MX", PACT, "route2.mx.cloudflare.net", 39),
    ("MX", PACT, "route3.mx.cloudflare.net", 35),
    ("TXT", PACT, "v=spf1 include:_spf.mx.cloudflare.net ~all", None),
    # Proxied placeholders so pact.pbm-labs.com resolves for the Worker route (MX stays DNS-only).
    ("A", PACT, "192.0.2.1", None),
    ("AAAA", PACT, "100::", None),
]
if OAUTH_PUBLISHER:
    DESIRED.append(("TXT", PACT, OAUTH_PUBLISHER, None))

# Remove legacy PACT web on apex (Worker A records), old apex OAuth TXT, apex Email Routing MX.
REMOVE_PREFIXES = [
    ("A", ZONE, None),
    ("A", f"www.{ZONE}", None),
    ("MX", ZONE, "route"),
    ("TXT", ZONE, "v=spf1 include:_spf.mx.cloudflare.net"),
    ("TXT", ZONE, "cloudflare_oauth_client_publisher"),
    ("TXT", f"cf2024-1._domainkey.{ZONE}", None),
]


def api(method: str, path: str, body: dict | None = None, *, optional: bool = False) -> dict | None:
    token = os.environ.get("CLOUDFLARE_API_TOKEN")
    if not token:
        print("Set CLOUDFLARE_API_TOKEN (Zone DNS Edit + Email Routing Edit)", file=sys.stderr)
        sys.exit(1)

    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4{path}",
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        if optional:
            print(f"  (skip {method} {path}: {e.code})")
            return None
        print(f"HTTP {e.code} {method} {path}: {err}", file=sys.stderr)
        sys.exit(1)


def norm(name: str) -> str:
    return name.rstrip(".")


def main() -> None:
    load_env_local()
    print("→ Verify token can access zone…")
    z = api("GET", f"/zones/{ZONE_ID}")
    if not z.get("success"):
        print(
            "Token cannot access this zone. Create a token with:\n"
            "  Zone Resources → Include → pbm-labs.com\n"
            "  Permissions → Zone → DNS → Edit",
            file=sys.stderr,
        )
        sys.exit(1)

    print("→ Unlock Email Routing apex DNS…")
    api("PATCH", f"/zones/{ZONE_ID}/email/routing/dns", optional=True)

    print("→ List DNS records…")
    records: list[dict] = []
    page = 1
    while True:
        r = api("GET", f"/zones/{ZONE_ID}/dns_records?per_page=100&page={page}")
        records.extend(r.get("result") or [])
        total = r.get("result_info", {}).get("total_count", 0)
        if len(records) >= total:
            break
        page += 1

    def matches_remove(rec: dict) -> bool:
        for rtype, name, prefix in REMOVE_PREFIXES:
            if rec["type"] != rtype:
                continue
            if norm(rec["name"]) != norm(name):
                continue
            if prefix and not rec.get("content", "").startswith(prefix):
                continue
            return True
        return False

    desired_set = {(t, norm(n), c, p) for t, n, c, p in DESIRED}

    for rec in records:
        key = (rec["type"], norm(rec["name"]), rec.get("content", ""), rec.get("priority"))
        if key in desired_set:
            continue
        if matches_remove(rec):
            print(f"  delete {rec['type']} {rec['name']} {rec.get('content','')[:50]}")
            api("DELETE", f"/zones/{ZONE_ID}/dns_records/{rec['id']}")

    existing = {
        (rec["type"], norm(rec["name"]), rec.get("content", ""), rec.get("priority"))
        for rec in records
    }

    for rtype, name, content, priority in DESIRED:
        key = (rtype, norm(name), content, priority)
        if key in existing:
            print(f"  keep {rtype} {name}")
            continue
        body: dict = {"type": rtype, "name": name, "content": content, "ttl": 1}
        if rtype == "CNAME":
            body["proxied"] = False
        if rtype == "AAAA" and content == "100::":
            body["proxied"] = True
        if rtype == "A" and name == PACT:
            body["proxied"] = True
        if priority is not None:
            body["priority"] = priority
        print(f"  add  {rtype} {name}")
        api("POST", f"/zones/{ZONE_ID}/dns_records", body)

    print("\nDone. Verify:")
    print(f"  dig @1.1.1.1 CNAME {ZONE} +short          # company site")
    print(f"  dig @1.1.1.1 MX {ZONE} +short             # Proton")
    print(f"  dig @1.1.1.1 MX {PACT} +short            # PACT intake")
    print("  PACT web app: https://pact.pbm-labs.com (Worker route — see wrangler.jsonc)")


if __name__ == "__main__":
    main()
