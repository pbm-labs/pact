'use client';

import { useState, type ReactNode } from 'react';
import { useLocale } from '@/components/locale-provider';
import type { DomainCtSummary, DomainLeafSummary, WrapperOpeningStatus } from '@/lib/domain-data';
import { explorerAddressUrl, explorerTxUrl } from '@/lib/explorer';
import type { Dictionary } from '@/lib/i18n/types';
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
  rootTxHash: string | null;
  rootsContract: string | null;
  globalTreeLeafCount: number | null;
}

export function DomainLeavesPanel({
  leaves,
  domainLeafCount,
  uniqueReporters,
  anchorType,
  rootMatchesPublished,
  latestRoot,
  rootTxHash,
  rootsContract,
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
                href={
                  anchorType === 'base' && rootsContract
                    ? explorerAddressUrl(rootsContract)
                    : null
                }
                title={anchorType === 'base' ? t.domain.explorerContract : undefined}
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
                title={
                  latestRoot && rootTxHash
                    ? `${latestRoot} — ${t.domain.explorerTx}`
                    : latestRoot ?? undefined
                }
                href={
                  rootTxHash
                    ? explorerTxUrl(rootTxHash)
                    : rootsContract
                      ? explorerAddressUrl(rootsContract)
                      : null
                }
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
                <th className={th}>{t.domain.colWrapper}</th>
                <th className={th}>{t.domain.colOpening}</th>
                <th className={th}>{t.domain.verification}</th>
                <th className={th}>{t.domain.leafHash}</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeaves.map((leaf) => (
                <tr key={`proof-${leaf.leafIndex}`} className="border-b border-border last:border-0">
                  <td className={`${td} font-mono tabular-nums text-muted`}>#{leaf.leafIndex}</td>
                  <td className={`${td} text-txt`}>{reporterLabel(leaf.reporterOrg)}</td>
                  <td
                    className={`${td} font-mono text-muted-2`}
                    title={leaf.wrapperHashes.join(', ') || undefined}
                  >
                    {formatWrapperDkim(leaf.wrapperDkim)}
                  </td>
                  <td
                    className={`${td} ${openingClass(leaf.wrapperOpening, Boolean(leaf.wrapperCheckUrl))}`}
                    title={openingTitle(leaf.wrapperOpening, t.domain)}
                  >
                    <LedgerLink href={leaf.wrapperCheckUrl} title={t.domain.openingCheck}>
                      {openingLabel(leaf.wrapperOpening, t.domain)}
                    </LedgerLink>
                  </td>
                  <td className={`${td} ${leaf.merkleProofValid ? 'text-verified' : 'text-danger'}`}>
                    {leaf.merkleProofValid ? t.domain.proofVerified : t.domain.proofUnverified}
                  </td>
                  <td className={`${td} font-mono text-muted-2`} title={leaf.leafHash}>
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
  if (!certs.length) return null;

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
      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border font-mono uppercase tracking-widest text-muted-2">
              <th className={th}>#</th>
              <th className={th}>{t.domain.colIssuer}</th>
              <th className={th}>{t.domain.colNotBefore}</th>
              <th className={th}>{t.domain.colLoggedAt}</th>
              <th className={th}>{t.domain.verification}</th>
              <th className={th}>{t.domain.colFingerprint}</th>
              <th className={th}>{t.domain.leafHash}</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((cert) => (
              <tr key={`${cert.leafIndex}-${cert.fingerprint}`} className="border-b border-border last:border-0">
                <td className={`${td} font-mono tabular-nums text-muted`}>#{cert.leafIndex}</td>
                <td className={`${td} text-txt`} title={cert.issuer || undefined}>
                  <span className="block max-w-[16rem] truncate">
                    {shortIssuer(cert.issuer) || cert.commonName || '—'}
                  </span>
                  <span className="block text-[0.65rem] text-muted-2 font-mono">{t.domain.ctKindLabel}</span>
                </td>
                <td className={`${td} font-mono text-muted`}>{formatUnixDate(cert.notBefore, locale)}</td>
                <td className={`${td} font-mono text-muted`}>{formatUnixDate(cert.loggedAt, locale)}</td>
                <td className={`${td} ${cert.merkleProofValid ? 'text-verified' : 'text-danger'}`}>
                  {cert.merkleProofValid ? t.domain.proofVerified : t.domain.proofUnverified}
                </td>
                <td className={`${td} font-mono text-muted-2`} title={cert.fingerprint}>
                  {truncateHash(cert.fingerprint.startsWith('0x') ? cert.fingerprint : `0x${cert.fingerprint}`)}
                </td>
                <td className={`${td} font-mono text-muted-2`} title={cert.leafHash}>
                  <LedgerLink href={cert.leafUrl} title={`${cert.leafHash} — ${t.domain.leafLedger}`}>
                    {truncateHash(cert.leafHash)}
                  </LedgerLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MetaRow({
  label,
  value,
  title,
  href,
  mono = false,
}: {
  label: string;
  value: string;
  title?: string;
  href?: string | null;
  mono?: boolean;
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <th className={`${th} text-muted-2 font-medium w-[9rem]`}>{label}</th>
      <td className={`${td} ${mono ? 'font-mono break-all' : ''}`}>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold no-underline hover:opacity-90"
            title={title}
          >
            {value}
          </a>
        ) : (
          <span title={title}>{value}</span>
        )}
      </td>
    </tr>
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

function formatUnixDate(ts: number, locale: string): string {
  if (!Number.isFinite(ts) || ts <= 0) return '—';
  return new Date(ts * 1000).toLocaleDateString(locale, {
    year: 'numeric',
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
