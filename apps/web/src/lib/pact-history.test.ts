import { describe, expect, it } from 'vitest';
import { pactAgeDaysFrom, pactHistoryStartFromConnect } from './pact-history';

describe('pactHistoryStartFromConnect', () => {
  it('starts at connect, not at leftover log timestamps from before', () => {
    const connected = '2026-08-20T12:00:00.000Z';
    const ctFrom2018 = Date.parse('2018-03-01T00:00:00.000Z');
    const start = pactHistoryStartFromConnect(connected, ctFrom2018);
    expect(start.toISOString()).toBe(connected);
  });

  it('falls back to a trace only when connect is missing', () => {
    const trace = Date.parse('2026-08-01T00:00:00.000Z');
    expect(pactHistoryStartFromConnect(null, trace).getTime()).toBe(trace);
  });
});

describe('pactAgeDaysFrom', () => {
  it('counts whole days since connect', () => {
    const start = new Date('2026-08-20T12:00:00.000Z');
    const asOf = new Date('2026-08-25T12:00:00.000Z');
    expect(pactAgeDaysFrom(start, asOf)).toBe(5);
  });
});
