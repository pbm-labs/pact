'use client';

import Link from 'next/link';
import { ScoreBar } from '@/components/score-bar';
import { useLocale } from '@/components/locale-provider';
import type { DomainSummary } from '@/lib/domain-data';
import { routes } from '@/lib/routes';
import { formatDomainRegisteredAt } from '@/lib/format-time';
import { formatVerifiedDays, localizeBandLabel, shouldShowTrustScore, type ScoreBandKey } from '@/lib/trust-display';
import { badgeAmber, badgeVerified, btnPrimary, panel, panelBody } from '@/lib/ui';

interface DomainListProps {
  domains: DomainSummary[];
}

function rankClass(rank: number | null): string {
  if (rank === 1) return 'text-brand font-semibold';
  if (rank === 2 || rank === 3) return 'text-txt font-semibold';
  return 'text-muted-2';
}

function StatusBadge({
  domain,
  building,
  proven,
}: {
  domain: DomainSummary;
  building: string;
  proven: string;
}) {
  if (domain.status === 'waiting') {
    return null;
  }
  if (domain.trustStatus === 'activated') {
    return <span className={badgeVerified}>{proven}</span>;
  }
  return <span className={badgeAmber}>{building}</span>;
}

function HistoryCell({ domain }: { domain: DomainSummary }) {
  const { t } = useLocale();
  const days = domain.pactAgeDays ?? 0;
  const reports = domain.leafCount ?? 0;
  const orgs = domain.uniqueReporterCount ?? 0;
  const showScore =
    domain.trustScore != null &&
    domain.trustStatus != null &&
    shouldShowTrustScore({ score: domain.trustScore, status: domain.trustStatus });
  const bandLabel = domain.trustScoreBand
    ? localizeBandLabel(domain.trustScoreBand as ScoreBandKey, t.domain)
    : null;

  return (
    <Link
      href={routes.record(domain.domain)}
      className="block text-right no-underline group-hover:text-accent"
      title={bandLabel ?? undefined}
    >
      <span className="font-mono text-lg sm:text-xl font-bold tabular-nums text-txt">
        {formatVerifiedDays(days, t.domain)}
      </span>
      <span className="block text-[0.65rem] text-muted-2 mt-1 normal-case tracking-normal font-sans">
        {t.records.verified}
      </span>
      <span className="block text-[0.65rem] font-mono text-muted-2 mt-1.5">
        {reports} {reports === 1 ? t.records.report : t.records.reports}
        {orgs > 0
          ? ` · ${orgs} ${orgs === 1 ? t.records.org : t.records.orgs}`
          : ''}
      </span>
      {showScore && domain.trustScoreDisplay != null && (
        <span className="mt-2 block">
          <span className="font-mono text-sm font-semibold tabular-nums text-txt">
            {domain.trustScoreDisplay}
            <span className="text-muted-2"> / 100</span>
          </span>
          <ScoreBar score={domain.trustScoreDisplay} className="mt-1 ml-auto max-w-24" />
          {bandLabel && (
            <span className="block text-[0.65rem] text-muted-2 mt-1 normal-case tracking-normal font-sans">
              {bandLabel}
            </span>
          )}
        </span>
      )}
    </Link>
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
      <div className={`${panelBody} border-b border-border flex flex-wrap items-end justify-between gap-3`}>
        <div>
          <p className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 mb-1">
            {t.records.rankedBy}
          </p>
          <p className="text-xs text-muted m-0">{t.records.rankedHint}</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.65rem] font-mono uppercase tracking-widest text-muted-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber" aria-hidden />
            {t.records.building}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-verified" aria-hidden />
            {t.records.proven}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
              <th className="text-left font-medium px-4 sm:px-5 py-2.5 w-10 sm:w-12">#</th>
              <th className="text-left font-medium px-4 sm:px-5 py-2.5">{t.records.colDomain}</th>
              <th className="text-right font-medium px-4 sm:px-5 py-2.5">{t.records.colHistory}</th>
              <th className="text-left font-medium px-4 sm:px-5 py-2.5 hidden sm:table-cell">
                {t.records.colStatus}
              </th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => {
              const rank = d.status === 'live' ? ++liveRank : null;

              return (
                <tr
                  key={d.domain}
                  className="border-b border-border last:border-0 group hover:bg-surface-2/40"
                >
                  <td className="px-4 sm:px-5 py-3.5">
                    <span className={`font-mono tabular-nums text-xs ${rankClass(rank)}`}>
                      {rank ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 min-w-[8rem] max-w-[14rem] sm:max-w-none">
                    <Link
                      href={routes.record(d.domain)}
                      className="font-mono text-sm text-txt no-underline group-hover:text-accent break-all sm:truncate sm:block"
                      title={d.domain}
                    >
                      {d.domain}
                    </Link>
                    {d.domainRegisteredAt && (
                      <p className="text-[0.65rem] font-mono text-muted-2 mt-1 m-0">
                        {t.records.registered}{' '}
                        {formatDomainRegisteredAt(d.domainRegisteredAt, locale, clockLabels)}
                      </p>
                    )}
                    <div className="sm:hidden mt-1.5">
                      <StatusBadge
                        domain={d}
                        building={t.records.building}
                        proven={t.records.proven}
                      />
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 text-right">
                    {d.status === 'live' ? (
                      <HistoryCell domain={d} />
                    ) : (
                      <span className="font-mono text-sm font-semibold text-muted-2">—</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 hidden sm:table-cell">
                    <StatusBadge
                      domain={d}
                      building={t.records.building}
                      proven={t.records.proven}
                    />
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
