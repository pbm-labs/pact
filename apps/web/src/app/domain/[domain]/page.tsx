import Link from 'next/link';
import { PACT_RUA_ADDRESS } from '@pact/core';
import { PageShell } from '@/components/page-shell';
import { fetchDomainPageState, SCORE_ALGORITHM } from '@/lib/domain-data';
import type { DomainLiveData } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string }>;
}

export default async function DomainPage({ params }: PageProps) {
  const { domain } = await params;
  const state = await fetchDomainPageState(domain);

  const hasSupabase =
    process.env.SUPABASE_URL &&
    (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!state && !hasSupabase) {
    return <UnconfiguredPage domain={domain} />;
  }

  if (!state) {
    return <UnknownDomainPage domain={domain} />;
  }

  if (state.status === 'waiting') {
    return <WaitingPage domain={state.data.domain} connectedSince={state.data.connectedSince} />;
  }

  if (state.status === 'disconnected') {
    return (
      <DisconnectedPage
        domain={state.data.domain}
        connectedSince={state.data.connectedSince}
        disconnectedSince={state.data.disconnectedSince}
      />
    );
  }

  return <LivePage data={state.data} />;
}

function DisconnectedPage({
  domain,
  connectedSince,
  disconnectedSince,
}: {
  domain: string;
  connectedSince: string | null;
  disconnectedSince: string;
}) {
  return (
    <PageShell backHref="/">
      <div className="record-header">
        <p className="eyebrow">Domain record</p>
        <h1>{domain}</h1>
        <span className="badge badge-waiting">Disconnected</span>
      </div>

      <p className="lead">
        This domain is no longer connected to PACT. New DMARC reports are not accepted. Any
        provenance data ingested before disconnect remains part of the public historical record.
      </p>

      <section className="section card">
        <h2>Timeline</h2>
        <dl className="dl-relaxed">
          {connectedSince && (
            <>
              <dt>Connected</dt>
              <dd>{new Date(connectedSince).toLocaleDateString()}</dd>
            </>
          )}
          <dt>Disconnected</dt>
          <dd>{new Date(disconnectedSince).toLocaleDateString()}</dd>
        </dl>
      </section>

      <p>
        <Link href={`/connect?domain=${encodeURIComponent(domain)}`} className="button-primary">
          Reconnect {domain}
        </Link>
      </p>
    </PageShell>
  );
}

function WaitingPage({
  domain,
  connectedSince,
}: {
  domain: string;
  connectedSince: string | null;
}) {
  return (
    <PageShell backHref="/">
      <div className="record-header">
        <p className="eyebrow">Domain record</p>
        <h1>{domain}</h1>
        <span className="badge badge-waiting">Awaiting first report</span>
      </div>

      <p className="lead">
        This domain is registered with PACT. We are waiting for the first authenticated DMARC
        aggregate report from Google, Microsoft, or another mail provider.
      </p>

      <section className="section card">
        <h2>What happens next</h2>
        <ol className="steps steps-compact">
          <li>Mail providers read your <code>_dmarc</code> record (usually within 24 hours).</li>
          <li>They send aggregate XML to <code>{PACT_RUA_ADDRESS}</code>.</li>
          <li>PACT ingests the report and this page shows a provisional trust score.</li>
        </ol>
      </section>

      {connectedSince && (
        <p className="meta">Connected {new Date(connectedSince).toLocaleDateString()}</p>
      )}
    </PageShell>
  );
}

