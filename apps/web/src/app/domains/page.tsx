import Link from 'next/link';
import { DomainRecords } from '@/components/domain-records';
import { PageShell } from '@/components/page-shell';
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
          <h1 className={`${pageTitle} mb-2`}>Domains on PACT</h1>
          <p className={pageIntro}>
            Every connected domain with a public provenance record — ranked by verified email
            history. Look up any domain on{' '}
            <Link href="/check" className="text-txt underline underline-offset-2 decoration-border-h hover:decoration-txt">
              Check
            </Link>
            .
          </p>
        </div>
        <Link href="/how-it-works" className={`${btnPrimary} shrink-0 sm:mt-1`}>
          Connect domain
        </Link>
      </header>

      <DomainRecords domains={domains} />
    </PageShell>
  );
}
