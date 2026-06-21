import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { SiteNarrative } from '@/components/site-narrative';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const domains = await fetchDomainSummaries();

  return (
    <PageShell>
      <header className="hero">
        <p className="eyebrow">PACT Protocol</p>
        <SiteNarrative />
      </header>

      <section className="section narrative-bridge">
        <p className="bridge-lead">
          PACT lays that cornerstone one domain at a time — a public, verifiable history built from
          the authentication signals mail providers already send. No message content. One honest day
          at a time.
        </p>
        <p className="bridge-actions">
          <Link href="/connect" className="button-primary">
            Connect a domain
          </Link>
        </p>
      </section>

      <section className="section">
        <h2>Live records</h2>
        <p className="section-lead">
          Public provenance pages for connected domains. Trust scores computed from real DMARC
          aggregate reports.
        </p>

        {domains.length > 0 ? (
          <ul className="domain-cards">
            {domains.map((d) => (
              <li key={d.domain}>
                <Link href={`/domain/${d.domain}`} className="domain-card">
                  <div className="domain-card-top">
                    <span className="domain-card-name">{d.domain}</span>
                    <span
                      className={`badge badge-${d.status === 'live' ? 'live' : 'waiting'}`}
                    >
                      {d.status === 'live' ? 'Live' : 'Awaiting reports'}
                    </span>
                  </div>
                  {d.status === 'live' ? (
                    <p className="domain-card-meta">
                      Trust {d.trustScore?.toFixed(2)}{' '}
                      <span className={`status-${d.trustStatus}`}>({d.trustStatus})</span>
                      · {d.leafCount} report{d.leafCount === 1 ? '' : 's'} ·{' '}
                      {d.passRate?.toFixed(1)}% DKIM pass
                    </p>
                  ) : (
                    <p className="domain-card-meta">
                      DNS connected
                      {d.connectedSince
                        ? ` · ${new Date(d.connectedSince).toLocaleDateString()}`
                        : ''}
                      · waiting for first DMARC batch
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No domains connected yet.</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