function formatPeriod(start: number, end: number): string {
  const fmt = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

function reporterLabel(org: string): string {
  if (org === 'google.com') return 'Google';
  if (org === 'outlook.com') return 'Microsoft';
  return org;
}

function LivePage({ data }: { data: DomainLiveData }) {
  const rootPreview = data.latestRoot
    ? `${data.latestRoot.slice(0, 10)}…${data.latestRoot.slice(-8)}`
    : '—';

  return (
    <PageShell backHref="/">
      {data.staging && (
        <div className="banner-staging">
          Staging — Merkle roots are published off-chain only. On-chain anchoring ships in Phase 0b.
        </div>
      )}

      <div className="record-header">
        <p className="eyebrow">Domain provenance record</p>
        <h1>{data.domain}</h1>
        <div className="trust-hero">
          <span className="trust-hero-score">{data.trust.score.toFixed(2)}</span>
          <span
            className={`badge badge-${data.trust.status === 'activated' ? 'activated' : 'provisional'}`}
          >
            {data.trust.status}
          </span>
        </div>
        <p className="meta">
          {SCORE_ALGORITHM} · connected{' '}
          {data.connectedSince ? new Date(data.connectedSince).toLocaleDateString() : '—'}
        </p>
        {data.trust.status === 'provisional' && (
          <p className="meta meta-note">
            Provisional — score rises as verified volume, reporter diversity, and history depth
            accumulate (~139 days to activate).
          </p>
        )}
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Verified messages</span>
          <span className="stat-value">{data.totalPassCount.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">DKIM pass rate</span>
          <span className="stat-value">{data.passRate.toFixed(1)}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Reporting orgs</span>
          <span className="stat-value">{data.uniqueReporters}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">History depth</span>
          <span className="stat-value">{Math.floor(data.trust.ageDays)}d</span>
        </div>
      </div>

      <section className="section card">
        <h2>Report history</h2>
        <p className="section-lead">
          Authenticated DMARC aggregate batches ingested for this domain. Each row is one reporter
          for one reporting period.
        </p>
        <div className="report-history-wrap">
          <table className="report-history">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Period</th>
                <th>DKIM pass</th>
                <th>DKIM fail</th>
                <th>Selectors</th>
                <th>Ingested</th>
              </tr>
            </thead>
            <tbody>
              {data.leaves.map((leaf) => (
                <tr key={`${leaf.reporterOrg}-${leaf.periodStart}`}>
                  <td>{reporterLabel(leaf.reporterOrg)}</td>
                  <td>{formatPeriod(leaf.periodStart, leaf.periodEnd)}</td>
                  <td>{leaf.dkimPassCount.toLocaleString()}</td>
                  <td>{leaf.dkimFailCount.toLocaleString()}</td>
                  <td>
                    {leaf.selectors.length ? (
                      leaf.selectors.map((s) => <code key={s}>{s}</code>)
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {leaf.receivedAt
                      ? new Date(leaf.receivedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section card">
        <h2>Trust components</h2>
        <dl className="dl-relaxed">
          <dt>Volume (V)</dt>
          <dd>{data.trust.volume.toFixed(3)}</dd>
          <dt>Diversity (D)</dt>
          <dd>{data.trust.diversity.toFixed(3)}</dd>
          <dt>Maturity (A)</dt>
          <dd>{data.trust.maturity.toFixed(4)}</dd>
          <dt>DKIM failures</dt>
          <dd>{data.totalFailCount.toLocaleString()}</dd>
        </dl>
      </section>

      <section className="section card">
        <h2>Merkle inclusion proofs</h2>
        <p className="section-lead">
          Each ingested report is a leaf in the global sparse Merkle tree (v0.2 §3.3.1). Proofs are
          recomputed from live data and verified against the latest published staging root.
        </p>
        <dl className="dl-relaxed merkle-summary">
          <dt>Published root</dt>
          <dd className="hash" title={data.latestRoot ?? undefined}>
            {data.latestRoot ?? '—'}
          </dd>
          <dt>Recomputed root</dt>
          <dd className="hash" title={data.computedRoot ?? undefined}>
            {data.computedRoot ?? '—'}
          </dd>
          <dt>Roots match</dt>
          <dd>{data.rootMatchesPublished ? 'Yes' : 'No'}</dd>
        </dl>
        <div className="proof-list">
          {data.leaves.map((leaf) => (
            <details key={`proof-${leaf.leafIndex}`} className="proof-details">
              <summary>
                Leaf #{leaf.leafIndex} · {reporterLabel(leaf.reporterOrg)} ·{' '}
                {formatPeriod(leaf.periodStart, leaf.periodEnd)} ·{' '}
                <span className={leaf.merkleProofValid ? 'proof-valid' : 'proof-invalid'}>
                  {leaf.merkleProofValid ? 'verified' : 'unverified'}
                </span>
              </summary>
              <dl className="dl-relaxed">
                <dt>Leaf hash</dt>
                <dd className="hash">{leaf.leafHash}</dd>
                <dt>Proof ({leaf.merkleProof.length} siblings)</dt>
                <dd className="proof-siblings">
                  {leaf.merkleProof.map((sibling, i) => (
                    <code key={i} title={sibling}>
                      {sibling.slice(0, 10)}…{sibling.slice(-6)}
                    </code>
                  ))}
                </dd>
              </dl>
            </details>
          ))}
        </div>
      </section>

      <section className="section card">
        <h2>Merkle tree</h2>
        <dl className="dl-relaxed">
          <dt>Anchor</dt>
          <dd>{data.anchorType === 'base' ? 'Base (on-chain)' : 'Staging (off-chain)'}</dd>
          <dt>Latest root</dt>
          <dd className="hash" title={data.latestRoot ?? undefined}>
            {rootPreview}
          </dd>
          <dt>Leaves (this domain)</dt>
          <dd>{data.domainLeafCount}</dd>
          <dt>Leaves (global tree)</dt>
          <dd>{data.globalTreeLeafCount ?? '—'}</dd>
        </dl>
      </section>
    </PageShell>
  );
}

function UnknownDomainPage({ domain }: { domain: string }) {
  return (
    <PageShell backHref="/" centered>
      <p className="eyebrow">Domain record</p>
      <h1>{domain}</h1>
      <p className="lead">Not connected to PACT</p>
      <p className="muted">
        This domain is not registered with PACT. Connect via Cloudflare OAuth or manual DNS.
      </p>
      <p>
        <Link href={`/connect?domain=${encodeURIComponent(domain)}`} className="button-primary">
          Connect {domain}
        </Link>
      </p>
    </PageShell>
  );
}

function UnconfiguredPage({ domain }: { domain: string }) {
  return (
    <PageShell backHref="/" centered>
      <p className="eyebrow">Configuration</p>
      <h1>{domain}</h1>
      <p className="lead">Database not configured</p>
      <p className="muted">Set SUPABASE_URL and keys in the deployment environment.</p>
    </PageShell>
  );
}
