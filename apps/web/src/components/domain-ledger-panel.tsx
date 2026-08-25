'use client';

import { useLocale } from '@/components/locale-provider';
import { explorerAddressUrl, explorerTxUrl } from '@/lib/explorer';
import { panel } from '@/lib/ui';

const th = 'text-left font-medium px-3 py-1.5 whitespace-nowrap';
const td = 'px-3 py-1.5';

export interface DomainLedgerPanelProps {
  mailLeafCount: number;
  ctLeafCount: number;
  rekorLeafCount: number;
  anchorType: 'staging' | 'base' | null;
  rootMatchesPublished: boolean;
  latestRoot: string | null;
  rootTxHash: string | null;
  rootsContract: string | null;
  globalTreeLeafCount: number | null;
}

export function DomainLedgerPanel({
  mailLeafCount,
  ctLeafCount,
  rekorLeafCount,
  anchorType,
  rootMatchesPublished,
  latestRoot,
  rootTxHash,
  rootsContract,
  globalTreeLeafCount,
}: DomainLedgerPanelProps) {
  const { t } = useLocale();
  const domainLeaves = mailLeafCount + ctLeafCount + rekorLeafCount;
  const rootHref = rootTxHash
    ? explorerTxUrl(rootTxHash)
    : rootsContract
      ? explorerAddressUrl(rootsContract)
      : null;

  return (
    <section className={`${panel} mb-4`}>
      <div className="px-3 py-2 border-b border-border">
        <h2 className="text-sm font-semibold text-txt m-0">{t.domain.ledgerTitle}</h2>
      </div>
      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full text-xs">
          <tbody>
            <MetaRow
              label={t.domain.anchor}
              value={
                anchorType === 'base'
                  ? t.domain.onChain
                  : anchorType === 'staging'
                    ? t.domain.stagingOffChain
                    : '—'
              }
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
            <MetaRow label={t.domain.mailLeaves} value={mailLeafCount.toLocaleString()} mono />
            <MetaRow label={t.domain.ctLeaves} value={ctLeafCount.toLocaleString()} mono />
            <MetaRow label={t.domain.rekorLeaves} value={rekorLeafCount.toLocaleString()} mono />
            <MetaRow label={t.domain.domainLeaves} value={domainLeaves.toLocaleString()} mono />
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
              href={rootHref}
              mono
            />
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

function truncateHash(hash: string | null, head = 10, tail = 6): string {
  if (!hash) return '—';
  if (hash.length <= head + tail + 1) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}
