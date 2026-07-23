import type { TrustScoreProgress } from '@pact/core';

/** Section 4.6 — progress hint for domains with raw T < 3. */
export function formatScoreProgressHint(
  progress: TrustScoreProgress,
  rawScore: number,
): string | null {
  if (rawScore >= 3) return null;

  if (progress.daysToNextBand != null && progress.nextBandLabel) {
    return `About ${progress.daysToNextBand} more days to reach "${progress.nextBandLabel}", at this pace.`;
  }

  if (rawScore > 0) {
    return 'A bit more time and activity will move this forward.';
  }

  return 'This starts moving the moment your first email is confirmed.';
}
