import { RecordsView } from '@/components/records-view';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Public records — We build real',
  description:
    'Independently confirmed mail history, ranked. Certificate first-seen dates live on each domain page — a separate kind, not a blended score.',
};

export default async function RecordsPage() {
  const domains = await fetchDomainSummaries();
  return <RecordsView domains={domains} />;
}
