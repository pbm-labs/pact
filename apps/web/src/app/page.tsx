import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';
import { loadKindCatalog } from '@/lib/kind-catalog';

export const dynamic = 'force-dynamic';

const title = 'leftover — uncommissioned evidence';
const description =
  'A query, not a claim. Independent traces anyone can recheck against a named root — including after we are gone. Judgement stays outside.';

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
