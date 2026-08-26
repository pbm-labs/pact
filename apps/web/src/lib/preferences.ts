export type Locale = 'en' | 'fr';

export const STORAGE_KEYS = {
  locale: 'pact-locale',
} as const;

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALES: { code: Locale; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
];

export function parseLocale(value: string | null | undefined): Locale {
  return value === 'fr' ? 'fr' : DEFAULT_LOCALE;
}

export function persistLocale(locale: Locale): void {
  if (typeof document === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.locale, locale);
  document.cookie = `${STORAGE_KEYS.locale}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  return parseLocale(localStorage.getItem(STORAGE_KEYS.locale));
}
