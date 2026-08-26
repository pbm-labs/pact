/**
 * Independently confirmed history starts when the name is put on the ledger.
 * Leftover CT/Rekor timestamps may predate connect; they are stream metadata, not this clock.
 */

/** SQLite `datetime('now')` is UTC without a timezone suffix. Treat it as UTC. */
export function parseLedgerDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const sqlite = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.\d+)?$/.exec(trimmed);
  if (sqlite) {
    const ms = Date.parse(`${sqlite[1]}T${sqlite[2]}Z`);
    return Number.isFinite(ms) && ms > 0 ? new Date(ms) : null;
  }

  const ms = Date.parse(trimmed);
  return Number.isFinite(ms) && ms > 0 ? new Date(ms) : null;
}

export function pactHistoryStartFromConnect(connectedAt: string | null | undefined): Date {
  return parseLedgerDateTime(connectedAt) ?? new Date();
}

export function pactAgeDaysFrom(start: Date, asOf = new Date()): number {
  return Math.max(0, (asOf.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}
