import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';
import { loadLiveProof, SAMPLE_PROOF_DOMAIN } from '@/lib/evidence';
import { loadKindCatalog } from '@/lib/kind-catalog';

export const dynamic = 'force-dynamic';

const title = 'Wake — evidence that outlives the vendor';
const description =
  'You kept the liability. They kept the evidence. Then they disappeared. Wake holds uncommissioned traces — queryable after the vendor is gone. Not a score.';

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
