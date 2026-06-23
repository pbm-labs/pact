import Link from 'next/link';
import { PACT_RUA_ADDRESS } from '@pact/core';
import { PageShell } from '@/components/page-shell';
import { DomainActions } from '@/components/domain-actions';
import { DomainLeavesPanel } from '@/components/domain-leaves-panel';
import { fetchDomainPageState, SCORE_ALGORITHM } from '@/lib/domain-data';
import type { DomainLiveData } from '@/lib/domain-data';
import { formatIngestTimestamp } from '@/lib/format-time';
import {
  alertStaging,
  badgeAmber,
  badgeMuted,
  badgeVerified,
  btnGhost,
  btnPrimary,
  eyebrow,
  inlineCode,
  pageIntro,
  pageTitle,
  panel,
  panelBody,
  panelSectionTitle,
  snippetPre,
} from '@/lib/ui';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string }>;
}

function Stat({
  value,
  label,
  sub,
  dim = false,
}: {
  value: string;
  label: string;
  sub?: string;
  dim?: boolean;
}) {
  return (
    <div>
      <p
        className={`text-3xl sm:text-4xl font-bold font-mono leading-none ${
          dim ? 'text-muted-2' : 'text-txt'
        }`}
      >
        {value}
      </p>
      <p className="text-xs sm:text-sm font-semibold text-txt mt-2">{label}</p>
      {sub && (
        <p className="text-[0.65rem] sm:text-xs text-muted-2 mt-0.5 leading-tight">{sub}</p>
      )}
    </div>
  );
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
    <PageShell backHref="/domains" backLabel="Records" width="wide">
      <header className="mb-8">
        <span className={`${badgeMuted} mb-3`}>Disconnected</span>
        <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
        <p className={pageIntro}>
          No longer receiving reports. Historical provenance remains public.
        </p>
      </header>

      <section className={`${panel} mb-8`}>
        <div className={panelBody}>
          <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-2 text-sm m-0">
            {connectedSince && (
              <>
                <dt className="text-muted-2">Connected</dt>
                <dd className="m-0 font-mono tabular-nums">
                  {new Date(connectedSince).toLocaleDateString()}
                </dd>
              </>
            )}
            <dt className="text-muted-2">Disconnected</dt>
            <dd className="m-0 font-mono tabular-nums">
              {new Date(disconnectedSince).toLocaleDateString()}
            </dd>
          </dl>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={`/how-it-works?domain=${encodeURIComponent(domain)}`} className={btnPrimary}>
          Reconnect {domain}
        </Link>
        <Link href="/domains" className={btnGhost}>
          All records
        </Link>
      </div>
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
    <PageShell backHref="/domains" backLabel="Records" width="wide">
      <header className="mb-8">
        <span className={`${badgeAmber} mb-3`}>Awaiting first report</span>
        <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
        <p className={pageIntro}>
          Registered with PACT. Waiting for the first authenticated DMARC batch from Google,
          Microsoft, or another provider.
        </p>
        {connectedSince && (
          <p className="text-xs text-muted-2 font-mono mt-3">
            Connected {new Date(connectedSince).toLocaleDateString()}
          </p>
        )}
      </header>

      <section className={`${panel} mb-2`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>What happens next</h2>
          <ol className="text-sm text-muted space-y-2 pl-4 border-l border-border m-0">
            <li>
              Providers read your <code className={inlineCode}>_dmarc</code> record (~24 hours).
            </li>
            <li>
              They send aggregate XML to <code className={inlineCode}>{PACT_RUA_ADDRESS}</code>.
            </li>
            <li>This page updates with a provisional trust score.</li>
          </ol>
        </div>
      </section>

      <DomainActions domain={domain} />
    </PageShell>
  );
}

