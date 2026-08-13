'use client';

import Link from 'next/link';
import type { TrustScoreProgress } from '@pact/core';
import { BadgeEmbed } from '@/components/badge-embed';
import { DomainClocks } from '@/components/domain-clocks';
import { DomainLeavesPanel } from '@/components/domain-leaves-panel';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { ScoreGauge } from '@/components/score-gauge';
import type { DomainLiveData, DomainPageState } from '@/lib/domain-data';
import { routes } from '@/lib/routes';
import {
  formatScoreProgressHint,
  formatVerifiedDays,
  localizeBandLabel,
  type ScoreBandKey,
} from '@/lib/trust-display';
import {
  badgeAmber,
  badgeVerified,
  btnPrimary,
  eyebrow,
  pageIntro,
  pageTitle,
  panel,
  panelBody,
  panelSectionTitle,
  statValue,
} from '@/lib/ui';

export type DomainLiveScoreView = {
  rawScore: number;
  displayScore: number;
  bandKey: ScoreBandKey;
  showScore: boolean;
  progress: TrustScoreProgress;
  verifiedDays: number;
};

interface DomainPageViewProps {
  domain: string;
  state: DomainPageState | null;
  liveScore: DomainLiveScoreView | null;
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
    <div className="rounded-xl border border-border bg-surface px-4 py-4">
      <p
        className={`${statValue} ${dim ? 'text-muted-2' : 'text-txt'}`}
      >
        {value}
      </p>
      <p className="text-xs font-semibold text-txt mt-2">{label}</p>
      {sub && (
        <p className="text-xs text-muted-2 mt-0.5 leading-tight">{sub}</p>
      )}
    </div>
  );
}

export function DomainPageView({
  domain,
  state,
  liveScore,
  unconfigured,
}: DomainPageViewProps) {
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

  if (!liveScore) {
    return <UnknownDomainPage domain={domain} />;
  }

  return <LivePage data={state.data} liveScore={liveScore} />;
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
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords}>
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

      <EmbeddableBadgeSection domain={domain} />
    </PageShell>
  );
}

function LivePage({
  data,
  liveScore,
}: {
  data: DomainLiveData;
  liveScore: DomainLiveScoreView;
}) {
  const { t } = useLocale();
  const statusBadge = data.trust.status === 'activated' ? badgeVerified : badgeAmber;
  const statusLabel =
    data.trust.status === 'activated' ? t.domain.proven : t.domain.building;
  const { rawScore, displayScore, bandKey, showScore, progress, verifiedDays } = liveScore;
  const bandLabel = localizeBandLabel(bandKey, t.domain);
  const verifiedLabel = formatVerifiedDays(verifiedDays, t.domain);
  const progressHint = formatScoreProgressHint(progress, rawScore, t.domain);

  return (
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords}>
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
                  <ScoreGauge score={displayScore} size={108} strokeWidth={8} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`${statValue} text-txt`}>
                      {displayScore}
                    </span>
                    <span className="text-xs font-mono text-muted-2 mt-0.5">/ 100</span>
                  </div>
                </div>
                <p className="text-sm text-muted m-0">{bandLabel}</p>
              </>
            ) : (
              <div className="text-left sm:text-right">
                <p className={`${statValue} text-txt m-0`}>
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
        <summary className="flex items-center gap-2 cursor-pointer select-none mb-6 text-xs font-mono uppercase tracking-widest text-muted-2 hover:text-muted">
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
          <div className="px-5 py-4 text-xs font-mono uppercase tracking-widest text-muted-2">
            {t.domain.showMath}
          </div>
          <div className={`${panelBody} pt-0 border-t border-border`}>
            <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-2">{t.domain.mathRawScore}</dt>
              <dd className="m-0 font-mono tabular-nums">{rawScore.toFixed(4)}</dd>
              {showScore && (
                <>
                  <dt className="text-muted-2">{t.domain.mathDisplay}</dt>
                  <dd className="m-0 font-mono tabular-nums">
                    {displayScore} / 100 · {bandLabel}
                  </dd>
                </>
              )}
              <dt className="text-muted-2">{t.domain.mathVolume}</dt>
              <dd className="m-0 font-mono tabular-nums">{data.trust.volume.toFixed(3)}</dd>
              <dt className="text-muted-2">{t.domain.mathDiversity}</dt>
              <dd className="m-0 font-mono tabular-nums">{data.trust.diversity.toFixed(3)}</dd>
              <dt className="text-muted-2">{t.domain.mathMaturity}</dt>
              <dd className="m-0 font-mono tabular-nums">{data.trust.maturity.toFixed(4)}</dd>
              <dt className="text-muted-2">{t.domain.timeVerified}</dt>
              <dd className="m-0 font-mono tabular-nums">{verifiedDays}d</dd>
              <dt className="text-muted-2">{t.domain.mathFailedChecks}</dt>
              <dd className="m-0 font-mono tabular-nums">{data.totalFailCount.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </details>

      <EmbeddableBadgeSection domain={data.domain} />
    </PageShell>
  );
}

function EmbeddableBadgeSection({ domain }: { domain: string }) {
  const { t } = useLocale();
  return (
    <section className="mt-12 pt-10 border-t border-border">
      <p className={eyebrow}>{t.domain.badgeEyebrow}</p>
      <p className="mt-3 mb-6 text-sm text-muted leading-relaxed max-w-xl">
        {t.domain.badgeIntro}
      </p>
      <BadgeEmbed domain={domain} />
    </section>
  );
}

function UnknownDomainPage({ domain }: { domain: string }) {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords} centered>
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

      <Link href={`${routes.connect}?domain=${encodeURIComponent(domain)}`} className={btnPrimary}>
        {t.domain.connectDomain} {domain}
      </Link>
    </PageShell>
  );
}

function UnconfiguredPage({ domain }: { domain: string }) {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords} centered>
      <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
      <p className="text-sm text-muted">{t.domain.dbNotConfigured}</p>
    </PageShell>
  );
}
