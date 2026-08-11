'use client';

import { useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import type { DomainLeafSummary } from '@/lib/domain-data';
import { formatReportPeriod, reporterLabel } from '@/lib/domain-report-utils';
import { btnGhost, panel, panelBody, panelSectionTitle } from '@/lib/ui';

const INITIAL_VISIBLE = 10;
const LOAD_MORE_STEP = 20;

interface DomainLeavesPanelProps {
  leaves: DomainLeafSummary[];
  domainLeafCount: number;
  uniqueReporters: number;
  anchorType: 'staging' | 'base' | null;
  rootMatchesPublished: boolean;
  latestRoot: string | null;
  globalTreeLeafCount: number | null;
}

export function DomainLeavesPanel({
  leaves,
  domainLeafCount,
  uniqueReporters,
  anchorType,
  rootMatchesPublished,
  latestRoot,
  globalTreeLeafCount,
}: DomainLeavesPanelProps) {
  const { t, locale } = useLocale();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visibleLeaves = leaves.slice(0, visibleCount);
  const hasMore = visibleCount < leaves.length;

  return (
    <>
      <section className={`${panel} mb-6`}>
        <div className={`${panelBody} border-b border-border`}>
          <h2 className={panelSectionTitle}>{t.domain.reportHistory}</h2>
          <p className="text-xs text-muted-2 mt-1 max-w-2xl leading-relaxed">
            {t.domain.reportHistoryIntro}{' '}
            {t.domain.reportHistoryCounts
              .replace('{periods}', domainLeafCount.toLocaleString())
              .replace('{reporters}', String(uniqueReporters))}
          </p>
        </div>
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-mono uppercase tracking-widest text-muted-2">
                <th className="text-left font-medium px-5 py-2.5">{t.domain.colReporter}</th>
                <th className="text-left font-medium px-5 py-2.5">{t.domain.colPeriod}</th>
                <th className="text-right font-medium px-5 py-2.5">{t.domain.colPass}</th>
                <th className="text-right font-medium px-5 py-2.5">{t.domain.colFail}</th>
                <th className="text-right font-medium px-5 py-2.5">{t.domain.colIngested}</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeaves.map((leaf) => (
                <tr key={leaf.leafIndex} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-txt">{reporterLabel(leaf.reporterOrg)}</td>
                  <td className="px-5 py-3 text-muted font-mono text-xs">
                    {formatReportPeriod(leaf.periodStart, leaf.periodEnd)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums">
                    {leaf.dkimPassCount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-muted-2">
                    {leaf.dkimFailCount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-muted-2">
                    {leaf.receivedAt
                      ? new Date(leaf.receivedAt).toLocaleDateString(locale, {
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
        {hasMore && (
          <div className="px-5 py-4 border-t border-border">
            <button
              type="button"
              className={btnGhost}
              onClick={() => setVisibleCount((n) => Math.min(n + LOAD_MORE_STEP, leaves.length))}
            >
              {t.domain.showOlderReports
                .replace('{shown}', String(visibleLeaves.length))
                .replace('{total}', String(leaves.length))}
            </button>
          </div>
        )}
      </section>

      <section className={`${panel} mb-6`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>{t.domain.verification}</h2>
          <p className="text-sm text-muted mb-4">{t.domain.verificationIntro}</p>
          <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-2 text-sm mb-4">
            <dt className="text-muted-2">{t.domain.anchor}</dt>
            <dd className="m-0">
              {anchorType === 'base' ? t.domain.onChain : t.domain.stagingOffChain}
            </dd>
            <dt className="text-muted-2">{t.domain.rootsMatch}</dt>
            <dd className="m-0">{rootMatchesPublished ? t.domain.yes : t.domain.no}</dd>
            <dt className="text-muted-2">{t.domain.domainLeaves}</dt>
            <dd className="m-0 font-mono tabular-nums">{domainLeafCount.toLocaleString()}</dd>
            <dt className="text-muted-2">{t.domain.globalTree}</dt>
            <dd className="m-0 font-mono tabular-nums">
              {globalTreeLeafCount?.toLocaleString() ?? '—'}
            </dd>
          </dl>
          <details className="mb-4">
            <summary className="cursor-pointer text-xs font-mono uppercase tracking-widest text-muted-2">
              {t.domain.publishedRoot}
            </summary>
            <p className="font-mono text-xs break-all text-muted mt-2">{latestRoot ?? '—'}</p>
          </details>
          {leaves.length > visibleLeaves.length && (
            <p className="text-xs text-muted-2 mb-3">
              {t.domain.proofsShown.replace('{n}', String(visibleLeaves.length))}
            </p>
          )}
          <div className="space-y-2">
            {visibleLeaves.map((leaf) => (
              <details
                key={`proof-${leaf.leafIndex}`}
                className="rounded-lg border border-border bg-bg/50 px-4 py-2"
              >
                <summary className="cursor-pointer text-sm font-mono">
                  Leaf #{leaf.leafIndex} · {reporterLabel(leaf.reporterOrg)} ·{' '}
                  <span className={leaf.merkleProofValid ? 'text-verified' : 'text-danger'}>
                    {leaf.merkleProofValid ? t.domain.proofVerified : t.domain.proofUnverified}
                  </span>
                </summary>
                <dl className="grid grid-cols-[minmax(5rem,auto)_1fr] gap-x-3 gap-y-1 text-xs mt-3 mb-1">
                  <dt className="text-muted-2">{t.domain.leafHash}</dt>
                  <dd className="m-0 font-mono break-all">{leaf.leafHash}</dd>
                </dl>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
