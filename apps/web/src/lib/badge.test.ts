import { describe, expect, it } from 'vitest';
import {
  BADGE_HEIGHT,
  BADGE_THEMES,
  DEFAULT_BADGE_THEME,
  GAP_ICON_TEXT,
  ICON_D,
  LEFT_W,
  MAX_DOMAIN_CHARS,
  PAD_L,
  PAD_R,
  STATE_PALETTES,
  STATE_W_RESERVED,
  STATE_WORDS,
  isBadgeTheme,
  rightWidthFor,
  sizeBadge,
  truncateDomain,
} from './badge-dimensions';
import { parsePreviewState, snapshotFromRecord } from './badge-state';

describe('badge-dimensions (Split Pill v1)', () => {
  describe('constants', () => {
    it('exposes a stable height + fixed left half', () => {
      expect(BADGE_HEIGHT).toBe(32);
      expect(LEFT_W).toBeGreaterThan(0);
    });

    it('ships sane inner-layout primitives', () => {
      expect(ICON_D).toBeGreaterThan(0);
      expect(GAP_ICON_TEXT).toBeGreaterThan(0);
      expect(PAD_L).toBeGreaterThan(0);
      expect(PAD_R).toBeGreaterThan(0);
      const longest = Math.max(...Object.values(STATE_WORDS).map((w) => w.length));
      expect(STATE_W_RESERVED).toBeGreaterThanOrEqual(longest * 6);
    });

    it('exposes one state word per public tier', () => {
      expect(STATE_WORDS.verified).toBe('Proven');
      expect(STATE_WORDS.building).toBe('Building');
      expect(Object.keys(STATE_WORDS)).toHaveLength(2);
    });
  });

  describe('themes', () => {
    it('ships a light + dark palette for the right half', () => {
      expect(BADGE_THEMES.dark.rightBg).toBe('#131316');
      expect(BADGE_THEMES.dark.rightFg).toBe('#e8e8f2');
      expect(BADGE_THEMES.dark.border).toBe('#25252f');
      expect(BADGE_THEMES.light.rightBg).toBe('#ffffff');
      expect(BADGE_THEMES.light.rightFg).toBe('#18181e');
      expect(BADGE_THEMES.light.border).toBe('#e0e0ec');
    });

    it('uses we build real brand + amber for the left half', () => {
      expect(STATE_PALETTES.verified.bg).toBe('#7c6af7');
      expect(STATE_PALETTES.verified.fg).toBe('#ffffff');
      expect(STATE_PALETTES.building.bg).toBe('#f59e0b');
      expect(STATE_PALETTES.building.fg).toBe('#0c0c0f');
    });

    it('defaults to dark', () => {
      expect(DEFAULT_BADGE_THEME).toBe('dark');
    });

    it('isBadgeTheme guards external input', () => {
      expect(isBadgeTheme('light')).toBe(true);
      expect(isBadgeTheme('dark')).toBe(true);
      expect(isBadgeTheme('amoled')).toBe(false);
      expect(isBadgeTheme(null)).toBe(false);
      expect(isBadgeTheme(undefined)).toBe(false);
      expect(isBadgeTheme('')).toBe(false);
    });
  });

  describe('truncateDomain', () => {
    it('passes short domains through untouched', () => {
      expect(truncateDomain('acme.com')).toBe('acme.com');
      expect(truncateDomain('webuildreal.dev')).toBe('webuildreal.dev');
    });

    it('tail-truncates long domains with an ellipsis', () => {
      const long = 'very-long-subdomain.example-corp.studio';
      const out = truncateDomain(long);
      expect(out.length).toBe(MAX_DOMAIN_CHARS);
      expect(out.endsWith('…')).toBe(true);
    });

    it('respects the max-char budget exactly at the boundary', () => {
      const exact = 'a'.repeat(MAX_DOMAIN_CHARS);
      expect(truncateDomain(exact)).toBe(exact);
    });
  });

  describe('rightWidthFor + sizeBadge', () => {
    it('right half grows with domain length', () => {
      const short = rightWidthFor('a.io');
      const long = rightWidthFor('very-long-company.studio');
      expect(long).toBeGreaterThan(short);
    });

    it('right half has a sane floor for very short domains', () => {
      expect(rightWidthFor('a.io')).toBeGreaterThanOrEqual(80);
    });

    it('sizeBadge composes total width as LEFT_W + right half', () => {
      const domain = 'acme.studio';
      const total = sizeBadge(domain);
      expect(total.height).toBe(BADGE_HEIGHT);
      expect(total.width).toBe(LEFT_W + rightWidthFor(domain));
    });

    it('sizeBadge is state-agnostic', () => {
      expect(sizeBadge('webuildreal.dev')).toEqual(sizeBadge('webuildreal.dev'));
    });

    it('sizeBadge caps at MAX_DOMAIN_CHARS for pathological domains', () => {
      const pathological = 'a'.repeat(60) + '.com';
      const cap = 'a'.repeat(MAX_DOMAIN_CHARS);
      expect(sizeBadge(pathological).width).toBe(sizeBadge(cap).width);
    });
  });
});

describe('badge-state', () => {
  it('parsePreviewState accepts marketing aliases', () => {
    expect(parsePreviewState('verified')).toBe('verified');
    expect(parsePreviewState('proven')).toBe('verified');
    expect(parsePreviewState('building')).toBe('building');
    expect(parsePreviewState('unknown')).toBeNull();
    expect(parsePreviewState(null)).toBeNull();
  });

  it('snapshotFromRecord fails closed without a record or leaves', () => {
    expect(snapshotFromRecord({ found: false, leafCount: 0 })).toEqual({
      state: 'building',
      count: 0,
    });
    expect(snapshotFromRecord({ found: true, leafCount: 0 })).toEqual({
      state: 'building',
      count: 0,
    });
  });

  it('snapshotFromRecord maps activated trust to Proven', () => {
    expect(
      snapshotFromRecord({ found: true, leafCount: 12, status: 'activated' }),
    ).toEqual({ state: 'verified', count: 12 });
    expect(
      snapshotFromRecord({ found: true, leafCount: 12, status: 'provisional' }),
    ).toEqual({ state: 'building', count: 12 });
  });
});
