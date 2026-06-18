import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const domains = await fetchDomainSummaries();

  return (
    <PageShell>
      <div className="hero">
        <p className="eyebrow">Phase 0a · Staging</p>
        <h1>Domain provenance from DMARC</h1>
        <p className="hero-lead">
          PACT builds a public trust record for each connected domain using aggregate authentication
          reports already sent by Gmail, Microsoft, and other mail providers. No message content is
          ever read.
        </p>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Connected domains</h2>
          <Link href="/connect" className="text-link">
            + Connect
          </Link>
        </div>

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
            <Link href="/connect" className="button-primary">
              Connect your first domain
            </Link>
          </div>
        )}
      </section>

      <section className="section how-it-works">
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <strong>Connect</strong> — add <code>rua@pact.pbm-labs.com</code> to your{' '}
            <code>_dmarc</code> record via Cloudflare OAuth.
          </li>
          <li>
            <strong>Ingest</strong> — Google and Microsoft send daily aggregate XML reports to PACT.
          </li>
          <li>
            <strong>Prove</strong> — leaves are hashed into a Merkle tree; this page shows trust
            score and history (on-chain anchor in Phase 0b).
          </li>
        </ol>
      </section>
    </PageShell>
  );
}
