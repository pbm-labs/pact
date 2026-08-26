'use client';

import { useLocale } from '@/components/locale-provider';
import { LOCALES } from '@/lib/preferences';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t, mounted } = useLocale();

  if (!mounted) {
    return <div className={`h-8 w-16 ${className}`} aria-hidden />;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role="group"
      aria-label={t.nav.language}
    >
      {LOCALES.map(({ code, label }, index) => {
        const active = locale === code;
        return (
          <span key={code} className="inline-flex items-center gap-2">
            {index > 0 ? <span className="text-muted-2 text-xs">/</span> : null}
            <button
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={active}
              className={`text-xs font-semibold tracking-wide ${
                active ? 'text-txt' : 'text-muted hover:text-txt'
              }`}
            >
              {label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
