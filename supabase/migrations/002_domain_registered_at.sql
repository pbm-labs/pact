-- Domain registration age (RDAP/WHOIS) — display-only, never used in trust score math.
-- See pact_protocol_v01.md Section 4.2.

alter table domains
  add column if not exists domain_registered_at timestamptz;

comment on column domains.domain_registered_at is
  'Public registry creation date via RDAP at connect time. Display-only — never an input to trust score.';
