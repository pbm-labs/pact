// Badge layout constants for the Split Pill (ETag: v1).
//
//   ┌──────────────────┬──────────────────┐
//   │  ✓  Proven       │     acme.com     │
//   └──────────────────┴──────────────────┘
//      tinted (state)        neutral (theme-aware)
//
// LEFT  — variable status. Background changes with the tier
//         (green for Proven, amber for Building) and carries
//         the state icon + state word. Fixed width so a Proven
//         badge and a Building badge for the same domain share
//         the exact same canvas — no reflow on graduation.
// RIGHT — the domain itself. Theme-aware neutral background
//         (light or dark) + monospace domain text. Variable
//         width — adapts to the domain length.
//
// Brand attribution lives in the click target
// (`webuildreal.dev/records/<domain>`), not in the rendered pixels.
//
// This module is pure JS — safe to import from server routes and
// client components alike, which keeps the rendered image and the
// `<img>` element's advertised dimensions in lockstep.

import type { BadgeState } from '@/lib/badge-state';

export const BADGE_HEIGHT = 32;

// LEFT half is a constant 104px — wide enough for the longest state
// word ("Building") + icon + pads, with slack so "Proven" and
// "Building" share the same left canvas.
export const LEFT_W = 104;

export const PAD_L = 10;
export const PAD_R = 12;
export const ICON_D = 14;
export const GAP_ICON_TEXT = 8;

const CHAR_W = 7.8;

// English-only on purpose: badges live in email signatures that cross
// locale boundaries, and an `<img>` URL isn't a reliable place to derive
// a caller locale. `verified` is the internal state key (matches
// `?preview=verified`); the rendered word is "Proven" to match the
// public record page.
export const STATE_WORDS: Record<BadgeState, string> = {
  verified: 'Proven',
  building: 'Building',
};

const STATE_WORD_MAX_CHARS = Math.max(
  ...Object.values(STATE_WORDS).map((w) => w.length),
);
export const STATE_W_RESERVED = STATE_WORD_MAX_CHARS * CHAR_W;

export type BadgeTheme = 'light' | 'dark';

export const DEFAULT_BADGE_THEME: BadgeTheme = 'dark';

export interface BadgeThemePalette {
  rightBg: string;
  rightFg: string;
  border: string;
}

export const BADGE_THEMES: Record<BadgeTheme, BadgeThemePalette> = {
  dark: {
    rightBg: '#131316',
    rightFg: '#e8e8f2',
    border: '#0c0c0f',
  },
  light: {
    rightBg: '#ffffff',
    rightFg: '#18181e',
    border: '#e0e0ec',
  },
};

export function isBadgeTheme(value: string | null | undefined): value is BadgeTheme {
  return value === 'light' || value === 'dark';
}

const MIN_RIGHT_W = 88;
export const MAX_DOMAIN_CHARS = 26;

export function truncateDomain(domain: string): string {
  if (domain.length <= MAX_DOMAIN_CHARS) return domain;
  return domain.slice(0, MAX_DOMAIN_CHARS - 1) + '…';
}

export function rightWidthFor(domain: string): number {
  const text = truncateDomain(domain);
  const w = Math.ceil(text.length * CHAR_W) + PAD_R * 2;
  return Math.max(w, MIN_RIGHT_W);
}

export function sizeBadge(domain: string): {
  width: number;
  height: number;
} {
  return {
    width: LEFT_W + rightWidthFor(domain),
    height: BADGE_HEIGHT,
  };
}
