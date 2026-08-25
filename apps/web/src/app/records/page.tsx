import { RecordsView } from '@/components/records-view';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Public records — We build real',
  description: 'Public records — mail reports and certificate logs.',
};

export default async function RecordsPage() {
  const domains = await fetchDomainSummaries();
  return <RecordsView domains={domains} />;
}
