'use client';

import Link from 'next/link';
import { DomainRecords } from '@/components/domain-records';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import type { DomainSummary } from '@/lib/domain-data';
import { btnPrimary, eyebrow, pageIntro, pageTitle, statCard, statLabel, statValue } from '@/lib/ui';

interface DomainsViewProps {
  domains: DomainSummary[];
  building: number;
  proven: number;
}

export function DomainsView({ domains, building, proven }: DomainsViewProps) {
  const { t } = useLocale();

  return (
    <PageShell backHref="/" backLabel={t.domains.backHome} width="wide">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className={`${eyebrow} mb-2`}>{t.domains.eyebrow}</p>
          <h1 className={`${pageTitle} mb-2`}>{t.domains.title}</h1>
          <p className={pageIntro}>{t.domains.intro}</p>
        </div>
        <Link href="/how-it-works" className={`${btnPrimary} shrink-0 sm:mt-1`}>
          {t.domains.addDomain}
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
        <div className={statCard}>
          <p className={`${statValue} text-amber`}>{building}</p>
          <p className={statLabel}>{t.domains.building}</p>
        </div>
        <div className={statCard}>
          <p className={`${statValue} text-verified`}>{proven}</p>
          <p className={statLabel}>{t.domains.proven}</p>
        </div>
      </div>

      <DomainRecords domains={domains} />
    </PageShell>
  );
}
