import { ConnectSuccessView } from '@/components/connect-success-view';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Reached only after a real Cloudflare connection: OAuth proved DNS control,
// so this domain was actually registered. The manual / tool paths skip
// this page entirely — they go straight to the domain's own page, since
// there's nothing to confirm until a real report arrives.
export default async function ConnectSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const domain = typeof params.domain === 'string' ? params.domain : '';

  return <ConnectSuccessView domain={domain} />;
}
