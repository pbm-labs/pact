import type { Locale } from '@/lib/preferences';
import type { Dictionary } from './types';
import { en } from './dictionaries/en';
import { fr } from './dictionaries/fr';

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export type { Dictionary } from './types';
