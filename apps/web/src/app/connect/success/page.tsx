import { redirect } from 'next/navigation';
import { connectDonePath, routes } from '@/lib/routes';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Old connect-success links land on mail intake, not a domain profile. */
export default async function ConnectSuccessRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const domain = typeof params.domain === 'string' ? params.domain : '';
  redirect(domain ? connectDonePath(domain) : routes.connect);
}
