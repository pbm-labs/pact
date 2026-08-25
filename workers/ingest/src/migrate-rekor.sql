-- Remote D1: v0.4 Rekor stream.
-- Run once against an existing ledger:
--   ALTER TABLE domains ADD COLUMN rekor_synced_at TEXT;
-- (D1 SQLite has no ADD COLUMN IF NOT EXISTS.)
-- Fresh databases already have this from schema.sql.

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
