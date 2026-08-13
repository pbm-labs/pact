// Same formula as @pact/core ACTIVATION_DAYS. Do not import @pact/core here —
// this module is used from client components, and the core package pulls Node builtins.
const MATURITY_LAMBDA = 0.005;
const ACTIVATION_THRESHOLD = 0.5;
export const ACTIVATION_DAYS = Math.ceil(
  -Math.log(1 - ACTIVATION_THRESHOLD) / MATURITY_LAMBDA,
);

/** First independent reporter is the prerequisite that starts the history clock. */
export const MIN_INDEPENDENT_REPORTERS = 1;

export type PathToProvenStatus = 'waiting' | 'provisional' | 'activated';

export interface PathToProvenState {
  hidden: boolean;
  daysMet: boolean;
  reportersMet: boolean;
  days: number;
  reporters: number;
  activationDays: number;
}

export function pathToProven(input: {
  status: PathToProvenStatus;
  pactAgeDays: number;
  uniqueReporters: number;
}): PathToProvenState {
  const days = Math.max(0, Math.floor(input.pactAgeDays));
  const reporters = Math.max(0, Math.floor(input.uniqueReporters));
  const daysMet = days >= ACTIVATION_DAYS;
  const reportersMet = reporters >= MIN_INDEPENDENT_REPORTERS;

  return {
    hidden: input.status === 'activated' || (daysMet && reportersMet),
    daysMet,
    reportersMet,
    days,
    reporters,
    activationDays: ACTIVATION_DAYS,
  };
}
