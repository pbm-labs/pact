import type { TrustScoreProgress } from '@pact/core';

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

export function formatVerifiedDays(pactAgeDays: number): string {
  const days = Math.max(0, Math.floor(pactAgeDays));
  if (days === 0) return 'First day';
  if (days === 1) return '1 day';
  return `${days} days`;
}

/** Section 4.6 — progress hint for domains still building history. */
export function formatScoreProgressHint(
  progress: TrustScoreProgress,
  rawScore: number,
): string | null {
  if (rawScore >= 3) return null;

  if (progress.daysToNextBand != null && progress.nextBandLabel) {
    return `About ${progress.daysToNextBand} more days to reach "${progress.nextBandLabel}", at this pace.`;
  }

  if (rawScore > 0) {
    return 'History keeps building with every independent confirmation.';
  }

  return 'This starts moving the moment you\u2019re first confirmed.';
}
