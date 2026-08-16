import { RoadmapView } from '@/components/roadmap-view';

export const metadata = {
  title: 'Status — We build real',
  description:
    'What is live, what is waiting on the first report, and what comes later. Roots are on Base Sepolia; the first publishRoot waits on a live leaf.',
};

export default function DocsRoadmapPage() {
  return <RoadmapView />;
}
