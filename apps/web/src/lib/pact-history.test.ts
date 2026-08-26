import { describe, expect, it } from 'vitest';
import {
  pactAgeDaysFrom,
  pactHistoryStartFromConnect,
  parseLedgerDateTime,
} from './pact-history';

describe('parseLedgerDateTime', () => {
  it('treats SQLite datetime as UTC', () => {
    const parsed = parseLedgerDateTime('2026-08-18 10:39:18');
    expect(parsed?.toISOString()).toBe('2026-08-18T10:39:18.000Z');
  });

  it('keeps ISO instants', () => {
    expect(parseLedgerDateTime('2026-08-20T12:00:00.000Z')?.toISOString()).toBe(
      '2026-08-20T12:00:00.000Z',
    );
  });

  it('returns null for empty or junk', () => {
    expect(parseLedgerDateTime(null)).toBeNull();
    expect(parseLedgerDateTime('')).toBeNull();
    expect(parseLedgerDateTime('not-a-date')).toBeNull();
  });
});

describe('pactHistoryStartFromConnect', () => {
  it('starts at connect, not leftover log timestamps', () => {
    const connected = '2026-08-20T12:00:00.000Z';
    expect(pactHistoryStartFromConnect(connected).toISOString()).toBe(connected);
  });

  it('does not inherit a leftover date when connect is missing', () => {
    const start = pactHistoryStartFromConnect(null);
    expect(Math.abs(start.getTime() - Date.now())).toBeLessThan(5_000);
  });
});

describe('pactAgeDaysFrom', () => {
  it('counts whole days since connect', () => {
    const start = new Date('2026-08-20T12:00:00.000Z');
    const asOf = new Date('2026-08-25T12:00:00.000Z');
    expect(pactAgeDaysFrom(start, asOf)).toBe(5);
  });
});
