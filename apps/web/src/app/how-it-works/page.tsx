import type { Metadata } from 'next';
import { HowItWorksView } from '@/components/how-it-works-view';
import { loadLiveProof, SAMPLE_PROOF_DOMAIN } from '@/lib/evidence';
import { loadKindCatalog } from '@/lib/kind-catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'How it works — leftover',
  description:
    'Trust starts with a claim, or with evidence that existed before anyone made one. leftover records the second kind. Not a score.',
};

export default async function HowItWorksPage() {
  const [kinds, liveProof] = await Promise.all([
    loadKindCatalog(),
    loadLiveProof(SAMPLE_PROOF_DOMAIN),
  ]);
  return <HowItWorksView kinds={kinds} liveProof={liveProof} />;
}
