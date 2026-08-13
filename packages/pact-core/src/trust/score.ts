export const SCORE_ALGORITHM = 'pact-score-0.1' as const;
export const MATURITY_LAMBDA = 0.005;
export const ACTIVATION_THRESHOLD = 0.5;
/** Calendar days of PACT history at which maturity reaches ACTIVATION_THRESHOLD. */
export const ACTIVATION_DAYS = Math.ceil(
  -Math.log(1 - ACTIVATION_THRESHOLD) / MATURITY_LAMBDA,
);

export type ScoreStatus = 'provisional' | 'activated';

/**
 * pactHistoryStart feeds the trust score formula only.
 * domainRegisteredAt is display context — NEVER used in score math.
 * See pact_protocol_v01.md Section 4.2.
 */
export interface DomainTrustInput {
  totalPassCount: number;
  leafCount: number;
  reportingOrgsCount: number;
  pactHistoryStart: Date;
  domainRegisteredAt?: Date | null;
  asOf?: Date;
}

export interface TrustScoreResult {
  algorithm: typeof SCORE_ALGORITHM;
  score: number;
  volume: number;
  diversity: number;
  maturity: number;
  /** Days since first PACT aggregate report — not domain registration age. */
  pactAgeDays: number;
  /** Passed through for display; never folded into score or maturity. */
  domainRegisteredAt: number | null;
  status: ScoreStatus;
}

/** Unique reporting orgs / leaf count — capped at 1.0. */
export function computeDiversity(reportingOrgsCount: number, leafCount: number): number {
  if (leafCount <= 0) return 0;
  return Math.min(reportingOrgsCount / leafCount, 1);
}

export function computeMaturity(pactAgeDays: number): number {
  if (pactAgeDays <= 0) return 0;
  return 1 - Math.exp(-MATURITY_LAMBDA * pactAgeDays);
}

export function computeTrustScore(input: DomainTrustInput): TrustScoreResult {
  const asOf = input.asOf ?? new Date();
  const pactAgeMs = asOf.getTime() - input.pactHistoryStart.getTime();
  const pactAgeDays = Math.max(0, pactAgeMs / (1000 * 60 * 60 * 24));

  const volume = Math.log(input.totalPassCount + 1);
  const diversity = computeDiversity(input.reportingOrgsCount, input.leafCount);
  const maturity = computeMaturity(pactAgeDays);
  const score = volume * diversity * maturity;

  const domainRegisteredAt =
    input.domainRegisteredAt != null ? input.domainRegisteredAt.getTime() : null;

  return {
    algorithm: SCORE_ALGORITHM,
    score,
    volume,
    diversity,
    maturity,
    pactAgeDays,
    domainRegisteredAt,
    status: maturity >= ACTIVATION_THRESHOLD ? 'activated' : 'provisional',
  };
}
