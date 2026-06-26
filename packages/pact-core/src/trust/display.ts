/**
 * Human-facing trust score presentation — never an input to computeTrustScore().
 * See pact_protocol_v01.md Sections 4.5 and 4.6.
 */

import { MATURITY_LAMBDA } from './score.js';

export const DISPLAY_VERSION = 'pact-display-0.1' as const;

export type TrustDisplayBand =
  | 'no_history_yet'
  | 'early'
  | 'established'
  | 'high_confidence'
  | 'maximum_confidence';

export interface TrustDisplayScore {
  rawScore: number;
  displayScore: number;
  displayMax: 100;
  band: TrustDisplayBand;
  label: string;
  displayVersion: typeof DISPLAY_VERSION;
}

export interface TrustScoreProgress {
  pactAgeDays: number;
  daysToNextBand: number | null;
  nextBandLabel: string | null;
}

const RAW_BAND_THRESHOLDS: { max: number; label: string }[] = [
  { max: 1, label: 'Early' },
  { max: 3, label: 'Established' },
  { max: 6, label: 'High confidence' },
  { max: 9, label: 'Maximum confidence' },
];

const DISPLAY_BANDS: {
  rawMin: number;
  rawMax: number;
  displayMin: number;
  displayMax: number;
  band: TrustDisplayBand;
  label: string;
}[] = [
  {
    rawMin: 0,
    rawMax: 1,
    displayMin: 0,
    displayMax: 10,
    band: 'no_history_yet',
    label: 'No history yet',
  },
  { rawMin: 1, rawMax: 3, displayMin: 10, displayMax: 35, band: 'early', label: 'Early' },
  {
    rawMin: 3,
    rawMax: 6,
    displayMin: 35,
    displayMax: 65,
    band: 'established',
    label: 'Established',
  },
  {
    rawMin: 6,
    rawMax: 9,
    displayMin: 65,
    displayMax: 90,
    band: 'high_confidence',
    label: 'High confidence',
  },
  {
    rawMin: 9,
    rawMax: 20,
    displayMin: 90,
    displayMax: 100,
    band: 'maximum_confidence',
    label: 'Maximum confidence',
  },
];

function lerp(x: number, x0: number, x1: number, y0: number, y1: number): number {
  if (x1 === x0) return y0;
  const t = (x - x0) / (x1 - x0);
  return y0 + t * (y1 - y0);
}

export function formatScoreForDisplay(rawScore: number): TrustDisplayScore {
  const raw = Math.max(0, rawScore);

  if (raw >= 20) {
    return {
      rawScore: raw,
      displayScore: 100,
      displayMax: 100,
      band: 'maximum_confidence',
      label: 'Maximum confidence',
      displayVersion: DISPLAY_VERSION,
    };
  }

  const band =
    DISPLAY_BANDS.find((b) => raw >= b.rawMin && raw < b.rawMax) ??
    DISPLAY_BANDS[DISPLAY_BANDS.length - 1]!;

  const interpolated = lerp(raw, band.rawMin, band.rawMax, band.displayMin, band.displayMax);
  let displayScore = Math.min(100, Math.max(0, Math.round(interpolated)));

  let label = band.label;
  if (raw === 0) {
    displayScore = 0;
    label = 'No history yet';
  } else if (raw < 1) {
    displayScore = Math.max(1, displayScore);
    label = 'Provisional';
  }

  return {
    rawScore: raw,
    displayScore,
    displayMax: 100,
    band: band.band,
    label,
    displayVersion: DISPLAY_VERSION,
  };
}

/**
 * Projects days until the next raw-T interpretation band, holding volume and
 * diversity fixed. Pure presentation — never feeds computeTrustScore().
 */
export function estimateScoreProgress(input: {
  rawScore: number;
  volume: number;
  diversity: number;
  pactAgeDays: number;
}): TrustScoreProgress {
  const pactAgeDays = Math.max(0, Math.floor(input.pactAgeDays));
  const volumeDiversity = input.volume * input.diversity;

  const nextBand = RAW_BAND_THRESHOLDS.find((b) => input.rawScore < b.max);
  if (!nextBand || volumeDiversity <= 0) {
    return { pactAgeDays, daysToNextBand: null, nextBandLabel: null };
  }

  const targetMaturity = nextBand.max / volumeDiversity;
  if (targetMaturity >= 1) {
    return { pactAgeDays, daysToNextBand: null, nextBandLabel: null };
  }

  const daysNeeded = -Math.log(1 - targetMaturity) / MATURITY_LAMBDA;
  const daysToNextBand = Math.max(0, Math.ceil(daysNeeded - pactAgeDays));

  return {
    pactAgeDays,
    daysToNextBand,
    nextBandLabel: nextBand.label,
  };
}
