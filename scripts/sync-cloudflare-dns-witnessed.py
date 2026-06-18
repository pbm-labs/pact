#!/usr/bin/env python3
"""Apply witnessed.cc DNS for Proton Mail (keep Vercel website CNAME).

Usage:
  export CLOUDFLARE_API_TOKEN=...   # or set in repo-root .env.local
  export PROTON_VERIFICATION='protonmail-verification=...'  # optional if already in DNS
  python3 scripts/sync-cloudflare-dns-witnessed.py
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

from env_local import load_env_local

ZONE_ID = "6e3f3a21f272fba17567669aaec47936"
ZONE = "witnessed.cc"

PROTON_VERIFICATION = os.environ.get("PROTON_VERIFICATION", "").strip()

# witnessed.cc-specific DKIM targets (Proton → Review → DKIM).
PROTON_DKIM = [
    "protonmail.domainkey.d6q3nx4mbqk7ybno3bvhwynpmarusfsxps57blwnwfr5lp7o6vrya.domains.proton.ch",
    "protonmail2.domainkey.d6q3nx4mbqk7ybno3bvhwynpmarusfsxps57blwnwfr5lp7o6vrya.domains.proton.ch",
    "protonmail3.domainkey.d6q3nx4mbqk7ybno3bvhwynpmarusfsxps57blwnwfr5lp7o6vrya.domains.proton.ch",
]

DESIRED = [
    ("CNAME", ZONE, "cname.vercel-dns.com", None),
    ("MX", ZONE, "mail.protonmail.ch", 10),
    ("MX", ZONE, "mailsec.protonmail.ch", 20),
]
if PROTON_VERIFICATION:
    DESIRED.append(("TXT", ZONE, PROTON_VERIFICATION, None))
DESIRED += [
    ("TXT", ZONE, "v=spf1 include:_spf.protonmail.ch ~all", None),
    ("CNAME", f"protonmail._domainkey.{ZONE}", PROTON_DKIM[0], None),
    ("CNAME", f"protonmail2._domainkey.{ZONE}", PROTON_DKIM[1], None),
    ("CNAME", f"protonmail3._domainkey.{ZONE}", PROTON_DKIM[2], None),
    (
        "TXT",
        f"_dmarc.{ZONE}",
        "v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:rua@pact.pbm-labs.com",
        None,
    ),
    ("TXT", f"_vercel.{ZONE}", "vc-domain-verify=witnessed.cc,75816453ed8cb3456131,dc", None),
]

REMOVE_PREFIXES = [
    ("MX", ZONE, "route"),
    ("TXT", ZONE, "v=spf1 include:_spf.mx.cloudflare.net"),
    ("TXT", f"cf2024-1._domainkey.{ZONE}", None),
    ("MX", f"send.{ZONE}", "feedback-smtp"),
    ("TXT", f"send.{ZONE}", "amazonses"),
    ("TXT", f"resend._domainkey.{ZONE}", None),
]


def api(method: str, path: str, body: dict | None = None, *, optional: bool = False) -> dict | None:
    token = os.environ.get("CLOUDFLARE_API_TOKEN")
    if not token:
        print("Set CLOUDFLARE_API_TOKEN", file=sys.stderr)
        sys.exit(1)
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4{path}",
        data=data,
        method=method,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        if optional:
            print(f"  (skip {method} {path}: {e.code})")
            return None
        print(f"HTTP {e.code} {method} {path}: {e.read().decode()}", file=sys.stderr)
        sys.exit(1)


def norm(name: str) -> str:
    return name.rstrip(".")


def main() -> None:
    load_env_local()
    print(f"→ Sync DNS for {ZONE}…")
    api("PATCH", f"/zones/{ZONE_ID}/email/routing/dns", optional=True)

    records: list[dict] = []
    page = 1
    while True:
        r = api("GET", f"/zones/{ZONE_ID}/dns_records?per_page=100&page={page}")
        records.extend(r.get("result") or [])
        if len(records) >= r.get("result_info", {}).get("total_count", 0):
            break
        page += 1

    def matches_remove(rec: dict) -> bool:
        for rtype, name, prefix in REMOVE_PREFIXES:
            if rec["type"] != rtype or norm(rec["name"]) != norm(name):
                continue
            if prefix and not rec.get("content", "").startswith(prefix):
                continue
            return True
        return False

    desired_set = {(t, norm(n), c, p) for t, n, c, p in DESIRED}
    existing_keys = {
        (rec["type"], norm(rec["name"]), rec.get("content", ""), rec.get("priority"))
        for rec in records
    }

    for rec in records:
        key = (rec["type"], norm(rec["name"]), rec.get("content", ""), rec.get("priority"))
        if key in desired_set:
            continue
        if matches_remove(rec):
            print(f"  delete {rec['type']} {rec['name']}")
            api("DELETE", f"/zones/{ZONE_ID}/dns_records/{rec['id']}")

    for rtype, name, content, priority in DESIRED:
        key = (rtype, norm(name), content, priority)
        if key in existing_keys:
            print(f"  keep {rtype} {name}")
            continue
        body: dict = {"type": rtype, "name": name, "content": content, "ttl": 1}
        if priority is not None:
            body["priority"] = priority
        print(f"  add  {rtype} {name}")
        api("POST", f"/zones/{ZONE_ID}/dns_records", body)

    print("\nDone. Verify:")
    print(f"  dig @1.1.1.1 MX {ZONE} +short")
    print("  Disable Email Routing rules in dashboard (hello@ forward + catch-all worker)")


if __name__ == "__main__":
    main()
