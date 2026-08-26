/**
 * Independently confirmed history starts when the name is put on the ledger.
 * Leftover CT/Rekor timestamps may predate connect; they are stream metadata, not this clock.
 */
export function pactHistoryStartFromConnect(
  connectedAt: string | null | undefined,
  fallbackTraceMs: number | null = null,
): Date {
  if (connectedAt) {
    const ms = Date.parse(connectedAt);
    if (Number.isFinite(ms) && ms > 0) return new Date(ms);
  }
  if (fallbackTraceMs != null && Number.isFinite(fallbackTraceMs) && fallbackTraceMs > 0) {
    return new Date(fallbackTraceMs);
  }
  return new Date();
}

export function pactAgeDaysFrom(start: Date, asOf = new Date()): number {
  return Math.max(0, (asOf.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}
