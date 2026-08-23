import { WhitepaperView } from '@/components/whitepaper-view';
import { WHITEOBER_SOURCE_URL, loadWhitepaperMarkdown } from '@/lib/whitepaper';

export const metadata = {
  title: 'Whitepaper — We build real',
  description:
    'PACT Protocol: leftover traces as separate kinds — mail reports and certificate logs — on an open provenance layer. Not a blended score.',
};

export default async function DocsWhitepaperPage() {
  const { markdown } = await loadWhitepaperMarkdown();

  return <WhitepaperView markdown={markdown} sourceUrl={WHITEOBER_SOURCE_URL} />;
}
