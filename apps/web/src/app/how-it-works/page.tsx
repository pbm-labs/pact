import type { Metadata } from 'next';
import { HowItWorksView } from '@/components/how-it-works-view';
import { loadLiveProof, SAMPLE_PROOF_DOMAIN } from '@/lib/evidence';
import { loadKindCatalog } from '@/lib/kind-catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'How it works — Wake',
  description:
    'Evidence that outlives the vendor. Uncommissioned traces from independent systems — before anyone asked them to look.',
};

export default async function HowItWorksPage() {
  const [kinds, liveProof] = await Promise.all([
    loadKindCatalog(),
    loadLiveProof(SAMPLE_PROOF_DOMAIN),
  ]);
  return <HowItWorksView kinds={kinds} liveProof={liveProof} />;
}
