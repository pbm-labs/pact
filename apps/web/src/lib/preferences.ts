export type Locale = 'en' | 'es' | 'de' | 'fr';

export const STORAGE_KEYS = {
  locale: 'pact-locale',
} as const;

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALES: { code: Locale; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'fr', label: 'FR', name: 'Français' },
];

export function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const value = localStorage.getItem(STORAGE_KEYS.locale);
  return value === 'en' || value === 'es' || value === 'de' || value === 'fr'
    ? value
    : DEFAULT_LOCALE;
}
