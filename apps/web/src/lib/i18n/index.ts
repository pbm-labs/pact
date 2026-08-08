import type { Locale } from '@/lib/preferences';
import type { Dictionary } from './types';
import { en } from './dictionaries/en';
import { es } from './dictionaries/es';
import { de } from './dictionaries/de';

const dictionaries: Record<Locale, Dictionary> = { en, es, de };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export type { Dictionary } from './types';
