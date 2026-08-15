ALTER TABLE leaves ADD COLUMN wrapper_hash TEXT NOT NULL DEFAULT '';
ALTER TABLE leaves ADD COLUMN wrapper_dkim_hash TEXT NOT NULL DEFAULT '';
ALTER TABLE leaves ADD COLUMN wrapper_hashes TEXT NOT NULL DEFAULT '[]';
ALTER TABLE leaves ADD COLUMN wrapper_dkim TEXT NOT NULL DEFAULT '[]';
ALTER TABLE processed_reports ADD COLUMN wrapper_hash TEXT;
ALTER TABLE processed_reports ADD COLUMN wrapper_dkim TEXT;
