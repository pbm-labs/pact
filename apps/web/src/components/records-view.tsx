'use client';

import Link from 'next/link';
import { DomainRecords } from '@/components/domain-records';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import type { DomainSummary } from '@/lib/domain-data';
import { routes } from '@/lib/routes';
import { btnPrimary, pageTitle } from '@/lib/ui';

interface RecordsViewProps {
  domains: DomainSummary[];
}

export function RecordsView({ domains }: RecordsViewProps) {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.home} backLabel={t.records.backHome}>
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <h1 className={pageTitle}>{t.records.title}</h1>
        <Link href={routes.connect} className={`${btnPrimary} shrink-0 sm:mt-1`}>
          {t.records.addDomain}
        </Link>
      </header>

      <DomainRecords domains={domains} />
    </PageShell>
  );
}