function LivePage({ data }: { data: DomainLiveData }) {
  const statusBadge =
    data.trust.status === 'activated' ? badgeVerified : badgeAmber;
  const statusLabel = data.trust.status === 'activated' ? 'Activated' : 'Provisional';

  return (
    <PageShell backHref="/domains" backLabel="Records" width="wide">
      {data.staging && (
        <div className={alertStaging}>
          Staging — roots published off-chain only. On-chain anchoring ships in Phase 0b.
        </div>
      )}

      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
          <div className="min-w-0">
            <p className={`${eyebrow} mb-2`}>Provenance record</p>
            <h1 className={`${pageTitle} break-all`}>{data.domain}</h1>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <span className="text-4xl sm:text-5xl font-bold font-mono tabular-nums leading-none text-txt">
              {data.trust.score.toFixed(2)}
            </span>
            <span className={statusBadge}>{statusLabel}</span>
          </div>
        </div>
        <p className="text-xs text-muted-2 font-mono">
          {SCORE_ALGORITHM} · connected{' '}
          {data.connectedSince ? new Date(data.connectedSince).toLocaleDateString() : '—'}
          {data.lastIngestedAt && (
            <>
              {' '}
              · last ingested{' '}
              <time dateTime={data.lastIngestedAt}>{formatIngestTimestamp(data.lastIngestedAt)}</time>
            </>
          )}
        </p>
        {data.trust.status === 'provisional' && (
          <p className="text-xs text-muted-2 mt-2 max-w-xl">
            Provisional — rises with verified volume, reporter diversity, and history (~139 days to
            activate).
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
        <Stat value={data.totalPassCount.toLocaleString()} label="Verified messages" />
        <Stat value={`${data.passRate.toFixed(1)}%`} label="DKIM pass rate" />
        <Stat value={String(data.domainLeafCount)} label="Reports" sub="all time" />
        <Stat value={`${Math.floor(data.trust.ageDays)}d`} label="History" />
      </div>

      <DomainLeavesPanel
        leaves={data.leaves}
        domainLeafCount={data.domainLeafCount}
        uniqueReporters={data.uniqueReporters}
        anchorType={data.anchorType}
        rootMatchesPublished={data.rootMatchesPublished}
        latestRoot={data.latestRoot}
        globalTreeLeafCount={data.globalTreeLeafCount}
      />

      <details className={`${panel} mb-2`}>
        <summary className="cursor-pointer px-5 py-4 text-[0.65rem] font-mono uppercase tracking-widest text-muted-2">
          Score breakdown
        </summary>
        <div className={`${panelBody} pt-0 border-t border-border`}>
          <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-2">Volume (V)</dt>
            <dd className="m-0 font-mono tabular-nums">{data.trust.volume.toFixed(3)}</dd>
            <dt className="text-muted-2">Diversity (D)</dt>
            <dd className="m-0 font-mono tabular-nums">{data.trust.diversity.toFixed(3)}</dd>
            <dt className="text-muted-2">Maturity (A)</dt>
            <dd className="m-0 font-mono tabular-nums">{data.trust.maturity.toFixed(4)}</dd>
            <dt className="text-muted-2">DKIM failures</dt>
            <dd className="m-0 font-mono tabular-nums">{data.totalFailCount.toLocaleString()}</dd>
          </dl>
        </div>
      </details>

      <DomainActions domain={data.domain} />
    </PageShell>
  );
}

function UnknownDomainPage({ domain }: { domain: string }) {
  return (
    <PageShell backHref="/domains" backLabel="Records" centered width="narrow">
      <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
      <p className={`${pageIntro} mb-6`}>Not registered with PACT.</p>
      <Link href={`/how-it-works?domain=${encodeURIComponent(domain)}`} className={btnPrimary}>
        Connect {domain}
      </Link>
    </PageShell>
  );
}

function UnconfiguredPage({ domain }: { domain: string }) {
  return (
    <PageShell backHref="/domains" backLabel="Records" centered width="narrow">
      <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
      <p className="text-sm text-muted">Database not configured</p>
    </PageShell>
  );
}
