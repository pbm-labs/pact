'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { LOCALES } from '@/lib/preferences';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t, mounted } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((item) => item.code === locale) ?? LOCALES[0]!;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!mounted) {
    return <div className={`h-8 w-[4.5rem] ${className}`} aria-hidden />;
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 h-8 pl-2 pr-1.5 rounded-md border border-border bg-bg text-muted hover:text-txt hover:border-border-h"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t.nav.language}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-[11px] font-semibold tracking-wide">{current.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={open ? 'rotate-180' : ''}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.nav.language}
          className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[9.5rem] rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {LOCALES.map(({ code, label, name }) => {
            const isActive = locale === code;
            return (
              <li key={code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm ${
                    isActive
                      ? 'text-txt bg-surface-2'
                      : 'text-muted hover:text-txt hover:bg-surface-2/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 text-[11px] font-semibold tracking-wide text-accent">
                      {label}
                    </span>
                    <span>{name}</span>
                  </span>
                  {isActive && <span className="text-accent text-xs">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
