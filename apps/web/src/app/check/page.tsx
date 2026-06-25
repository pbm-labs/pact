import Link from 'next/link';
import { CheckResult } from '@/components/check-result';
import { DomainCheckForm } from '@/components/domain-check-form';
import { PageShell } from '@/components/page-shell';
import { buildCheckSummary } from '@/lib/check-summary';
import { fetchDomainPageState } from '@/lib/domain-data';
import { isPlausibleDomain, normalizeDomainInput } from '@/lib/normalize-domain-input';
import { eyebrow, linkMuted, pageIntro, pageTitle } from '@/lib/ui';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CheckPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const raw = q?.trim() ?? '';
  const domain = raw ? normalizeDomainInput(raw) : '';
  const invalid = domain.length > 0 && !isPlausibleDomain(domain);

  let summary = null;
  if (domain && !invalid) {
    const state = await fetchDomainPageState(domain);
    summary = buildCheckSummary(state, domain);
  }

  return (
    <PageShell backHref="/" backLabel="Home" centered width="narrow">
      <p className={`${eyebrow} mb-2`}>Public lookup</p>
      <h1 className={`${pageTitle} mb-3`}>Check a domain</h1>
      <p className={`${pageIntro} max-w-md mb-8`}>
        See whether a business domain has a public PACT record — verified email history and
        registration age, without inbox access or message content.
      </p>

      <DomainCheckForm initialQuery={raw} />

      {invalid && (
        <p className="text-sm text-rose-500 mt-6 m-0" role="alert">
          Enter a valid domain (e.g. example.com).
        </p>
      )}

      {summary && <CheckResult summary={summary} />}

      <p className="text-xs text-muted-2 mt-10 max-w-md leading-relaxed">
        PACT attests verified email history from DMARC reports — not full vendor vetting or
        document authenticity.{' '}
        <Link href="/how-it-works" className={linkMuted}>
          How it works →
        </Link>
      </p>
    </PageShell>
  );
}
