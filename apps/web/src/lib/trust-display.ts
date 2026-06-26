import type { TrustScoreProgress } from '@pact/core';

/** Section 4.6 — progress hint for domains with raw T < 3. */
export function formatScoreProgressHint(
  progress: TrustScoreProgress,
  rawScore: number,
): string | null {
  if (rawScore >= 3) return null;

  if (progress.daysToNextBand != null && progress.nextBandLabel) {
    return `~${progress.daysToNextBand} days until "${progress.nextBandLabel}" range, at current activity levels`;
  }

  if (rawScore > 0) {
    return 'More verified volume or reporter diversity is needed before time alone can reach the next range.';
  }

  return 'Verified PACT history begins with the first DKIM-pass reports.';
}
