import { DocsView } from '@/components/docs-view';

export const metadata = {
  title: 'Docs — We build real',
  description:
    'How the public record works — what it lists, how a domain gets one, how anyone checks, and what it does not claim.',
  robots: { index: false, follow: false },
};

export default function DocsPage() {
  return <DocsView />;
}
