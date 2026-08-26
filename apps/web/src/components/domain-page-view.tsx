'use client';

import Link from 'next/link';
import { DomainClocks } from '@/components/domain-clocks';
import { DomainKindStrip } from '@/components/domain-kind-strip';
import { DomainLedgerPanel } from '@/components/domain-ledger-panel';
import { DomainCtPanel, DomainLeavesPanel, DomainRekorPanel } from '@/components/domain-leaves-panel';
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
    return <RecordPage awaiting data={state.data} />;
  }

  return <RecordPage awaiting={false} data={state.data} />;
}

function RecordPage({
  awaiting,
  data,
}: {
  awaiting: boolean;
  data: DomainLiveData | DomainWaitingData;
}) {
  const { t, locale } = useLocale();
  const leaves = 'leaves' in data ? data.leaves : [];
  const mailCount = leaves.length;
  const reporterCount = 'uniqueReporters' in data ? data.uniqueReporters : 0;
  const passRate = 'passRate' in data ? data.passRate : null;
  const range = loggedBounds(data.ct.map((row) => row.loggedAt));
  const rekorRange = loggedBounds(data.rekor.map((row) => row.integratedTime));

  return (
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords}>
      <header className="mb-8">
        {awaiting && (
          <span className={`${badgeAmber} mb-3 block w-fit`}>{t.domain.awaitingFirst}</span>
        )}
        <h1 className={`${pageTitle} break-all ${awaiting ? 'mb-2' : ''}`}>{data.domain}</h1>
        {awaiting && data.connectedSince && (
          <p className="text-xs text-muted-2 font-mono mt-3">
            {t.domain.connected} {new Date(data.connectedSince).toLocaleDateString(locale)}
          </p>
        )}
        <DomainClocks
          domainRegisteredAt={data.domainRegisteredAt}
          pactHistoryStart={data.pactHistoryStart}
        />
      </header>

      <DomainKindStrip
        mailCount={mailCount}
        reporterCount={reporterCount}
        passRate={passRate}
        ctCount={data.ct.length}
        ctFirstLoggedAt={range.first}
        ctLatestLoggedAt={range.latest}
        rekorCount={data.rekor.length}
        rekorFirstLoggedAt={rekorRange.first}
        rekorLatestLoggedAt={rekorRange.latest}
      />

      <DomainLedgerPanel
        mailLeafCount={mailCount}
        ctLeafCount={data.ct.length}
        rekorLeafCount={data.rekor.length}
        anchorType={data.anchorType}
        rootMatchesPublished={data.rootMatchesPublished}
        latestRoot={data.latestRoot}
        rootTxHash={data.rootTxHash}
        rootsContract={data.rootsContract}
        globalTreeLeafCount={data.globalTreeLeafCount}
      />

      {leaves.length > 0 && (
        <DomainLeavesPanel
          leaves={leaves}
          uniqueReporters={'uniqueReporters' in data ? data.uniqueReporters : 0}
        />
      )}
      <DomainCtPanel certs={data.ct} />
      <DomainRekorPanel entries={data.rekor} />
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

function loggedBounds(times: number[]): { first: number | null; latest: number | null } {
  let first: number | null = null;
  let latest: number | null = null;
  for (const t of times) {
    if (!Number.isFinite(t) || t <= 0) continue;
    if (first == null || t < first) first = t;
    if (latest == null || t > latest) latest = t;
  }
  return { first, latest };
}
