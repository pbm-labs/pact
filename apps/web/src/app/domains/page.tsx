import { DomainsView } from '@/components/domains-view';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export default async function DomainsPage() {
  const domains = await fetchDomainSummaries();
  const proven = domains.filter((d) => d.trustStatus === 'activated').length;
  const building = domains.filter(
    (d) => d.status === 'live' && d.trustStatus !== 'activated',
  ).length;

  return <DomainsView domains={domains} building={building} proven={proven} />;
}
