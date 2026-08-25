'use client';

import { type ReactNode } from 'react';
import { useLocale } from '@/components/locale-provider';
import type { DomainCtSummary, DomainLeafSummary, WrapperOpeningStatus } from '@/lib/domain-data';
import type { Dictionary } from '@/lib/i18n/types';
import { formatReportPeriod, reporterLabel } from '@/lib/domain-report-utils';
import { panel } from '@/lib/ui';

const tableScroll =
  'overflow-auto thin-scrollbar overscroll-contain max-h-[calc(2.15rem+10*1.85rem)]';
const ctTableScroll =
  'overflow-y-auto overflow-x-hidden thin-scrollbar overscroll-contain max-h-[calc(2.15rem+10*1.85rem)]';
const tableClass = 'w-full text-xs border-separate border-spacing-0';
const theadClass = 'sticky top-0 z-[1] bg-surface';

const th = 'text-left font-medium px-3 py-1.5 whitespace-nowrap';
const td = 'px-3 py-1.5';
const ctTh = 'text-left font-medium px-2 py-1.5';
const ctTd = 'px-2 py-1.5 min-w-0';

interface DomainLeavesPanelProps {
  leaves: DomainLeafSummary[];
  uniqueReporters: number;
}

export function DomainLeavesPanel({ leaves, uniqueReporters }: DomainLeavesPanelProps) {
  const { t, locale } = useLocale();

  return (
    <>
      <section className={`${panel} mb-4`}>
        <div className="px-3 py-2 border-b border-border flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 className="text-sm font-semibold text-txt m-0">{t.domain.reportHistory}</h2>
          <p className="text-[0.7rem] text-muted-2 m-0">
            {t.domain.reportHistoryCounts
              .replace('{periods}', leaves.length.toLocaleString())
              .replace('{reporters}', String(uniqueReporters))}
          </p>
        </div>
        <div className={tableScroll}>
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr className="font-mono uppercase tracking-widest text-muted-2">
                <th className={`${th} border-b border-border bg-surface`}>{t.domain.colReporter}</th>
                <th className={`${th} border-b border-border bg-surface`}>{t.domain.colPeriod}</th>
                <th className={`${th} border-b border-border bg-surface text-right`}>
                  {t.domain.colPass}
                </th>
                <th className={`${th} border-b border-border bg-surface text-right`}>
                  {t.domain.colFail}
                </th>
                <th className={`${th} border-b border-border bg-surface text-right`}>
                  {t.domain.colIngested}
                </th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leaf) => (
                <tr key={leaf.leafIndex}>
                  <td className={`${td} border-b border-border text-txt`}>
                    {reporterLabel(leaf.reporterOrg)}
                  </td>
                  <td className={`${td} border-b border-border text-muted font-mono`}>
                    {formatReportPeriod(leaf.periodStart, leaf.periodEnd)}
                  </td>
                  <td className={`${td} border-b border-border text-right font-mono tabular-nums`}>
                    {leaf.dkimPassCount.toLocaleString()}
                  </td>
                  <td
                    className={`${td} border-b border-border text-right font-mono tabular-nums text-muted-2`}
                  >
                    {leaf.dkimFailCount.toLocaleString()}
                  </td>
                  <td className={`${td} border-b border-border text-right font-mono text-muted-2`}>
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
      </section>

      <section className={`${panel} mb-4`}>
        <div className="px-3 py-2 border-b border-border">
          <h2 className="text-sm font-semibold text-txt m-0">{t.domain.mailProofs}</h2>
        </div>
        <div className={tableScroll}>
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr className="font-mono uppercase tracking-widest text-muted-2">
                <th className={`${th} border-b border-border bg-surface`}>#</th>
                <th className={`${th} border-b border-border bg-surface`}>{t.domain.colReporter}</th>
                <th className={`${th} border-b border-border bg-surface`}>{t.domain.colWrapper}</th>
                <th className={`${th} border-b border-border bg-surface`}>{t.domain.colOpening}</th>
                <th className={`${th} border-b border-border bg-surface`}>
                  {t.domain.verification}
                </th>
                <th className={`${th} border-b border-border bg-surface`}>{t.domain.leafHash}</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leaf) => (
                <tr key={`proof-${leaf.leafIndex}`}>
                  <td className={`${td} border-b border-border font-mono tabular-nums text-muted`}>
                    #{leaf.leafIndex}
                  </td>
                  <td className={`${td} border-b border-border text-txt`}>
                    {reporterLabel(leaf.reporterOrg)}
                  </td>
                  <td
                    className={`${td} border-b border-border font-mono text-muted-2`}
                    title={leaf.wrapperHashes.join(', ') || undefined}
                  >
                    {formatWrapperDkim(leaf.wrapperDkim)}
                  </td>
                  <td
                    className={`${td} border-b border-border ${openingClass(leaf.wrapperOpening, Boolean(leaf.wrapperCheckUrl))}`}
                    title={openingTitle(leaf.wrapperOpening, t.domain)}
                  >
                    <LedgerLink href={leaf.wrapperCheckUrl} title={t.domain.openingCheck}>
                      {openingLabel(leaf.wrapperOpening, t.domain)}
                    </LedgerLink>
                  </td>
                  <td
                    className={`${td} border-b border-border ${leaf.merkleProofValid ? 'text-verified' : 'text-danger'}`}
                  >
                    {leaf.merkleProofValid ? t.domain.proofVerified : t.domain.proofUnverified}
                  </td>
                  <td
                    className={`${td} border-b border-border font-mono text-muted-2`}
                    title={leaf.leafHash}
                  >
                    <LedgerLink href={leaf.leafUrl} title={`${leaf.leafHash} — ${t.domain.leafLedger}`}>
                      {truncateHash(leaf.leafHash)}
                    </LedgerLink>
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

export function DomainCtPanel({ certs }: { certs: DomainCtSummary[] }) {
  const { t, locale } = useLocale();

  return (
    <section className={`${panel} mb-4`}>
      <div className="px-3 py-2 border-b border-border flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-sm font-semibold text-txt m-0">{t.domain.ctHistory}</h2>
        <p className="text-[0.7rem] text-muted-2 m-0">
          {t.domain.ctHistoryCounts.replace('{n}', certs.length.toLocaleString())}
        </p>
      </div>
      <p className="px-3 py-2 text-xs text-muted leading-relaxed m-0 border-b border-border">
        {t.domain.ctIntro}
      </p>
      {!certs.length ? (
        <p className="px-3 py-4 text-sm text-muted m-0">{t.domain.ctEmpty}</p>
      ) : (
        <div className={ctTableScroll}>
          <table className={`${tableClass} table-fixed`}>
            <colgroup>
              <col className="w-11" />
              <col />
              <col className="w-[6.75rem]" />
              <col className="w-[7.25rem]" />
            </colgroup>
            <thead className={theadClass}>
              <tr className="font-mono uppercase tracking-widest text-muted-2">
                <th className={`${ctTh} border-b border-border bg-surface`}>#</th>
                <th className={`${ctTh} border-b border-border bg-surface`}>{t.domain.colIssuer}</th>
                <th className={`${ctTh} border-b border-border bg-surface`}>{t.domain.colLoggedAt}</th>
                <th className={`${ctTh} border-b border-border bg-surface`}>
                  {t.domain.verification}
                </th>
              </tr>
            </thead>
            <tbody>
              {certs.map((cert) => {
                const issuer = shortIssuer(cert.issuer) || cert.commonName || '—';
                const showCommonName = Boolean(cert.commonName) && cert.commonName !== issuer;
                const fingerprint = cert.fingerprint.startsWith('0x')
                  ? cert.fingerprint
                  : `0x${cert.fingerprint}`;
                return (
                  <tr key={`${cert.leafIndex}-${cert.fingerprint}`}>
                    <td className={`${ctTd} border-b border-border font-mono tabular-nums text-muted`}>
                      #{cert.leafIndex}
                    </td>
                    <td className={`${ctTd} border-b border-border text-txt`}>
                      <span className="block truncate" title={cert.issuer || undefined}>
                        {issuer}
                      </span>
                      {showCommonName && (
                        <span
                          className="block text-[0.65rem] text-muted-2 font-mono truncate"
                          title={cert.commonName}
                        >
                          {cert.commonName}
                        </span>
                      )}
                      <span
                        className="block text-[0.65rem] font-mono text-muted-2 truncate"
                        title={`${t.domain.colFingerprint} ${fingerprint}`}
                      >
                        {truncateHash(fingerprint)}
                      </span>
                    </td>
                    <td className={`${ctTd} border-b border-border font-mono text-muted`}>
                      <span
                        className="block truncate"
                        title={`${t.domain.colLoggedAt} ${formatUnixDate(cert.loggedAt, locale)}`}
                      >
                        {formatUnixDate(cert.loggedAt, locale, true)}
                      </span>
                      <span
                        className="block text-[0.65rem] text-muted-2 truncate"
                        title={`${t.domain.colNotBefore} ${formatUnixDate(cert.notBefore, locale)}`}
                      >
                        {formatUnixDate(cert.notBefore, locale, true)}
                      </span>
                    </td>
                    <td
                      className={`${ctTd} border-b border-border ${cert.merkleProofValid ? 'text-verified' : 'text-danger'}`}
                    >
                      <span className="block truncate">
                        {cert.merkleProofValid ? t.domain.proofVerified : t.domain.proofUnverified}
                      </span>
                      <span
                        className="block font-mono text-[0.65rem] text-muted-2 truncate"
                        title={cert.leafHash}
                      >
                        <LedgerLink
                          href={cert.leafUrl}
                          title={`${cert.leafHash} — ${t.domain.leafLedger}`}
                        >
                          {truncateHash(cert.leafHash)}
                        </LedgerLink>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function LedgerLink({
  href,
  title,
  children,
}: {
  href: string | null;
  title?: string;
  children: ReactNode;
}) {
  if (!href) return children;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent font-semibold no-underline hover:opacity-90"
      title={title}
    >
      {children}
    </a>
  );
}

function truncateHash(hash: string | null, head = 10, tail = 6): string {
  if (!hash) return '—';
  if (hash.length <= head + tail + 1) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}

function formatUnixDate(ts: number, locale: string, compact = false): string {
  if (!Number.isFinite(ts) || ts <= 0) return '—';
  return new Date(ts * 1000).toLocaleDateString(locale, {
    year: compact ? '2-digit' : 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function shortIssuer(issuer: string): string {
  const cn = issuer.match(/CN=([^,/]+)/i);
  if (cn?.[1]) return cn[1].trim();
  return issuer.trim();
}

function formatWrapperDkim(ids: { domain: string; selector: string }[]): string {
  if (!ids.length) return '—';
  return ids
    .map((id) => (id.selector ? `${id.domain}:${id.selector}` : id.domain))
    .join(', ');
}

type DomainCopy = Dictionary['domain'];

function openingLabel(opening: WrapperOpeningStatus, t: DomainCopy): string {
  if (opening.status === 'none') return t.openingNone;
  if (opening.status === 'missing') return t.openingMissing;
  if (opening.ok) return t.openingOk;
  if (!opening.hashMatches && !opening.dkimKeysOnRecord) return t.openingFail;
  if (!opening.hashMatches) return t.openingHashMismatch;
  return t.openingNoKey;
}

function openingTitle(opening: WrapperOpeningStatus, t: DomainCopy): string | undefined {
  if (opening.status === 'none') return undefined;
  if (opening.status === 'missing') return t.openingMissingTitle;
  if (opening.ok) return t.openingOkTitle;
  if (!opening.hashMatches && !opening.dkimKeysOnRecord) return t.openingFailTitle;
  if (!opening.hashMatches) return t.openingHashMismatchTitle;
  return t.openingNoKeyTitle;
}

function openingClass(opening: WrapperOpeningStatus, linked: boolean): string {
  if (opening.status === 'checked' && !opening.ok) return 'text-danger';
  if (linked) return '';
  return 'text-muted-2';
}
