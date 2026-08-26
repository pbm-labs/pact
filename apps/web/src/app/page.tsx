import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';
import { loadKindCatalog } from '@/lib/kind-catalog';

const title = 'Evidence streams';
const description =
  'Independent traces, kept apart. Each stream has its own identity. The catalog grows.';

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
