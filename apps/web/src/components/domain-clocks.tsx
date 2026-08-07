'use client';

import { formatDomainRegisteredAt, formatPactHistoryStart } from '@/lib/format-time';

interface DomainClocksProps {
  domainRegisteredAt: string | null;
  pactHistoryStart: string | null;
}

export function DomainClocks({ domainRegisteredAt, pactHistoryStart }: DomainClocksProps) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-6 pt-6 border-t border-border">
      <div>
        <dt className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 mb-1.5">
          Domain registered
        </dt>
        <dd className="m-0 text-base sm:text-lg font-semibold font-mono text-txt tabular-nums">
          {formatDomainRegisteredAt(domainRegisteredAt)}
        </dd>
      </div>
      <div>
        <dt className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 mb-1.5">
          Verified since
        </dt>
        <dd className="m-0 text-base sm:text-lg font-semibold font-mono text-txt tabular-nums">
          {pactHistoryStart ? formatPactHistoryStart(pactHistoryStart) : 'Awaiting first report'}
        </dd>
      </div>
    </dl>
  );
}
