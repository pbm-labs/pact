import { DomainPageView } from '@/components/domain-page-view';
import { fetchDomainPageState } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string }>;
}

export default async function DomainPage({ params }: PageProps) {
  const { domain } = await params;
  const state = await fetchDomainPageState(domain);

  const hasSupabase =
    process.env.SUPABASE_URL &&
    (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <DomainPageView
      domain={domain}
      state={state}
      unconfigured={!state && !hasSupabase}
    />
  );
}
