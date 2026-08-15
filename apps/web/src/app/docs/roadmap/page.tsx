import { RoadmapView } from '@/components/roadmap-view';

export const metadata = {
  title: 'Roadmap — We build real',
  description:
    'What PACT ships today and what’s next — wrapper witness in the leaf, Base Sepolia roots, mainnet next.',
  robots: { index: false, follow: false },
};

export default function DocsRoadmapPage() {
  return <RoadmapView />;
}
