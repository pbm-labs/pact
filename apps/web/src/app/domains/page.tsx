import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { DomainList } from '@/components/domain-list';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export default async function DomainsPage() {
  const domains = await fetchDomainSummaries();

  return (
    <PageShell backHref="/" backLabel="Home">
      <p className="eyebrow">Live records</p>
      <h1>Connected domains</h1>
      <p className="hero-lead">
        Public provenance pages for domains registered with PACT. Trust scores are computed from
        real DMARC aggregate reports — no message content, no inbox access.
      </p>

      <p className="bridge-actions bridge-actions-row">
        <Link href="/connect" className="button-primary">
          Connect a domain
        </Link>
        <Link href="/disconnect" className="text-link">
          Disconnect a domain →
        </Link>
      </p>

      <section className="section">
        <DomainList domains={domains} />
      </section>
    </PageShell>
  );
}
