import { describe, expect, it } from 'vitest';
import {
  computeExampleScore,
  computeDiversity,
  computeMaturity,
  ACTIVATION_DAYS,
  ACTIVATION_THRESHOLD,
  formatScoreForDisplay,
  estimateScoreProgress,
  DISPLAY_VERSION,
} from './index.js';

describe('example-score-0.1', () => {
  it('returns provisional for new independently confirmed history', () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = computeExampleScore({
      totalPassCount: 1247,
      reportCount: 2,
      reportingOrgsCount: 1,
      independentlyConfirmedSince: oneDayAgo,
    });
    expect(result.algorithm).toBe('example-score-0.1');
    expect(result.status).toBe('provisional');
    expect(result.score).toBeGreaterThan(0);
    expect(result.independentlyConfirmedDays).toBeGreaterThan(0);
    expect(result.independentlyConfirmedDays).toBeLessThan(2);
  });

  it('passes domainRegisteredAt through without affecting maturity', () => {
    const oldRegistration = new Date('2010-01-01');
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const withoutReg = computeExampleScore({
      totalPassCount: 10_000,
      reportCount: 100,
      reportingOrgsCount: 5,
      independentlyConfirmedSince: oneDayAgo,
    });
    const withReg = computeExampleScore({
      totalPassCount: 10_000,
      reportCount: 100,
      reportingOrgsCount: 5,
      independentlyConfirmedSince: oneDayAgo,
      domainRegisteredAt: oldRegistration,
    });
    expect(withReg.maturity).toBe(withoutReg.maturity);
    expect(withReg.score).toBe(withoutReg.score);
    expect(withReg.domainRegisteredAt).toBe(oldRegistration.getTime());
  });

  it('computes diversity as reporting orgs per report', () => {
    expect(computeDiversity(2, 4)).toBe(0.5);
    expect(computeDiversity(1, 0)).toBe(0);
  });

  it('ACTIVATION_DAYS is the first calendar day maturity crosses the example gate', () => {
    expect(computeMaturity(ACTIVATION_DAYS - 1)).toBeLessThan(ACTIVATION_THRESHOLD);
    expect(computeMaturity(ACTIVATION_DAYS)).toBeGreaterThanOrEqual(ACTIVATION_THRESHOLD);
  });

  it('hijacking simulation: old domain registration does not inflate maturity on new history', () => {
    const hijackedDomainRegistration = new Date('2005-06-01');
    const firstReport = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const result = computeExampleScore({
      totalPassCount: 50_000,
      reportCount: 200,
      reportingOrgsCount: 3,
      independentlyConfirmedSince: firstReport,
      domainRegisteredAt: hijackedDomainRegistration,
    });

    const withoutRegistration = computeExampleScore({
      totalPassCount: 50_000,
      reportCount: 200,
      reportingOrgsCount: 3,
      independentlyConfirmedSince: firstReport,
    });

    expect(result.maturity).toBe(withoutRegistration.maturity);
    expect(result.maturity).toBeLessThan(0.02);
    expect(result.status).toBe('provisional');
  });
});

describe('example-display-0.1', () => {
  it('maps raw T = 0 to zero display with no-history label', () => {
    const display = formatScoreForDisplay(0);
    expect(display.displayScore).toBe(0);
    expect(display.label).toBe('No history yet');
  });

  it('maps small non-zero raw T to at least 1/100 with provisional label', () => {
    const display = formatScoreForDisplay(0.019);
    expect(display.displayVersion).toBe(DISPLAY_VERSION);
    expect(display.band).toBe('no_history_yet');
    expect(display.label).toBe('Provisional');
    expect(display.displayScore).toBeGreaterThanOrEqual(1);
    expect(display.displayScore).toBeLessThan(10);
    expect(display.rawScore).toBeCloseTo(0.019);
  });

  it('maps early score (~0.02) to 1/100 provisional', () => {
    const display = formatScoreForDisplay(0.023);
    expect(display.displayScore).toBe(1);
    expect(display.label).toBe('Provisional');
  });

  it('maps raw T = 5 to established band', () => {
    const display = formatScoreForDisplay(5);
    expect(display.band).toBe('established');
    expect(display.displayScore).toBeGreaterThanOrEqual(35);
    expect(display.displayScore).toBeLessThan(65);
  });

  it('clamps raw T >= 20 to display 100', () => {
    expect(formatScoreForDisplay(20).displayScore).toBe(100);
    expect(formatScoreForDisplay(50).displayScore).toBe(100);
  });

  it('does not alter raw score in result', () => {
    const raw = 2.718;
    expect(formatScoreForDisplay(raw).rawScore).toBe(raw);
  });
});

describe('estimateScoreProgress', () => {
  it('estimates days to Early when volume × diversity can reach T = 1', () => {
    const progress = estimateScoreProgress({
      rawScore: 0.5,
      volume: 5,
      diversity: 0.5,
      independentlyConfirmedDays: 100,
    });
    expect(progress.nextBandLabel).toBe('Early');
    expect(progress.nextBandKey).toBe('early');
    expect(progress.daysToNextBand).not.toBeNull();
    expect(progress.daysToNextBand!).toBeGreaterThan(0);
    expect(progress.daysToNextBand!).toBeLessThan(30);
  });

  it('returns null days when time alone cannot reach the next band', () => {
    const progress = estimateScoreProgress({
      rawScore: 0.023,
      volume: 2.079,
      diversity: 0.25,
      independentlyConfirmedDays: 9,
    });
    expect(progress.independentlyConfirmedDays).toBe(9);
    expect(progress.daysToNextBand).toBeNull();
    expect(progress.nextBandLabel).toBeNull();
    expect(progress.nextBandKey).toBeNull();
  });

  it('returns null when already at maximum interpretation band', () => {
    const progress = estimateScoreProgress({
      rawScore: 12,
      volume: 10,
      diversity: 0.8,
      independentlyConfirmedDays: 800,
    });
    expect(progress.daysToNextBand).toBeNull();
    expect(progress.nextBandLabel).toBeNull();
    expect(progress.nextBandKey).toBeNull();
  });
});
