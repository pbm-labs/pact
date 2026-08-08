import type { TrustDisplayBand, TrustScoreProgress } from '@pact/core';
import type { Dictionary } from '@/lib/i18n';

export type ScoreBandKey = TrustDisplayBand | 'provisional';

/**
 * Scaled 0–100 scores only become meaningful once raw T leaves the
 * compressed Provisional band (T ≥ 1) or maturity activates. Until then,
 * lead with verified history instead of a collapsed 1/100.
 */
export function shouldShowTrustScore(input: {
  score: number;
  status: 'provisional' | 'activated';
}): boolean {
  return input.status === 'activated' || input.score >= 1;
}

export function scoreBandKey(rawScore: number, band: TrustDisplayBand): ScoreBandKey {
  if (rawScore === 0) return 'no_history_yet';
  if (rawScore < 1) return 'provisional';
  return band;
}

export function formatVerifiedDays(pactAgeDays: number, t: Dictionary['domain']): string {
  const days = Math.max(0, Math.floor(pactAgeDays));
  if (days === 0) return t.firstDay;
  if (days === 1) return t.dayOne;
  return t.days.replace('{n}', String(days));
}

export function localizeBandLabel(key: ScoreBandKey, t: Dictionary['domain']): string {
  return t.bands[key];
}

/** Section 4.6 — progress hint for domains still building history. */
export function formatScoreProgressHint(
  progress: TrustScoreProgress,
  rawScore: number,
  t: Dictionary['domain'],
): string | null {
  if (rawScore >= 3) return null;

  if (progress.daysToNextBand != null && progress.nextBandKey) {
    const band = t.bands[progress.nextBandKey];
    return t.progressDaysToBand
      .replace('{days}', String(progress.daysToNextBand))
      .replace('{band}', band);
  }

  if (rawScore > 0) return t.progressBuilding;
  return t.progressStarts;
}
