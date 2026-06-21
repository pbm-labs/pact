import Link from 'next/link';
import type { DomainSummary } from '@/lib/domain-data';

interface DomainListProps {
  domains: DomainSummary[];
}

export function DomainList({ domains }: DomainListProps) {
  if (!domains.length) {
    return (
      <div className="empty-state">
        <p>No domains connected yet.</p>
        <Link href="/connect" className="button-primary">
          Connect your first domain
        </Link>
      </div>
    );
  }

  return (
    <ul className="domain-cards">
      {domains.map((d) => (
        <li key={d.domain}>
          <Link href={`/domain/${d.domain}`} className="domain-card">
            <div className="domain-card-top">
              <span className="domain-card-name">{d.domain}</span>
              <span className={`badge badge-${d.status === 'live' ? 'live' : 'waiting'}`}>
                {d.status === 'live' ? 'Live' : 'Awaiting reports'}
              </span>
            </div>
            {d.status === 'live' ? (
              <p className="domain-card-meta">
                Trust {d.trustScore?.toFixed(2)}{' '}
                <span className={`status-${d.trustStatus}`}>({d.trustStatus})</span>
                · {d.leafCount} report{d.leafCount === 1 ? '' : 's'} · {d.passRate?.toFixed(1)}%
                DKIM pass
              </p>
            ) : (
              <p className="domain-card-meta">
                DNS connected
                {d.connectedSince ? ` · ${new Date(d.connectedSince).toLocaleDateString()}` : ''}
                · waiting for first DMARC batch
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
