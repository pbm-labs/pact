import { RecordsView } from '@/components/records-view';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export default async function RecordsPage() {
  const domains = await fetchDomainSummaries();
  return <RecordsView domains={domains} />;
}
