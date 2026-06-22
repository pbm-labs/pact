import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { DomainList } from '@/components/domain-list';
import { fetchDomainSummaries } from '@/lib/domain-data';
import { btnPrimary, eyebrow, pageIntro, pageTitle } from '@/lib/ui';

export const dynamic = 'force-dynamic';

export default async function DomainsPage() {
  const domains = await fetchDomainSummaries();

  return (
    <PageShell backHref="/" backLabel="Home" width="wide">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className={`${eyebrow} mb-2`}>Public records</p>
          <h1 className={`${pageTitle} mb-2`}>Connected domains</h1>
          <p className={pageIntro}>
            Trust scores from real DMARC aggregate reports. No message content, no inbox access.
          </p>
        </div>
        <Link href="/connect" className={`${btnPrimary} shrink-0 sm:mt-1`}>
          Connect domain
        </Link>
      </header>

      <DomainList domains={domains} />
    </PageShell>
  );
}
