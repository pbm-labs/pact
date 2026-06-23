import { fetchJoinedCount } from '@/lib/domain-data';
import { MovementHeaderBar } from '@/components/movement-header-bar';

export async function MovementHeader() {
  const joined = await fetchJoinedCount();
  return <MovementHeaderBar joined={joined} />;
}
