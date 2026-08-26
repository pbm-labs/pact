'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import type { DomainSummary } from '@/lib/domain-data';
import { routes } from '@/lib/routes';
import { formatDomainRegisteredAt } from '@/lib/format-time';
import { formatVerifiedDays } from '@/lib/trust-display';
import { btnPrimary, panel, panelBody } from '@/lib/ui';

interface DomainListProps {
  domains: DomainSummary[];
}

function HistoryCell({ domain }: { domain: DomainSummary }) {
  const { t } = useLocale();
  const days = domain.pactAgeDays ?? 0;
  const mail = domain.mailCount ?? 0;
  const ct = domain.ctCount ?? 0;
  const rekor = domain.rekorCount ?? 0;

  return (
    <div className="text-right">
      <span className="font-mono text-lg font-semibold tabular-nums text-txt group-hover:text-accent">
        {formatVerifiedDays(days, t.domain)}
      </span>
      <span className="block text-xs text-muted-2 mt-1 normal-case tracking-normal font-sans">
        {t.records.verified}
      </span>
      <span className="block text-xs font-mono text-muted-2 mt-1.5 leading-snug">
        {mail} {t.domain.reports}
        {' · '}
        {ct} {t.domain.certs}
        {' · '}
        {rekor} {t.domain.sigs}
      </span>
    </div>
  );
}

export function DomainList({ domains }: DomainListProps) {
  const { t, locale } = useLocale();
  const clockLabels = {
    clockUnknown: t.domain.clockUnknown,
    clockDay1: t.domain.clockDay1,
    clockYear: t.domain.clockYear,
    clockYears: t.domain.clockYears,
    clockMonths: t.domain.clockMonths,
    clockDaysShort: t.domain.clockDaysShort,
  };

  if (!domains.length) {
    return (
      <div className={`${panel} p-8 text-center`}>
        <p className="text-base font-semibold text-txt mb-2">{t.records.emptyTitle}</p>
        <p className="text-sm text-muted mb-6">{t.records.emptyBody}</p>
        <Link href={routes.connect} className={btnPrimary}>
          {t.records.emptyCta}
        </Link>
      </div>
    );
  }

  let liveRank = 0;

  return (
    <div className={panel}>
      <div className={`${panelBody} border-b border-border`}>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-2 m-0">
          {t.records.rankedBy}
        </p>
      </div>

      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-mono uppercase tracking-widest text-muted-2">
              <th scope="col" className="text-left font-medium px-4 sm:px-5 py-2.5 w-10 sm:w-12">
                #
              </th>
              <th scope="col" className="text-left font-medium px-4 sm:px-5 py-2.5">
                {t.records.colDomain}
              </th>
              <th scope="col" className="text-right font-medium px-4 sm:px-5 py-2.5">
                {t.records.colHistory}
              </th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => {
              const rank = d.status === 'live' ? ++liveRank : null;
              const href = routes.record(d.domain);

              return (
                <tr
                  key={d.domain}
                  className="relative border-b border-border last:border-0 group hover:bg-surface-2/40"
                >
                  <td className="px-4 sm:px-5 py-3.5">
                    <span className="font-mono tabular-nums text-xs text-muted-2">
                      {rank ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 min-w-0">
                    <Link
                      href={href}
                      className="font-mono text-sm text-txt no-underline group-hover:text-accent break-all after:absolute after:inset-0"
                    >
                      {d.domain}
                    </Link>
                    {d.domainRegisteredAt && (
                      <p className="relative z-10 text-xs font-mono text-muted-2 mt-1 m-0">
                        {t.records.registered}{' '}
                        {formatDomainRegisteredAt(d.domainRegisteredAt, locale, clockLabels)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 text-right">
                    {d.status === 'live' ? (
                      <HistoryCell domain={d} />
                    ) : (
                      <span className="font-mono text-xs text-muted-2">{t.domain.awaitingFirst}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
