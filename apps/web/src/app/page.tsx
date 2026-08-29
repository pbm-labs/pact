import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';
import { loadKindCatalog } from '@/lib/kind-catalog';

export const dynamic = 'force-dynamic';

const title = 'Wake — evidence that outlives the vendor';
const description =
  'You kept the liability. They kept the evidence. Wake holds uncommissioned traces — queryable after the vendor is gone. Not a score.';

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
  const kinds = await loadKindCatalog();
  return <HomeLanding kinds={kinds} />;
}
