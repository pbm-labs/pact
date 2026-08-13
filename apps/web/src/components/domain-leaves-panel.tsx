'use client';

import { useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import type { DomainLeafSummary } from '@/lib/domain-data';
import { formatReportPeriod, reporterLabel } from '@/lib/domain-report-utils';
import { panel } from '@/lib/ui';

const INITIAL_VISIBLE = 10;
const LOAD_MORE_STEP = 20;

const th = 'text-left font-medium px-3 py-1.5 whitespace-nowrap';
const td = 'px-3 py-1.5';

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
      <section className={`${panel} mb-4`}>
        <div className="px-3 py-2 border-b border-border flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 className="text-sm font-semibold text-txt m-0">{t.domain.reportHistory}</h2>
          <p className="text-[0.7rem] text-muted-2 m-0">
            {t.domain.reportHistoryCounts
              .replace('{periods}', domainLeafCount.toLocaleString())
              .replace('{reporters}', String(uniqueReporters))}
          </p>
        </div>
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border font-mono uppercase tracking-widest text-muted-2">
                <th className={th}>{t.domain.colReporter}</th>
                <th className={th}>{t.domain.colPeriod}</th>
                <th className={`${th} text-right`}>{t.domain.colPass}</th>
                <th className={`${th} text-right`}>{t.domain.colFail}</th>
                <th className={`${th} text-right`}>{t.domain.colIngested}</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeaves.map((leaf) => (
                <tr key={leaf.leafIndex} className="border-b border-border last:border-0">
                  <td className={`${td} text-txt`}>{reporterLabel(leaf.reporterOrg)}</td>
                  <td className={`${td} text-muted font-mono`}>
                    {formatReportPeriod(leaf.periodStart, leaf.periodEnd)}
                  </td>
                  <td className={`${td} text-right font-mono tabular-nums`}>
                    {leaf.dkimPassCount.toLocaleString()}
                  </td>
                  <td className={`${td} text-right font-mono tabular-nums text-muted-2`}>
                    {leaf.dkimFailCount.toLocaleString()}
                  </td>
                  <td className={`${td} text-right font-mono text-muted-2`}>
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
          <div className="px-3 py-2 border-t border-border">
            <button
              type="button"
              className="text-xs font-semibold text-muted hover:text-txt"
              onClick={() => setVisibleCount((n) => Math.min(n + LOAD_MORE_STEP, leaves.length))}
            >
              {t.domain.showOlderReports
                .replace('{shown}', String(visibleLeaves.length))
                .replace('{total}', String(leaves.length))}
            </button>
          </div>
        )}
      </section>

      <section className={`${panel} mb-4`}>
        <div className="px-3 py-2 border-b border-border">
          <h2 className="text-sm font-semibold text-txt m-0">{t.domain.verification}</h2>
        </div>
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full text-xs">
            <tbody>
              <MetaRow
                label={t.domain.anchor}
                value={anchorType === 'base' ? t.domain.onChain : t.domain.stagingOffChain}
              />
              <MetaRow
                label={t.domain.rootsMatch}
                value={rootMatchesPublished ? t.domain.yes : t.domain.no}
              />
              <MetaRow label={t.domain.domainLeaves} value={domainLeafCount.toLocaleString()} mono />
              <MetaRow
                label={t.domain.globalTree}
                value={globalTreeLeafCount?.toLocaleString() ?? '—'}
                mono
              />
              <MetaRow
                label={t.domain.publishedRoot}
                value={truncateHash(latestRoot)}
                title={latestRoot ?? undefined}
                mono
              />
            </tbody>
          </table>
        </div>
        {leaves.length > visibleLeaves.length && (
          <p className="px-3 py-1.5 text-[0.7rem] text-muted-2 border-t border-border m-0">
            {t.domain.proofsShown.replace('{n}', String(visibleLeaves.length))}
          </p>
        )}
        <div className="overflow-x-auto thin-scrollbar border-t border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border font-mono uppercase tracking-widest text-muted-2">
                <th className={th}>#</th>
                <th className={th}>{t.domain.colReporter}</th>
                <th className={th}>{t.domain.verification}</th>
                <th className={th}>{t.domain.leafHash}</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeaves.map((leaf) => (
                <tr key={`proof-${leaf.leafIndex}`} className="border-b border-border last:border-0">
                  <td className={`${td} font-mono tabular-nums text-muted`}>#{leaf.leafIndex}</td>
                  <td className={`${td} text-txt`}>{reporterLabel(leaf.reporterOrg)}</td>
                  <td className={`${td} ${leaf.merkleProofValid ? 'text-verified' : 'text-danger'}`}>
                    {leaf.merkleProofValid ? t.domain.proofVerified : t.domain.proofUnverified}
                  </td>
                  <td
                    className={`${td} font-mono text-muted-2`}
                    title={leaf.leafHash}
                  >
                    {truncateHash(leaf.leafHash)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function MetaRow({
  label,
  value,
  title,
  mono = false,
}: {
  label: string;
  value: string;
  title?: string;
  mono?: boolean;
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <th className={`${th} text-muted-2 font-medium w-[9rem]`}>{label}</th>
      <td className={`${td} ${mono ? 'font-mono break-all' : ''}`} title={title}>
        {value}
      </td>
    </tr>
  );
}

function truncateHash(hash: string | null, head = 10, tail = 6): string {
  if (!hash) return '—';
  if (hash.length <= head + tail + 1) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}
