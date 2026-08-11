'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DomainList } from '@/components/domain-list';
import { useLocale } from '@/components/locale-provider';
import type { DomainSummary } from '@/lib/domain-data';
import { routes } from '@/lib/routes';

function normalizeQuery(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

interface DomainRecordsProps {
  domains: DomainSummary[];
}

export function DomainRecords({ domains }: DomainRecordsProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = normalizeQuery(query);
    if (!q) return domains;
    return domains.filter((d) => d.domain.toLowerCase().includes(q));
  }, [domains, query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const domain = normalizeQuery(query);
    if (!domain) return;
    router.push(routes.record(domain));
  }

  if (!domains.length) {
    return <DomainList domains={domains} />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <label className="flex items-center bg-bg border border-border rounded-lg px-3.5 h-11 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/15 transition-all">
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.records.searchPlaceholder}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            inputMode="url"
            aria-label={t.records.searchPlaceholder}
            className="bg-transparent outline-none text-base sm:text-sm font-mono text-txt placeholder:text-muted-2 flex-1 min-w-0"
          />
        </label>
      </form>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-2 font-mono text-center py-8">
          {t.records.noMatch.replace('{query}', query.trim())}
        </p>
      ) : (
        <DomainList domains={filtered} />
      )}
    </div>
  );
}
