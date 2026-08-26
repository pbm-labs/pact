-- PACT ledger (Cloudflare D1). Roots live on-chain; this is leaf availability.

CREATE TABLE IF NOT EXISTS domains (
  domain TEXT PRIMARY KEY,
  connected_at TEXT NOT NULL DEFAULT (datetime('now')),
  domain_registered_at TEXT,
  ct_synced_at TEXT,
  rekor_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS processed_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id TEXT NOT NULL,
  reporter_org TEXT NOT NULL,
  period_start INTEGER NOT NULL,
  period_end INTEGER NOT NULL,
  header_from TEXT NOT NULL,
  envelope_sender TEXT,
  dkim_domain TEXT,
  dkim_selector TEXT,
  wrapper_hash TEXT,
  wrapper_dkim TEXT,
  processed_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (report_id, reporter_org, period_start, period_end, header_from)
);

CREATE TABLE IF NOT EXISTS leaves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  leaf_index INTEGER NOT NULL UNIQUE,
  leaf_hash TEXT NOT NULL,
  domain TEXT NOT NULL,
  period_start INTEGER NOT NULL,
  period_end INTEGER NOT NULL,
  reporter_org TEXT NOT NULL,
  dkim_pass_count INTEGER NOT NULL DEFAULT 0,
  dkim_fail_count INTEGER NOT NULL DEFAULT 0,
  domain_hash TEXT NOT NULL,
  reporter_hash TEXT NOT NULL,
  selector_hash TEXT NOT NULL,
  source_ip_hash TEXT NOT NULL,
  report_hash TEXT NOT NULL,
  wrapper_hash TEXT NOT NULL DEFAULT '',
  wrapper_dkim_hash TEXT NOT NULL DEFAULT '',
  selectors TEXT NOT NULL DEFAULT '[]',
  ip_ranges TEXT NOT NULL DEFAULT '[]',
  wrapper_hashes TEXT NOT NULL DEFAULT '[]',
  wrapper_dkim TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (domain, period_start, period_end, reporter_org),
  FOREIGN KEY (domain) REFERENCES domains(domain)
);

CREATE TABLE IF NOT EXISTS merkle_roots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  root_hash TEXT NOT NULL,
  leaf_count INTEGER NOT NULL,
  published_at TEXT NOT NULL DEFAULT (datetime('now')),
  anchor_type TEXT NOT NULL CHECK (anchor_type IN ('staging', 'base')),
  tx_hash TEXT,
  block_number INTEGER
);

CREATE INDEX IF NOT EXISTS leaves_domain_idx ON leaves (domain);
CREATE INDEX IF NOT EXISTS merkle_roots_published_at_idx ON merkle_roots (published_at DESC);

-- v0.3 CT binding. Separate encoding from DMARC leaves; same tree via leaf_index.
CREATE TABLE IF NOT EXISTS ct_certs (
  domain TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  leaf_index INTEGER NOT NULL UNIQUE,
  leaf_hash TEXT NOT NULL,
  log_id TEXT NOT NULL,
  log_index INTEGER NOT NULL,
  logged_at INTEGER NOT NULL,
  not_before INTEGER NOT NULL,
  not_after INTEGER NOT NULL,
  issuer TEXT NOT NULL DEFAULT '',
  common_name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (domain, fingerprint),
  FOREIGN KEY (domain) REFERENCES domains(domain)
);

CREATE INDEX IF NOT EXISTS ct_certs_domain_idx ON ct_certs (domain);
CREATE INDEX IF NOT EXISTS ct_certs_leaf_hash_idx ON ct_certs (leaf_hash);

-- v0.4 Rekor binding. Separate encoding; same tree via leaf_index.
CREATE TABLE IF NOT EXISTS rekor_entries (
  domain TEXT NOT NULL,
  uuid TEXT NOT NULL,
  leaf_index INTEGER NOT NULL UNIQUE,
  leaf_hash TEXT NOT NULL,
  log_id TEXT NOT NULL,
  log_index INTEGER NOT NULL,
  integrated_time INTEGER NOT NULL,
  identity TEXT NOT NULL,
  entry_kind TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (domain, uuid),
  FOREIGN KEY (domain) REFERENCES domains(domain)
);

CREATE INDEX IF NOT EXISTS rekor_entries_domain_idx ON rekor_entries (domain);
CREATE INDEX IF NOT EXISTS rekor_entries_leaf_hash_idx ON rekor_entries (leaf_hash);
