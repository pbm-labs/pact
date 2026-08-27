import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';

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

export default function HomePage() {
  return <HomeLanding />;
}
