'use client';

import type { ReactNode } from 'react';
import { useLocale } from '@/components/locale-provider';
import { panel, statValue } from '@/lib/ui';

export function DomainKindStrip({
  mailCount,
  reporterCount,
  passRate,
  ctCount,
  ctFirstLoggedAt,
  ctLatestLoggedAt,
}: {
  mailCount: number;
  reporterCount: number;
  passRate: number | null;
  ctCount: number;
  ctFirstLoggedAt: number | null;
  ctLatestLoggedAt: number | null;
}) {
  const { t, locale } = useLocale();

  return (
    <div className="mb-8">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-2 mb-3">
        {t.domain.kindsEyebrow}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <KindCard
          kind={t.domain.kindMail}
          hint={t.domain.kindMailHint}
          value={String(mailCount)}
          unit={t.domain.reports}
        >
          {mailCount === 0 ? (
            <p className="text-xs text-muted-2 m-0">{t.domain.kindMailEmpty}</p>
          ) : (
            <>
              <p className="text-xs text-muted m-0">
                {reporterCount} {t.domain.reportingOrgs}
                <span className="text-muted-2"> · {t.domain.independent}</span>
              </p>
              {passRate != null && (
                <p className="text-xs text-muted m-0 mt-1">
                  {passRate.toFixed(1)}% {t.domain.mailAuthRate}
                  <span className="block text-muted-2 mt-0.5">{t.domain.mailAuthRateHint}</span>
                </p>
              )}
            </>
          )}
        </KindCard>
        <KindCard
          kind={t.domain.kindCt}
          hint={t.domain.kindCtHint}
          value={String(ctCount)}
          unit={t.domain.certs}
        >
          {ctCount === 0 ? (
            <p className="text-xs text-muted-2 m-0">{t.domain.kindNone}</p>
          ) : (
            <p className="text-xs text-muted m-0">
              {t.domain.kindFirst} {formatLoggedDay(ctFirstLoggedAt, locale)}
              <span className="text-muted-2"> · </span>
              {t.domain.kindLatest} {formatLoggedDay(ctLatestLoggedAt, locale)}
            </p>
          )}
        </KindCard>
      </div>
    </div>
  );
}

function KindCard({
  kind,
  hint,
  value,
  unit,
  children,
}: {
  kind: string;
  hint: string;
  value: string;
  unit: string;
  children: ReactNode;
}) {
  return (
    <div className={`${panel} p-4`}>
      <p className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 m-0">{kind}</p>
      <p className={`${statValue} text-txt mt-2 mb-0`}>
        {value}
        <span className="ml-2 text-xs font-sans font-semibold text-muted-2 tracking-normal">
          {unit}
        </span>
      </p>
      <p className="text-xs text-muted mt-2 mb-3 leading-snug">{hint}</p>
      {children}
    </div>
  );
}

function formatLoggedDay(ts: number | null, locale: string): string {
  if (ts == null || !Number.isFinite(ts) || ts <= 0) return '—';
  return new Date(ts * 1000).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
