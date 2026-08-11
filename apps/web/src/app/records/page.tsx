import { RecordsView } from '@/components/records-view';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export default async function RecordsPage() {
  const domains = await fetchDomainSummaries();
  const proven = domains.filter((d) => d.trustStatus === 'activated').length;
  const building = domains.filter(
    (d) => d.status === 'live' && d.trustStatus !== 'activated',
  ).length;

  return <RecordsView domains={domains} building={building} proven={proven} />;
}
