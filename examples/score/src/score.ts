/**
 * Informative example: one way to interpret a PACT public record.
 * Not protocol. Do not import this from `@pact/core`.
 * See docs/examples/scoring.md.
 */

export const SCORE_ALGORITHM = 'example-score-0.1' as const;
export const MATURITY_LAMBDA = 0.005;
export const ACTIVATION_THRESHOLD = 0.5;
/** Calendar days of independently confirmed history at which maturity reaches ACTIVATION_THRESHOLD. */
export const ACTIVATION_DAYS = Math.ceil(
  -Math.log(1 - ACTIVATION_THRESHOLD) / MATURITY_LAMBDA,
);

export type ScoreStatus = 'provisional' | 'activated';

/**
 * Fields taken from a published PACT record.
 * independentlyConfirmedSince feeds the formula only.
 * domainRegisteredAt is pass-through — NEVER used in score math.
 */
export interface PublicRecordInput {
  totalPassCount: number;
  reportCount: number;
  reportingOrgsCount: number;
  independentlyConfirmedSince: Date;
  domainRegisteredAt?: Date | null;
  asOf?: Date;
}

export interface ExampleScoreResult {
  algorithm: typeof SCORE_ALGORITHM;
  score: number;
  volume: number;
  diversity: number;
  maturity: number;
  independentlyConfirmedDays: number;
  domainRegisteredAt: number | null;
  status: ScoreStatus;
}

/** Unique reporting orgs / report count — capped at 1.0. */
export function computeDiversity(reportingOrgsCount: number, reportCount: number): number {
  if (reportCount <= 0) return 0;
  return Math.min(reportingOrgsCount / reportCount, 1);
}

export function computeMaturity(independentlyConfirmedDays: number): number {
  if (independentlyConfirmedDays <= 0) return 0;
  return 1 - Math.exp(-MATURITY_LAMBDA * independentlyConfirmedDays);
}

export function computeExampleScore(input: PublicRecordInput): ExampleScoreResult {
  const asOf = input.asOf ?? new Date();
  const confirmedMs = asOf.getTime() - input.independentlyConfirmedSince.getTime();
  const independentlyConfirmedDays = Math.max(0, confirmedMs / (1000 * 60 * 60 * 24));

  const volume = Math.log(input.totalPassCount + 1);
  const diversity = computeDiversity(input.reportingOrgsCount, input.reportCount);
  const maturity = computeMaturity(independentlyConfirmedDays);
  const score = volume * diversity * maturity;

  const domainRegisteredAt =
    input.domainRegisteredAt != null ? input.domainRegisteredAt.getTime() : null;

  return {
    algorithm: SCORE_ALGORITHM,
    score,
    volume,
    diversity,
    maturity,
    independentlyConfirmedDays,
    domainRegisteredAt,
    status: maturity >= ACTIVATION_THRESHOLD ? 'activated' : 'provisional',
  };
}
