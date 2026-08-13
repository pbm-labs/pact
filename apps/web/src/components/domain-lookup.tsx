'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';

function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

export function DomainLookup() {
  const { t } = useLocale();
  const router = useRouter();
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const domain = normalizeDomain(value);
    if (!domain) return;
    router.push(routes.record(domain));
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch gap-2 w-full max-w-md mx-auto">
      <label className="flex-1 flex items-center bg-bg border border-border rounded-lg px-3.5 h-11 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/15 min-w-0">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-2 shrink-0 mr-2.5"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.home.lookupPlaceholder}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          inputMode="url"
          aria-label={t.home.lookupAria}
          className="bg-transparent outline-none text-base sm:text-sm font-mono text-txt placeholder:text-muted flex-1 min-w-0"
        />
      </label>
      <button
        type="submit"
        disabled={!value.trim()}
        className="shrink-0 px-4 sm:px-5 h-11 rounded-lg bg-accent text-white text-sm font-semibold tracking-wide hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t.home.lookupButton}
      </button>
    </form>
  );
}
