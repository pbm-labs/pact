import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';

const title = 'AI can fake everything. Except yesterday.';
const description =
  'PACT records leftover traces for agents. Kind plus identity. It does not decide.';

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
