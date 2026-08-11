import { ConnectSuccessView } from '@/components/connect-success-view';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Reached after Cloudflare OAuth or manual/tool registration.
export default async function ConnectSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const domain = typeof params.domain === 'string' ? params.domain : '';

  return <ConnectSuccessView domain={domain} />;
}
