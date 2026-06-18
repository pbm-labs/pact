-- PACT Phase 0a — full Supabase schema (run once in SQL editor)

-- Tables

create table if not exists domains (
  domain text primary key,
  connected_at timestamptz not null default now()
);

create table if not exists processed_reports (
  id bigserial primary key,
  report_id text not null,
  reporter_org text not null,
  period_start bigint not null,
  period_end bigint not null,
  header_from text not null,
  envelope_sender text,
  processed_at timestamptz not null default now(),
  constraint processed_reports_dedup unique (
    report_id, reporter_org, period_start, period_end, header_from
  )
);

create table if not exists leaves (
  id bigserial primary key,
  leaf_index integer not null unique,
  leaf_hash bytea not null,
  domain text not null references domains (domain),
  period_start bigint not null,
  period_end bigint not null,
  reporter_org text not null,
  dkim_pass_count bigint not null default 0,
  dkim_fail_count bigint not null default 0,
  domain_hash bytea not null,
  reporter_hash bytea not null,
  selector_hash bytea not null,
  source_ip_hash bytea not null,
  report_hash bytea not null,
  selectors text[] not null default '{}',
  ip_ranges text[] not null default '{}',
  created_at timestamptz not null default now(),
  constraint leaves_leaf_key unique (domain, period_start, period_end, reporter_org)
);

create table if not exists merkle_roots (
  id bigserial primary key,
  root_hash bytea not null,
  leaf_count integer not null,
  published_at timestamptz not null default now(),
  anchor_type text not null check (anchor_type in ('staging', 'base')),
  tx_hash text,
  block_number bigint
);

create index if not exists leaves_domain_idx on leaves (domain);
create index if not exists merkle_roots_published_at_idx on merkle_roots (published_at desc);

-- Worker RPC: upsert leaf (merges counts/hashes on conflict)

create or replace function insert_leaf(
  p_leaf_hash bytea,
  p_domain text,
  p_period_start bigint,
  p_period_end bigint,
  p_reporter_org text,
  p_dkim_pass_count bigint,
  p_dkim_fail_count bigint,
  p_domain_hash bytea,
  p_reporter_hash bytea,
  p_selector_hash bytea,
  p_source_ip_hash bytea,
  p_report_hash bytea,
  p_selectors text[],
  p_ip_ranges text[]
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_index integer;
begin
  insert into domains (domain) values (p_domain)
  on conflict (domain) do nothing;

  insert into leaves (
    leaf_index, leaf_hash, domain, period_start, period_end, reporter_org,
    dkim_pass_count, dkim_fail_count, domain_hash, reporter_hash,
    selector_hash, source_ip_hash, report_hash, selectors, ip_ranges
  )
  values (
    (select coalesce(max(l.leaf_index), -1) + 1 from leaves l),
    p_leaf_hash, p_domain, p_period_start, p_period_end, p_reporter_org,
    p_dkim_pass_count, p_dkim_fail_count, p_domain_hash, p_reporter_hash,
    p_selector_hash, p_source_ip_hash, p_report_hash, p_selectors, p_ip_ranges
  )
  on conflict (domain, period_start, period_end, reporter_org) do update set
    leaf_hash = excluded.leaf_hash,
    dkim_pass_count = excluded.dkim_pass_count,
    dkim_fail_count = excluded.dkim_fail_count,
    domain_hash = excluded.domain_hash,
    reporter_hash = excluded.reporter_hash,
    selector_hash = excluded.selector_hash,
    source_ip_hash = excluded.source_ip_hash,
    report_hash = excluded.report_hash,
    selectors = excluded.selectors,
    ip_ranges = excluded.ip_ranges
  returning leaf_index into v_index;

  return v_index;
end;
$$;

revoke all on function insert_leaf(
  bytea, text, bigint, bigint, text, bigint, bigint,
  bytea, bytea, bytea, bytea, bytea, text[], text[]
) from public;
grant execute on function insert_leaf(
  bytea, text, bigint, bigint, text, bigint, bigint,
  bytea, bytea, bytea, bytea, bytea, text[], text[]
) to service_role;

-- Row-level security: public read for staging page; writes via service role only

alter table domains enable row level security;
alter table leaves enable row level security;
alter table merkle_roots enable row level security;
alter table processed_reports enable row level security;

drop policy if exists "public_read_domains" on domains;
create policy "public_read_domains"
  on domains for select
  to anon, authenticated
  using (true);

drop policy if exists "public_read_leaves" on leaves;
create policy "public_read_leaves"
  on leaves for select
  to anon, authenticated
  using (true);

drop policy if exists "public_read_merkle_roots" on merkle_roots;
create policy "public_read_merkle_roots"
  on merkle_roots for select
  to anon, authenticated
  using (true);
