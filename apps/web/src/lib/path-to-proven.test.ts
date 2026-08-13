import { describe, expect, it } from 'vitest';
import { ACTIVATION_DAYS } from '@pact/core';
import { pathToProven } from './path-to-proven';

describe('pathToProven', () => {
  it('hides the checklist once the domain is Proven', () => {
    expect(
      pathToProven({ status: 'activated', pactAgeDays: 200, uniqueReporters: 4 }).hidden,
    ).toBe(true);
  });

  it('shows both items unmet while waiting for the first confirmation', () => {
    const path = pathToProven({
      status: 'waiting',
      pactAgeDays: 0,
      uniqueReporters: 0,
    });
    expect(path.hidden).toBe(false);
    expect(path.daysMet).toBe(false);
    expect(path.reportersMet).toBe(false);
    expect(path.days).toBe(0);
    expect(path.reporters).toBe(0);
  });

  it('checks reporters once history has started, but not days', () => {
    const path = pathToProven({
      status: 'provisional',
      pactAgeDays: 14,
      uniqueReporters: 4,
    });
    expect(path.hidden).toBe(false);
    expect(path.reportersMet).toBe(true);
    expect(path.daysMet).toBe(false);
    expect(path.days).toBe(14);
    expect(path.activationDays).toBe(ACTIVATION_DAYS);
  });

  it('hides when both requirements are met even if status is still provisional', () => {
    const path = pathToProven({
      status: 'provisional',
      pactAgeDays: ACTIVATION_DAYS,
      uniqueReporters: 1,
    });
    expect(path.daysMet).toBe(true);
    expect(path.reportersMet).toBe(true);
    expect(path.hidden).toBe(true);
  });

  it('keeps the card visible one day short of activation', () => {
    const path = pathToProven({
      status: 'provisional',
      pactAgeDays: ACTIVATION_DAYS - 1,
      uniqueReporters: 2,
    });
    expect(path.daysMet).toBe(false);
    expect(path.hidden).toBe(false);
  });
});
