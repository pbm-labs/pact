import { DocsView } from '@/components/docs-view';

export const metadata = {
  title: 'Docs — We build real',
  description:
    'PACT publishes independently confirmed domain history. Judgement stays outside. How the record works, how to check it, and what it does not claim.',
  robots: { index: false, follow: false },
};

export default function DocsPage() {
  return <DocsView />;
}
