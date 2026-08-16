'use client';

import Link from 'next/link';
import { DomainClocks } from '@/components/domain-clocks';
import { DomainLeavesPanel } from '@/components/domain-leaves-panel';
import { SharePublicRecord } from '@/components/share-public-record';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import type { DomainLiveData, DomainPageState } from '@/lib/domain-data';
import { routes } from '@/lib/routes';
import {
  badgeAmber,
  btnPrimary,
  eyebrow,
  pageIntro,
  pageTitle,
  panel,
  panelBody,
  panelSectionTitle,
  statValue,
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
}: {
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-4">
      <p className={`${statValue} text-txt`}>{value}</p>
      <p className="text-xs font-semibold text-txt mt-2">{label}</p>
      {sub && <p className="text-xs text-muted-2 mt-0.5 leading-tight">{sub}</p>}
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
    </PageShell>
  );
}

function LivePage({ data }: { data: DomainLiveData }) {
  const { t } = useLocale();
  const verifiedDays = Math.floor(data.pactAgeDays);

  return (
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords}>
      <header className="mb-8">
        <p className={`${eyebrow} mb-2`}>{t.domain.publicRecord}</p>
        <h1 className={`${pageTitle} break-all`}>{data.domain}</h1>
        <p className="text-sm text-muted mt-3 max-w-xl leading-relaxed">
          {t.domain.historyIntro}
        </p>
        <DomainClocks
          domainRegisteredAt={data.domainRegisteredAt}
          pactHistoryStart={data.pactHistoryStart}
        />
      </header>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
        <Stat value={`${verifiedDays}d`} label={t.domain.timeVerified} />
        <Stat
          value={String(data.domainLeafCount)}
          label={t.domain.reports}
          sub={t.domain.allTime}
        />
        <Stat
          value={String(data.uniqueReporters)}
          label={t.domain.reportingOrgs}
          sub={t.domain.independent}
        />
      </div>

      <div className="mb-10">
        <SharePublicRecord domain={data.domain} />
      </div>

      <section className="mt-12 pt-10 border-t border-border">
        <p className={`${eyebrow} mb-3`}>{t.domain.techSummary}</p>

        <div className="mb-8">
          <Stat value={`${data.passRate.toFixed(1)}%`} label={t.domain.passRate} />
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
      </section>
    </PageShell>
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
