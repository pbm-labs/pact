import Link from 'next/link';
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

  return <LivePage data={state.data} />;
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
          <li>They send aggregate XML to <code>rua@pact.pbm-labs.com</code>.</li>
          <li>PACT ingests the report and this page shows a provisional trust score.</li>
        </ol>
      </section>

      {connectedSince && (
        <p className="meta">Connected {new Date(connectedSince).toLocaleDateString()}</p>
      )}
    </PageShell>
  );
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
        This domain is not registered yet. Connect it via Cloudflare to add PACT to your DMARC
        record.
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
