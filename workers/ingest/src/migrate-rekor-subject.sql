-- Remote D1: Rekor keyed by leftover subject (host, URI, email), not domains FK.
-- 0 live Rekor rows at this migration — DROP is safe.
--
--   cd workers/ingest
--   npx wrangler d1 execute pact-ledger --remote --file=src/migrate-rekor-subject.sql

DROP TABLE IF EXISTS rekor_entries;

CREATE TABLE rekor_entries (
  identity TEXT NOT NULL,
  uuid TEXT NOT NULL,
  leaf_index INTEGER NOT NULL UNIQUE,
  leaf_hash TEXT NOT NULL,
  log_id TEXT NOT NULL,
  log_index INTEGER NOT NULL,
  integrated_time INTEGER NOT NULL,
  entry_kind TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (identity, uuid),
  UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS rekor_entries_identity_idx ON rekor_entries (identity);
CREATE INDEX IF NOT EXISTS rekor_entries_leaf_hash_idx ON rekor_entries (leaf_hash);

CREATE TABLE IF NOT EXISTS rekor_subjects (
  identity TEXT PRIMARY KEY,
  synced_at TEXT
);

-- Host leftover for names already on the ledger. GitHub URIs are not seeded from domains.
INSERT OR IGNORE INTO rekor_subjects (identity, synced_at)
SELECT domain, CASE WHEN rekor_synced_at IS NULL OR rekor_synced_at = '' THEN NULL ELSE rekor_synced_at END
FROM domains;
