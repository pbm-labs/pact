import Link from 'next/link';
import type { DomainSummary } from '@/lib/domain-data';
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
    return <span className={badgeAmber}>Awaiting</span>;
  }
  if (domain.trustStatus === 'activated') {
    return <span className={badgeVerified}>Activated</span>;
  }
  return <span className={badgeAmber}>Provisional</span>;
}

export function DomainList({ domains }: DomainListProps) {
  if (!domains.length) {
    return (
      <div className={`${panel} p-8 text-center`}>
        <p className="text-base font-semibold text-txt mb-2">No domains yet</p>
        <p className="text-sm text-muted mb-6">
          Connect a domain to start building a public provenance record.
        </p>
        <Link href="/how-it-works" className={btnPrimary}>
          Connect your first domain
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
            Ranked by trust score
          </p>
          <p className="text-xs text-muted m-0">
            Volume × diversity × maturity · provisional until ~139 days of history
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.65rem] font-mono uppercase tracking-widest text-muted-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-verified" aria-hidden />
            Activated
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber" aria-hidden />
            Provisional
          </span>
        </div>
      </div>

      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
              <th className="text-left font-medium px-4 sm:px-5 py-2.5 w-10 sm:w-12">#</th>
              <th className="text-left font-medium px-4 sm:px-5 py-2.5">Domain</th>
              <th className="text-right font-medium px-4 sm:px-5 py-2.5">Score</th>
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
                  className="border-b border-border last:border-0 group hover:bg-surface-2/40 transition-colors"
                >
                  <td className="px-4 sm:px-5 py-3.5">
                    <span className={`font-mono tabular-nums text-xs ${rankClass(rank)}`}>
                      {rank ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 min-w-[8rem] max-w-[14rem] sm:max-w-none">
                    <Link
                      href={`/domain/${d.domain}`}
                      className="font-mono text-sm text-txt no-underline group-hover:text-accent transition-colors break-all sm:truncate sm:block"
                      title={d.domain}
                    >
                      {d.domain}
                    </Link>
                    <div className="sm:hidden mt-1.5">
                      <StatusBadge domain={d} />
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 text-right">
                    {d.status === 'live' ? (
                      <Link
                        href={`/domain/${d.domain}`}
                        className="font-mono text-lg sm:text-xl font-bold tabular-nums text-txt no-underline group-hover:text-accent transition-colors"
                      >
                        {d.trustScore?.toFixed(2)}
                      </Link>
                    ) : (
                      <span className="font-mono text-lg font-bold text-muted-2">—</span>
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
