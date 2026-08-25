import { RecordsView } from '@/components/records-view';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Records — We build real',
  description: 'Mail reports and certificate logs.',
};

export default async function RecordsPage() {
  const domains = await fetchDomainSummaries();
  return <RecordsView domains={domains} />;
}
