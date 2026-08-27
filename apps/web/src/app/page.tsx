import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';
import { loadLiveProof, SAMPLE_PROOF_DOMAIN } from '@/lib/evidence';
import { loadKindCatalog } from '@/lib/kind-catalog';

export const dynamic = 'force-dynamic';

const title = "It still can't fake yesterday.";
const description =
  'AI can fake a face, a voice, a résumé, a company that\'s "been around" for ten years. It still can\'t fake yesterday.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
  },
};

export default async function HomePage() {
  const [kinds, liveProof] = await Promise.all([
    loadKindCatalog(),
    loadLiveProof(SAMPLE_PROOF_DOMAIN),
  ]);
  return <HomeLanding kinds={kinds} liveProof={liveProof} />;
}
