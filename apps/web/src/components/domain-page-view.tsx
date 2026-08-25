'use client';

import Link from 'next/link';
import { DomainClocks } from '@/components/domain-clocks';
import { DomainKindStrip } from '@/components/domain-kind-strip';
import { DomainLedgerPanel } from '@/components/domain-ledger-panel';
import { DomainCtPanel, DomainLeavesPanel } from '@/components/domain-leaves-panel';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import type { DomainLiveData, DomainPageState, DomainWaitingData } from '@/lib/domain-data';
import { routes } from '@/lib/routes';
import {
  badgeAmber,
  btnPrimary,
  pageIntro,
  pageTitle,
} from '@/lib/ui';

interface DomainPageViewProps {
  domain: string;
  state: DomainPageState | null;
  unconfigured: boolean;
}

export function DomainPageView({ domain, state, unconfigured }: DomainPageViewProps) {
  if (unconfigured) {
    return <UnconfiguredPage domain={domain} />;
  }

  if (!state) {
    return <UnknownDomainPage domain={domain} />;
  }

  if (state.status === 'waiting') {
    return <WaitingPage data={state.data} />;
  }

  return <LivePage data={state.data} />;
}

function WaitingPage({ data }: { data: DomainWaitingData }) {
  const { t } = useLocale();
  const range = ctLoggedBounds(data.ct);

  return (
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords}>
      <header className="mb-8">
        <span className={`${badgeAmber} mb-3`}>{t.domain.awaitingFirst}</span>
        <h1 className={`${pageTitle} break-all mb-2`}>{data.domain}</h1>
        {data.connectedSince && (
          <p className="text-xs text-muted-2 font-mono mt-3">
            {t.domain.connected} {new Date(data.connectedSince).toLocaleDateString()}
          </p>
        )}
        <DomainClocks
          domainRegisteredAt={data.domainRegisteredAt}
          pactHistoryStart={data.pactHistoryStart}
        />
      </header>

      <DomainKindStrip
        mailCount={0}
        reporterCount={0}
        passRate={null}
        ctCount={data.ct.length}
        ctFirstLoggedAt={range.first}
        ctLatestLoggedAt={range.latest}
      />

      {showLedger(data) && (
        <DomainLedgerPanel
          mailLeafCount={0}
          ctLeafCount={data.ct.length}
          anchorType={data.anchorType}
          rootMatchesPublished={data.rootMatchesPublished}
          latestRoot={data.latestRoot}
          rootTxHash={data.rootTxHash}
          rootsContract={data.rootsContract}
          globalTreeLeafCount={data.globalTreeLeafCount}
        />
      )}

      <DomainCtPanel certs={data.ct} />
    </PageShell>
  );
}

function LivePage({ data }: { data: DomainLiveData }) {
  const { t } = useLocale();
  const range = ctLoggedBounds(data.ct);

  return (
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords}>
      <header className="mb-8">
        <h1 className={`${pageTitle} break-all`}>{data.domain}</h1>
        <DomainClocks
          domainRegisteredAt={data.domainRegisteredAt}
          pactHistoryStart={data.pactHistoryStart}
        />
      </header>

      <DomainKindStrip
        mailCount={data.leaves.length}
        reporterCount={data.uniqueReporters}
        passRate={data.passRate}
        ctCount={data.ct.length}
        ctFirstLoggedAt={range.first}
        ctLatestLoggedAt={range.latest}
      />

      <DomainLedgerPanel
        mailLeafCount={data.leaves.length}
        ctLeafCount={data.ct.length}
        anchorType={data.anchorType}
        rootMatchesPublished={data.rootMatchesPublished}
        latestRoot={data.latestRoot}
        rootTxHash={data.rootTxHash}
        rootsContract={data.rootsContract}
        globalTreeLeafCount={data.globalTreeLeafCount}
      />

      {data.leaves.length > 0 && (
        <DomainLeavesPanel leaves={data.leaves} uniqueReporters={data.uniqueReporters} />
      )}
      <DomainCtPanel certs={data.ct} />
    </PageShell>
  );
}

function UnknownDomainPage({ domain }: { domain: string }) {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords} centered>
      <h1 className={`${pageTitle} break-all mb-2`}>{domain}</h1>
      <p className={`${pageIntro} mb-6`}>{t.domain.noRecordYet}</p>

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

function ctLoggedBounds(certs: { loggedAt: number }[]): {
  first: number | null;
  latest: number | null;
} {
  let first: number | null = null;
  let latest: number | null = null;
  for (const cert of certs) {
    const t = cert.loggedAt;
    if (!Number.isFinite(t) || t <= 0) continue;
    if (first == null || t < first) first = t;
    if (latest == null || t > latest) latest = t;
  }
  return { first, latest };
}

function showLedger(data: DomainWaitingData): boolean {
  return data.anchorType != null || data.latestRoot != null || data.ct.length > 0;
}
