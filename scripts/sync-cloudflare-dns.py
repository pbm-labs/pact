#!/usr/bin/env python3
"""Apply pbm-labs.com DNS (Proton apex + PACT pact subdomain) via Cloudflare API.

Requires CLOUDFLARE_API_TOKEN with Zone DNS Edit + Email Routing Edit.

Create token: https://dash.cloudflare.com/profile/api-tokens
  → Custom token → Zone DNS Edit + Email Routing Edit for pbm-labs.com

Usage:
  export CLOUDFLARE_API_TOKEN=...
  export PROTON_VERIFICATION='protonmail-verification=...'  # Proton → Domain names → Verify tab
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

# From Proton → Settings → Domain names → pbm-labs.com → Verify tab
PROTON_VERIFICATION = os.environ.get("PROTON_VERIFICATION", "").strip()

DESIRED = [
    ("A", ZONE, "104.21.40.67", None),
    ("A", ZONE, "172.67.179.28", None),
]
if PROTON_VERIFICATION:
    DESIRED.append(("TXT", ZONE, PROTON_VERIFICATION, None))
DESIRED += [
    ("MX", ZONE, "mail.protonmail.ch", 10),
    ("MX", ZONE, "mailsec.protonmail.ch", 20),
    ("TXT", ZONE, "v=spf1 include:_spf.protonmail.ch ~all", None),
    (
        "TXT",
        ZONE,
        "cloudflare_oauth_client_publisher=558166b07f9c5d43137b0b073fa97ea7",
        None,
    ),
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
    ("MX", f"pact.{ZONE}", "route1.mx.cloudflare.net", 58),
    ("MX", f"pact.{ZONE}", "route2.mx.cloudflare.net", 39),
    ("MX", f"pact.{ZONE}", "route3.mx.cloudflare.net", 35),
    ("TXT", f"pact.{ZONE}", "v=spf1 include:_spf.mx.cloudflare.net ~all", None),
]

REMOVE_PREFIXES = [
    ("MX", ZONE, "route"),
    ("TXT", ZONE, "v=spf1 include:_spf.mx.cloudflare.net"),
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
        if priority is not None:
            body["priority"] = priority
        print(f"  add  {rtype} {name}")
        api("POST", f"/zones/{ZONE_ID}/dns_records", body)

    print("\nDone. Verify:")
    print(f"  dig @1.1.1.1 MX {ZONE} +short")
    print(f"  dig @1.1.1.1 MX pact.{ZONE} +short")


if __name__ == "__main__":
    main()
