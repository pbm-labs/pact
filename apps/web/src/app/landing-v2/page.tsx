import type { Metadata } from 'next';
import { HomeLandingV2 } from '@/components/home-landing-v2';

export const metadata: Metadata = {
  title: 'Landing v2 — We build real',
  description: 'A public record of mail reports and certificate logs. Not a score.',
  robots: { index: false, follow: false },
};

export default function LandingV2Page() {
  return <HomeLandingV2 />;
}
