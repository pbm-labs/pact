'use client';

import Link from 'next/link';
import { DomainRecords } from '@/components/domain-records';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import type { DomainSummary } from '@/lib/domain-data';
import { routes } from '@/lib/routes';
import { btnPrimary, pageTitle, statCard, statLabel, statValue } from '@/lib/ui';

interface RecordsViewProps {
  domains: DomainSummary[];
  building: number;
  proven: number;
}

export function RecordsView({ domains, building, proven }: RecordsViewProps) {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.home} backLabel={t.records.backHome}>
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className={pageTitle}>{t.records.title}</h1>
        </div>
        <Link href={routes.connect} className={`${btnPrimary} shrink-0 sm:mt-1`}>
          {t.records.addDomain}
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
        <div className={statCard}>
          <p className={`${statValue} text-amber`}>{building}</p>
          <p className={statLabel}>{t.records.building}</p>
        </div>
        <div className={statCard}>
          <p className={`${statValue} text-verified`}>{proven}</p>
          <p className={statLabel}>{t.records.proven}</p>
        </div>
      </div>

      <DomainRecords domains={domains} />
    </PageShell>
  );
}
