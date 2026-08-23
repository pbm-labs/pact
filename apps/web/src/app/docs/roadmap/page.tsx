import { RoadmapView } from '@/components/roadmap-view';

export const metadata = {
  title: 'Status — We build real',
  description:
    'What is live — including Certificate Transparency as a second leaf kind — what is waiting on further reports, and what comes later. Roots are on Base Sepolia, outside the operator.',
};

export default function DocsRoadmapPage() {
  return <RoadmapView />;
}
