import { DocsView } from '@/components/docs-view';

export const metadata = {
  title: 'Docs — We build real',
  description: 'How PACT works and why it’s different — brief note, whitepaper, spec, and roadmap.',
  robots: { index: false, follow: false },
};

export default function DocsPage() {
  return <DocsView />;
}
