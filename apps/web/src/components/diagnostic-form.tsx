'use client';

import { useState, type FormEvent } from 'react';
import { useLocale } from '@/components/locale-provider';
import { btnPrimary, label, selectField, textArea, textField } from '@/lib/ui';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function DiagnosticForm() {
  const { t, locale } = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [stage, setStage] = useState(t.home.offerStageOptions[0]?.value ?? 'seed');
  const [dependency, setDependency] = useState('');
  const [useCase, setUseCase] = useState('');
  const [company, setCompany] = useState(''); // honeypot — left empty by real users

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, dependency, useCase, company, locale }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !data?.ok) throw new Error('request_failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-8 text-center">
        <p className="m-0 text-lg font-bold tracking-tight text-txt">
          {t.home.offerSuccessHeading}
        </p>
        <p className="mt-3 mb-0 text-sm text-muted leading-relaxed max-w-sm mx-auto">
          {t.home.offerSuccessBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label className={label} htmlFor="diagnostic-stage">
          {t.home.offerFieldStageLabel}
        </label>
        <select
          id="diagnostic-stage"
          className={`${selectField} mt-1.5`}
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          {t.home.offerStageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label} htmlFor="diagnostic-dependency">
          {t.home.offerFieldDependencyLabel}
        </label>
        <input
          id="diagnostic-dependency"
          type="text"
          className={`${textField} mt-1.5`}
          placeholder={t.home.offerFieldDependencyPlaceholder}
          value={dependency}
          onChange={(e) => setDependency(e.target.value)}
          maxLength={500}
          required
        />
      </div>

      <div>
        <label className={label} htmlFor="diagnostic-use">
          {t.home.offerFieldUseLabel}
        </label>
        <textarea
          id="diagnostic-use"
          className={`${textArea} mt-1.5 h-28`}
          placeholder={t.home.offerFieldUsePlaceholder}
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          maxLength={2000}
          required
        />
      </div>

      {status === 'error' && (
        <p className="m-0 text-sm font-semibold text-danger">{t.home.offerError}</p>
      )}

      <button type="submit" className={`${btnPrimary} self-start`} disabled={status === 'submitting'}>
        {status === 'submitting' ? t.home.offerSubmitting : t.home.offerSubmit}
      </button>

      <p className="m-0 text-xs text-muted-2 leading-relaxed">{t.home.offerDisclaimer}</p>
    </form>
  );
}
