import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { DomainActions } from '@/components/domain-actions';
import { DomainClocks } from '@/components/domain-clocks';
import { DomainLeavesPanel } from '@/components/domain-leaves-panel';
import { ScoreGauge } from '@/components/score-gauge';
import { fetchDomainPageState } from '@/lib/domain-data';
import { estimateScoreProgress, formatScoreForDisplay } from '@pact/core';
import type { DomainLiveData } from '@/lib/domain-data';
import { formatScoreProgressHint } from '@/lib/trust-display';
import {
  alertStaging,
  badgeAmber,
  badgeMuted,
  badgeVerified,
  btnGhost,
  btnPrimary,
  eyebrow,
  pageIntro,
  pageTitle,
  panel,
  panelBody,
  panelSectionTitle,
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
    <div className="rounded-xl border border-border bg-surface px-4 py-4 transition-colors hover:border-muted-2">
      <p
        className={`text-2xl sm:text-3xl font-bold font-mono leading-none ${
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
    return (
      <WaitingPage
        domain={state.data.domain}
        connectedSince={state.data.connectedSince}
        domainRegisteredAt={state.data.domainRegisteredAt}
      />
    );
  }

  if (state.status === 'disconnected') {
    return (
      <DisconnectedPage
        domain={state.data.domain}
        connectedSince={state.data.connectedSince}
        disconnectedSince={state.data.disconnectedSince}
        domainRegisteredAt={state.data.domainRegisteredAt}
      />
    );
  }

  return <LivePage data={state.data} />;
}

function DisconnectedPage({
  domain,
  connectedSince,
  disconnectedSince,
  domainRegisteredAt,
}: {
  domain: string;
  connectedSince: string | null;
  disconnectedSince: string;
  domainRegisteredAt: string | null;
}) {
  return (
    <PageShell backHref="/domains" backLabel="Records" width="wide">
      <header className="mb-8">
        <span className={`${badgeMuted} mb-3`}>Disconnected</span>
        <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
        <p className={pageIntro}>
          No longer being verified. Its history stays public.
        </p>
        <DomainClocks domainRegisteredAt={domainRegisteredAt} pactHistoryStart={null} />
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
  domainRegisteredAt,
}: {
  domain: string;
  connectedSince: string | null;
  domainRegisteredAt: string | null;
}) {
  return (
    <PageShell backHref="/domains" backLabel="Records" width="wide">
      <header className="mb-8">
        <span className={`${badgeAmber} mb-3`}>Awaiting first report</span>
        <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
        <p className={pageIntro}>
          Registered. Waiting for the first confirmation from a mail provider like Gmail or
          Outlook — usually within a day.
        </p>
        {connectedSince && (
          <p className="text-xs text-muted-2 font-mono mt-3">
            Connected {new Date(connectedSince).toLocaleDateString()}
          </p>
        )}
        <DomainClocks domainRegisteredAt={domainRegisteredAt} pactHistoryStart={null} />
      </header>

      <section className={`${panel} mb-2`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>What happens next</h2>
          <ol className="text-sm text-muted space-y-2 pl-4 border-l border-border m-0">
            <li>A mail provider notices your name, usually within a day.</li>
            <li>It quietly confirms your mail checks out.</li>
            <li>This page updates on its own — nothing to click.</li>
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
  const display = formatScoreForDisplay(data.trust.score);
  const progress = estimateScoreProgress({
    rawScore: data.trust.score,
    volume: data.trust.volume,
    diversity: data.trust.diversity,
    pactAgeDays: data.trust.pactAgeDays,
  });
  const progressHint = formatScoreProgressHint(progress, data.trust.score);

  return (
    <PageShell backHref="/domains" backLabel="Records" width="wide">
      {data.staging && (
        <div className={alertStaging}>
          Early preview — verification is live, permanent public anchoring is coming soon.
        </div>
      )}

      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
          <div className="min-w-0">
            <p className={`${eyebrow} mb-2`}>Public record</p>
            <h1 className={`${pageTitle} break-all`}>{data.domain}</h1>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="relative shrink-0" style={{ width: 108, height: 108 }}>
              <ScoreGauge score={display.displayScore} size={108} strokeWidth={8} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-txt leading-none">
                  {display.displayScore}
                </span>
                <span className="text-[0.6rem] font-mono text-muted-2 mt-0.5">/ 100</span>
              </div>
            </div>
            <p className="text-sm text-muted m-0">{display.label}</p>
            {progressHint && (
              <p className="text-xs text-muted-2 m-0 max-w-[16rem] sm:text-right leading-snug">
                {progressHint}
              </p>
            )}
            <span className={statusBadge}>{statusLabel}</span>
          </div>
        </div>
        {data.trust.status === 'provisional' && (
          <p className="text-xs text-muted-2 mt-2 max-w-xl">
            Provisional — trust builds up over time, so a low number early on is normal and
            expected.
          </p>
        )}
        <DomainClocks
          domainRegisteredAt={data.domainRegisteredAt}
          pactHistoryStart={data.pactHistoryStart}
        />
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <Stat value={data.totalPassCount.toLocaleString()} label="Verified emails" />
        <Stat value={`${data.passRate.toFixed(1)}%`} label="Pass rate" />
        <Stat value={String(data.domainLeafCount)} label="Reports" sub="all time" />
        <Stat value={`${Math.floor(data.trust.pactAgeDays)}d`} label="Time verified" />
      </div>

      <details className="group mb-2">
        <summary className="flex items-center gap-2 cursor-pointer select-none mb-6 text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 hover:text-muted transition-colors">
          <span className="inline-block transition-transform group-open:rotate-90">›</span>
          Technical verification — reports &amp; cryptographic proof
        </summary>

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
            Show the math
          </summary>
          <div className={`${panelBody} pt-0 border-t border-border`}>
            <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-2">Raw score (T)</dt>
              <dd className="m-0 font-mono tabular-nums">{display.rawScore.toFixed(4)}</dd>
              <dt className="text-muted-2">Volume (V)</dt>
              <dd className="m-0 font-mono tabular-nums">{data.trust.volume.toFixed(3)}</dd>
              <dt className="text-muted-2">Diversity (D)</dt>
              <dd className="m-0 font-mono tabular-nums">{data.trust.diversity.toFixed(3)}</dd>
              <dt className="text-muted-2">Maturity (A)</dt>
              <dd className="m-0 font-mono tabular-nums">{data.trust.maturity.toFixed(4)}</dd>
              <dt className="text-muted-2">Time verified</dt>
              <dd className="m-0 font-mono tabular-nums">{Math.floor(data.trust.pactAgeDays)}d</dd>
              <dt className="text-muted-2">Failed checks</dt>
              <dd className="m-0 font-mono tabular-nums">{data.totalFailCount.toLocaleString()}</dd>
            </dl>
          </div>
        </details>
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
