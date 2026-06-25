'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isPlausibleDomain, normalizeDomainInput } from '@/lib/normalize-domain-input';
import { btnPrimary, input } from '@/lib/ui';

interface DomainCheckFormProps {
  initialQuery?: string;
  autoFocus?: boolean;
}

export function DomainCheckForm({ initialQuery = '', autoFocus = true }: DomainCheckFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const domain = normalizeDomainInput(query);
    if (!domain) {
      setError('Enter a domain name.');
      return;
    }
    if (!isPlausibleDomain(domain)) {
      setError('Enter a valid domain (e.g. example.com).');
      return;
    }
    setError(null);
    router.push(`/check?q=${encodeURIComponent(domain)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label htmlFor="domain-check" className="sr-only">
        Domain name
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="domain-check"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError(null);
          }}
          placeholder="example.com"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          inputMode="url"
          autoFocus={autoFocus}
          className={input}
        />
        <button type="submit" className={`${btnPrimary} sm:shrink-0 sm:px-6`}>
          Check
        </button>
      </div>
      {error && (
        <p className="text-sm text-rose-500 mt-2 m-0" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
