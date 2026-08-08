import Link from 'next/link';
import { DomainRecords } from '@/components/domain-records';
import { PageShell } from '@/components/page-shell';
import { fetchDomainSummaries } from '@/lib/domain-data';
import { btnPrimary, eyebrow, pageIntro, pageTitle, statCard, statLabel, statValue } from '@/lib/ui';

export const dynamic = 'force-dynamic';

export default async function DomainsPage() {
  const domains = await fetchDomainSummaries();
  const proven = domains.filter((d) => d.trustStatus === 'activated').length;
  const building = domains.filter(
    (d) => d.status === 'live' && d.trustStatus !== 'activated',
  ).length;

  return (
    <PageShell backHref="/" backLabel="Home" width="wide">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className={`${eyebrow} mb-2`}>Public records</p>
          <h1 className={`${pageTitle} mb-2`}>Domains building trust</h1>
          <p className={pageIntro}>
            Ranked by verified history — how long each domain has been independently confirmed.
            Trust scores appear once that history is meaningful.
          </p>
        </div>
        <Link href="/how-it-works" className={`${btnPrimary} shrink-0 sm:mt-1`}>
          Add your domain
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
        <div className={statCard}>
          <p className={`${statValue}${building > 0 ? ' text-amber' : ''}`}>{building}</p>
          <p className={statLabel}>Building</p>
        </div>
        <div className={statCard}>
          <p className={`${statValue}${proven > 0 ? ' text-verified' : ''}`}>{proven}</p>
          <p className={statLabel}>Proven</p>
        </div>
      </div>

      <DomainRecords domains={domains} />
    </PageShell>
  );
}
