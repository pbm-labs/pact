import { WhyPactView } from '@/components/why-pact-view';

export const metadata = {
  title: 'What Makes PACT Different — We build real',
  description:
    'Why PACT is evidence you can recheck — not another authority claim — and why that history cannot be manufactured after the fact.',
  robots: { index: false, follow: false },
};

export default function DocsWhyPage() {
  return <WhyPactView />;
}
