import Link from 'next/link';
import type { CheckSummary } from '@/lib/check-summary';
import {
  badgeAmber,
  badgeMuted,
  badgeVerified,
  btnGhost,
  btnPrimary,
  panel,
  panelBody,
  sectionTitle,
} from '@/lib/ui';

function StatusBadge({ status }: { status: CheckSummary['status'] }) {
  switch (status) {
    case 'live-activated':
      return <span className={badgeVerified}>Established</span>;
    case 'live-provisional':
    case 'waiting':
      return <span className={badgeAmber}>Building</span>;
    case 'disconnected':
      return <span className={badgeMuted}>Disconnected</span>;
    default:
      return <span className={badgeMuted}>No record</span>;
  }
}

export function CheckResult({ summary }: { summary: CheckSummary }) {
  return (
    <div className={`${panel} w-full max-w-lg mt-8 text-left`}>
      <div className={panelBody}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <StatusBadge status={summary.status} />
        </div>
        <p className="font-mono text-sm text-muted-2 break-all mb-1">{summary.domain}</p>
        <h2 className={`${sectionTitle} text-xl sm:text-2xl mb-2`}>{summary.headline}</h2>
        <p className="text-sm text-muted leading-relaxed m-0 mb-4">{summary.detail}</p>

        {(summary.registrationLine || summary.pactHistoryLine) && (
          <dl className="grid grid-cols-1 gap-3 pt-4 border-t border-border m-0 mb-5">
            {summary.registrationLine && (
              <div>
                <dt className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 mb-1">
                  Domain age
                </dt>
                <dd className="m-0 text-sm font-medium text-txt">{summary.registrationLine}</dd>
              </div>
            )}
            {summary.pactHistoryLine && (
              <div>
                <dt className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 mb-1">
                  PACT history
                </dt>
                <dd className="m-0 text-sm font-medium text-txt">{summary.pactHistoryLine}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="flex flex-wrap gap-3">
          {summary.status !== 'none' && (
            <Link href={summary.recordHref} className={btnPrimary}>
              Full record
            </Link>
          )}
          {summary.connectHref && (
            <Link href={summary.connectHref} className={summary.status === 'none' ? btnPrimary : btnGhost}>
              Connect this domain
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
