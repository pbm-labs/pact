import type { Locale } from '@/lib/preferences';
import { WHITEPAPER_EN } from './en';
import { WHITEPAPER_FR } from './fr';

export const WHITEPAPERS: Record<Locale, string> = {
  en: WHITEPAPER_EN,
  fr: WHITEPAPER_FR,
};

export function getWhitepaper(locale: Locale): string {
  return WHITEPAPERS[locale] ?? WHITEPAPER_EN;
}
