import Link from 'next/link';
import { ScoreBar } from '@/components/score-bar';
import type { DomainSummary } from '@/lib/domain-data';
import { formatDomainRegisteredAt } from '@/lib/format-time';
import { formatVerifiedDays, shouldShowTrustScore } from '@/lib/trust-display';
import { badgeAmber, badgeVerified, btnPrimary, panel, panelBody } from '@/lib/ui';

interface DomainListProps {
  domains: DomainSummary[];
}

function rankClass(rank: number | null): string {
  if (rank === 1) return 'text-brand font-semibold';
  if (rank === 2 || rank === 3) return 'text-txt font-semibold';
  return 'text-muted-2';
}

function StatusBadge({ domain }: { domain: DomainSummary }) {
  if (domain.status === 'waiting') {
    return null;
  }
  if (domain.trustStatus === 'activated') {
    return <span className={badgeVerified}>Proven</span>;
  }
  return <span className={badgeAmber}>Building</span>;
}

function HistoryCell({ domain }: { domain: DomainSummary }) {
  const days = domain.pactAgeDays ?? 0;
  const reports = domain.leafCount ?? 0;
  const orgs = domain.uniqueReporterCount ?? 0;
  const showScore =
    domain.trustScore != null &&
    domain.trustStatus != null &&
    shouldShowTrustScore({ score: domain.trustScore, status: domain.trustStatus });

  return (
    <Link
      href={`/domain/${domain.domain}`}
      className="block text-right no-underline group-hover:text-accent"
      title={domain.trustScoreLabel}
    >
      <span className="font-mono text-lg sm:text-xl font-bold tabular-nums text-txt">
        {formatVerifiedDays(days)}
      </span>
      <span className="block text-[0.65rem] text-muted-2 mt-1 normal-case tracking-normal font-sans">
        verified
      </span>
      <span className="block text-[0.65rem] font-mono text-muted-2 mt-1.5">
        {reports} report{reports === 1 ? '' : 's'}
        {orgs > 0 ? ` · ${orgs} org${orgs === 1 ? '' : 's'}` : ''}
      </span>
      {showScore && domain.trustScoreDisplay != null && (
        <span className="mt-2 block">
          <span className="font-mono text-sm font-semibold tabular-nums text-txt">
            {domain.trustScoreDisplay}
            <span className="text-muted-2"> / 100</span>
          </span>
          <ScoreBar score={domain.trustScoreDisplay} className="mt-1 ml-auto max-w-24" />
          {domain.trustScoreLabel && (
            <span className="block text-[0.65rem] text-muted-2 mt-1 normal-case tracking-normal font-sans">
              {domain.trustScoreLabel}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

export function DomainList({ domains }: DomainListProps) {
  if (!domains.length) {
    return (
      <div className={`${panel} p-8 text-center`}>
        <p className="text-base font-semibold text-txt mb-2">No domains yet</p>
        <p className="text-sm text-muted mb-6">
          Add a domain to start building a public record.
        </p>
        <Link href="/how-it-works" className={btnPrimary}>
          Add the first domain
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
            Ranked by verified history
          </p>
          <p className="text-xs text-muted m-0">
            Longer independently confirmed history ranks higher. A trust score appears once
            history is meaningful.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.65rem] font-mono uppercase tracking-widest text-muted-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber" aria-hidden />
            Building
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-verified" aria-hidden />
            Proven
          </span>
        </div>
      </div>

      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
              <th className="text-left font-medium px-4 sm:px-5 py-2.5 w-10 sm:w-12">#</th>
              <th className="text-left font-medium px-4 sm:px-5 py-2.5">Domain</th>
              <th className="text-right font-medium px-4 sm:px-5 py-2.5">History</th>
              <th className="text-left font-medium px-4 sm:px-5 py-2.5 hidden sm:table-cell">
                Status
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
                      href={`/domain/${d.domain}`}
                      className="font-mono text-sm text-txt no-underline group-hover:text-accent break-all sm:truncate sm:block"
                      title={d.domain}
                    >
                      {d.domain}
                    </Link>
                    {d.domainRegisteredAt && (
                      <p className="text-[0.65rem] font-mono text-muted-2 mt-1 m-0">
                        registered {formatDomainRegisteredAt(d.domainRegisteredAt)}
                      </p>
                    )}
                    <div className="sm:hidden mt-1.5">
                      <StatusBadge domain={d} />
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
                    <StatusBadge domain={d} />
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
