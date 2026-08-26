import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';

const title = 'AI can fake everything. Except yesterday.';
const description =
  'Leftover traces for agents. Kind plus identity. Judgement stays outside.';

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
