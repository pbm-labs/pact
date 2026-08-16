import { WhyPactView } from '@/components/why-pact-view';

export const metadata = {
  title: 'Evidence, not authority — We build real',
  description:
    'Why PACT publishes what happened instead of asking you to trust a claim — and why that history cannot be manufactured after the fact.',
  robots: { index: false, follow: false },
};

export default function DocsWhyPage() {
  return <WhyPactView />;
}
