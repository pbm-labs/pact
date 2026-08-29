import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';
import { loadKindCatalog } from '@/lib/kind-catalog';

export const dynamic = 'force-dynamic';

const title = 'leftover — uncommissioned evidence';
const description =
  'Trust starts with a claim someone issued — or with evidence nobody asked for. leftover is uncommissioned traces. A query, not a score.';

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
