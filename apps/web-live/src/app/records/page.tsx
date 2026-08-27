import { RecordsView } from '@/components/records-view';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Public records — We build real',
  description:
    'Independently confirmed domain history anyone can recheck. Ranked by how long each domain has been reported.',
};

export default async function RecordsPage() {
  const domains = await fetchDomainSummaries();
  return <RecordsView domains={domains} />;
}
