'use client';

import { useLocale } from '@/components/locale-provider';
import { formatDomainRegisteredAt, formatPactHistoryStart } from '@/lib/format-time';

interface DomainClocksProps {
  domainRegisteredAt: string | null;
  pactHistoryStart: string | null;
}

export function DomainClocks({ domainRegisteredAt, pactHistoryStart }: DomainClocksProps) {
  const { t, locale } = useLocale();
  const clockLabels = {
    clockUnknown: t.domain.clockUnknown,
    clockDay1: t.domain.clockDay1,
    clockYear: t.domain.clockYear,
    clockYears: t.domain.clockYears,
    clockMonths: t.domain.clockMonths,
    clockDaysShort: t.domain.clockDaysShort,
  };

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-6 pt-6 border-t border-border">
      <div>
        <dt className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 mb-1.5">
          {t.domain.domainRegistered}
        </dt>
        <dd className="m-0 text-base sm:text-lg font-semibold font-mono text-txt tabular-nums">
          {formatDomainRegisteredAt(domainRegisteredAt, locale, clockLabels)}
        </dd>
      </div>
      <div>
        <dt className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 mb-1.5">
          {t.domain.verifiedSince}
        </dt>
        <dd className="m-0 text-base sm:text-lg font-semibold font-mono text-txt tabular-nums">
          {pactHistoryStart
            ? formatPactHistoryStart(pactHistoryStart, locale, clockLabels)
            : t.domain.awaitingReport}
        </dd>
      </div>
    </dl>
  );
}
