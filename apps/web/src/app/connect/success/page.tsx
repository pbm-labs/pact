import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Old connect-success links land on the domain record. */
export default async function ConnectSuccessRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const domain = typeof params.domain === 'string' ? params.domain : '';
  redirect(domain ? routes.record(domain) : routes.records);
}
