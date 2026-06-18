export const SCORE_ALGORITHM = 'pact-score-0.2' as const;
export const MATURITY_LAMBDA = 0.005;
export const DIVERSITY_K = 50;
export const ACTIVATION_THRESHOLD = 0.5;

export type ScoreStatus = 'provisional' | 'activated';

export interface DomainTrustInput {
  totalPassCount: number;
  uniqueReporterCount: number;
  firstReportTime: Date;
  asOf?: Date;
}

export interface TrustScoreResult {
  algorithm: typeof SCORE_ALGORITHM;
  score: number;
  volume: number;
  diversity: number;
  maturity: number;
  ageDays: number;
  status: ScoreStatus;
}

function log10(x: number): number {
  return Math.log(x) / Math.log(10);
}

export function computeDiversity(uniqueReporters: number): number {
  if (uniqueReporters <= 0) return 0;
  return Math.min(1, log10(uniqueReporters + 1) / log10(DIVERSITY_K));
}

export function computeMaturity(ageDays: number): number {
  if (ageDays <= 0) return 0;
  return 1 - Math.exp(-MATURITY_LAMBDA * ageDays);
}

export function computeTrustScore(input: DomainTrustInput): TrustScoreResult {
  const asOf = input.asOf ?? new Date();
  const ageMs = asOf.getTime() - input.firstReportTime.getTime();
  const ageDays = Math.max(0, ageMs / (1000 * 60 * 60 * 24));

  const volume = Math.log10(input.totalPassCount + 1);
  const diversity = computeDiversity(input.uniqueReporterCount);
  const maturity = computeMaturity(ageDays);
  const score = volume * diversity * maturity;

  return {
    algorithm: SCORE_ALGORITHM,
    score,
    volume,
    diversity,
    maturity,
    ageDays,
    status: maturity >= ACTIVATION_THRESHOLD ? 'activated' : 'provisional',
  };
}
