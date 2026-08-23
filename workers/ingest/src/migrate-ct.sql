-- Remote D1: v0.3 Certificate Transparency stream.
-- Run once: ALTER TABLE domains ADD COLUMN ct_synced_at TEXT;
-- (D1 SQLite has no ADD COLUMN IF NOT EXISTS.)

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
