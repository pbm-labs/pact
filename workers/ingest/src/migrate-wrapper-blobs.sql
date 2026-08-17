CREATE TABLE IF NOT EXISTS wrapper_blobs (
  wrapper_hash TEXT PRIMARY KEY,
  rfc822 BLOB NOT NULL,
  meta_json TEXT NOT NULL,
  byte_length INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
