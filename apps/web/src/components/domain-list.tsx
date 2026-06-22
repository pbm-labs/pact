import Link from 'next/link';
import type { DomainSummary } from '@/lib/domain-data';
import { badgeAmber, badgeVerified, btnPrimary, panel } from '@/lib/ui';

interface DomainListProps {
  domains: DomainSummary[];
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

  return (
    <ul className="flex flex-col gap-3">
      {domains.map((d) => (
        <li key={d.domain}>
          <Link
            href={`/domain/${d.domain}`}
            className={`${panel} block p-4 no-underline text-inherit transition-colors hover:border-border-h`}
          >
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <span className="font-mono text-sm sm:text-base text-txt break-all">{d.domain}</span>
              {d.status === 'live' ? (
                <span className="text-2xl font-bold font-mono tabular-nums text-txt shrink-0">
                  {d.trustScore?.toFixed(2)}
                </span>
              ) : (
                <span className="text-2xl font-bold font-mono text-muted-2 shrink-0">—</span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              {d.status === 'live' ? (
                <span className={badgeVerified}>Live</span>
              ) : (
                <span className={badgeAmber}>Awaiting reports</span>
              )}
              {d.status === 'live' ? (
                <span className="text-xs text-muted-2 font-mono">
                  {d.leafCount} report{d.leafCount === 1 ? '' : 's'} · {d.passRate?.toFixed(0)}% DKIM
                  pass
                </span>
              ) : (
                <span className="text-xs text-muted-2">Waiting for first DMARC batch</span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
