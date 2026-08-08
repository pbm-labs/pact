'use client';

import Link from 'next/link';
import { DomainActions } from '@/components/domain-actions';
import { DomainClocks } from '@/components/domain-clocks';
import { DomainLeavesPanel } from '@/components/domain-leaves-panel';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { ScoreGauge } from '@/components/score-gauge';
import type { DomainLiveData, DomainPageState } from '@/lib/domain-data';
import { estimateScoreProgress, formatScoreForDisplay } from '@pact/core';
import {
  formatScoreProgressHint,
  formatVerifiedDays,
  shouldShowTrustScore,
} from '@/lib/trust-display';
import {
  alertStaging,
  badgeAmber,
  badgeVerified,
  btnPrimary,
  eyebrow,
  pageIntro,
  pageTitle,
  panel,
  panelBody,
  panelSectionTitle,
} from '@/lib/ui';

interface DomainPageViewProps {
  domain: string;
  state: DomainPageState | null;
  unconfigured: boolean;
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
    <div className="rounded-xl border border-border bg-surface px-4 py-4 hover:border-muted-2">
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

export function DomainPageView({ domain, state, unconfigured }: DomainPageViewProps) {
  if (unconfigured) {
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

  return <LivePage data={state.data} />;
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
  const { t } = useLocale();

  return (
    <PageShell backHref="/domains" backLabel={t.domain.backRecords} width="wide">
      <header className="mb-8">
        <span className={`${badgeAmber} mb-3`}>{t.domain.awaitingFirst}</span>
        <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
        <p className={pageIntro}>{t.domain.awaitingIntro}</p>
        {connectedSince && (
          <p className="text-xs text-muted-2 font-mono mt-3">
            {t.domain.connected} {new Date(connectedSince).toLocaleDateString()}
          </p>
        )}
        <DomainClocks domainRegisteredAt={domainRegisteredAt} pactHistoryStart={null} />
      </header>

      <section className={`${panel} mb-2`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>{t.domain.whatNext}</h2>
          <ol className="text-sm text-muted space-y-2 pl-4 border-l border-border m-0">
            <li>{t.domain.next1}</li>
            <li>{t.domain.next2}</li>
            <li>{t.domain.next3}</li>
          </ol>
        </div>
      </section>

      <DomainActions />
    </PageShell>
  );
}

function LivePage({ data }: { data: DomainLiveData }) {
  const { t } = useLocale();
  const statusBadge = data.trust.status === 'activated' ? badgeVerified : badgeAmber;
  const statusLabel =
    data.trust.status === 'activated' ? t.domain.proven : t.domain.building;
  const display = formatScoreForDisplay(data.trust.score);
  const showScore = shouldShowTrustScore(data.trust);
  const progress = estimateScoreProgress({
    rawScore: data.trust.score,
    volume: data.trust.volume,
    diversity: data.trust.diversity,
    pactAgeDays: data.trust.pactAgeDays,
  });
  const progressHint = formatScoreProgressHint(progress, data.trust.score);
  const verifiedDays = Math.floor(data.trust.pactAgeDays);
  const verifiedLabel = formatVerifiedDays(data.trust.pactAgeDays);

  return (
    <PageShell backHref="/domains" backLabel={t.domain.backRecords} width="wide">
      {data.staging && <div className={alertStaging}>{t.domain.staging}</div>}

      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
          <div className="min-w-0">
            <p className={`${eyebrow} mb-2`}>{t.domain.publicRecord}</p>
            <h1 className={`${pageTitle} break-all`}>{data.domain}</h1>
            <p className="text-sm text-muted mt-3 max-w-xl leading-relaxed">
              {showScore ? t.domain.scoreIntro : t.domain.historyIntro}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            {showScore ? (
              <>
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
              </>
            ) : (
              <div className="text-left sm:text-right">
                <p className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-txt leading-none m-0">
                  {verifiedLabel}
                </p>
                <p className="text-sm text-muted mt-2 m-0">{t.domain.historyHero}</p>
              </div>
            )}
            {progressHint && (
              <p className="text-xs text-muted-2 m-0 max-w-[16rem] sm:text-right leading-snug">
                {progressHint}
              </p>
            )}
            <span className={statusBadge}>{statusLabel}</span>
          </div>
        </div>
        <DomainClocks
          domainRegisteredAt={data.domainRegisteredAt}
          pactHistoryStart={data.pactHistoryStart}
        />
      </header>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
        <Stat value={`${verifiedDays}d`} label={t.domain.timeVerified} />
        <Stat value={String(data.domainLeafCount)} label={t.domain.reports} sub={t.domain.allTime} />
        <Stat value={`${data.passRate.toFixed(1)}%`} label={t.domain.passRate} />
      </div>

      <details className="group mb-2">
        <summary className="flex items-center gap-2 cursor-pointer select-none mb-6 text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 hover:text-muted">
          <span className={`inline-block group-open:rotate-90`}>›</span>
          {t.domain.techSummary}
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

        <div className={`${panel} mb-2`}>
          <div className="px-5 py-4 text-[0.65rem] font-mono uppercase tracking-widest text-muted-2">
            {t.domain.showMath}
          </div>
          <div className={`${panelBody} pt-0 border-t border-border`}>
            <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-2">Raw score (T)</dt>
              <dd className="m-0 font-mono tabular-nums">{display.rawScore.toFixed(4)}</dd>
              {showScore && (
                <>
                  <dt className="text-muted-2">Display</dt>
                  <dd className="m-0 font-mono tabular-nums">
                    {display.displayScore} / 100 · {display.label}
                  </dd>
                </>
              )}
              <dt className="text-muted-2">Volume (V)</dt>
              <dd className="m-0 font-mono tabular-nums">{data.trust.volume.toFixed(3)}</dd>
              <dt className="text-muted-2">Diversity (D)</dt>
              <dd className="m-0 font-mono tabular-nums">{data.trust.diversity.toFixed(3)}</dd>
              <dt className="text-muted-2">Maturity (A)</dt>
              <dd className="m-0 font-mono tabular-nums">{data.trust.maturity.toFixed(4)}</dd>
              <dt className="text-muted-2">{t.domain.timeVerified}</dt>
              <dd className="m-0 font-mono tabular-nums">{verifiedDays}d</dd>
              <dt className="text-muted-2">Failed checks</dt>
              <dd className="m-0 font-mono tabular-nums">{data.totalFailCount.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </details>

      <DomainActions />
    </PageShell>
  );
}

function UnknownDomainPage({ domain }: { domain: string }) {
  const { t } = useLocale();

  return (
    <PageShell backHref="/domains" backLabel={t.domain.backRecords} centered width="narrow">
      <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
      <p className={`${pageIntro} mb-2`}>{t.domain.noRecordYet}</p>
      <p className="text-sm text-muted-2 mb-6 max-w-sm mx-auto leading-relaxed">
        {t.domain.noRecordHint}
      </p>

      <section className={`${panel} w-full text-left mb-8`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>{t.domain.whatNext}</h2>
          <ol className="text-sm text-muted space-y-2 pl-4 border-l border-border m-0">
            <li>{t.domain.next1}</li>
            <li>{t.domain.next2}</li>
            <li>{t.domain.next3}</li>
          </ol>
        </div>
      </section>

      <Link href={`/how-it-works?domain=${encodeURIComponent(domain)}`} className={btnPrimary}>
        {t.domain.connectDomain} {domain}
      </Link>
    </PageShell>
  );
}

function UnconfiguredPage({ domain }: { domain: string }) {
  const { t } = useLocale();

  return (
    <PageShell backHref="/domains" backLabel={t.domain.backRecords} centered width="narrow">
      <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
      <p className="text-sm text-muted">Database not configured</p>
    </PageShell>
  );
}
