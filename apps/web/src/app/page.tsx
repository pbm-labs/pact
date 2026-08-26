import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home-landing';

const title = 'AI can fake everything. Except yesterday.';
const description =
  'we build real is a movement for verifiable history. PACT is leftover traces for agents — kind plus identity, not a domain profile.';

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
