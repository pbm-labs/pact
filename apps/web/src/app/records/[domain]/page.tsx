import { normalizeDomain } from '@pact/core';
import type { Metadata } from 'next';
import { DomainPageView } from '@/components/domain-page-view';
import { fetchDomainPageState, ledgerConfigured } from '@/lib/domain-data';
import { routes } from '@/lib/routes';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string }>;
}

const siteUrl = 'https://webuildreal.dev';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain: raw } = await params;
  const domain = normalizeDomain(decodeURIComponent(raw));
  const title = `${domain} — record`;
  const description = 'Leftover streams as separate kinds on one tree.';
  const url = `${siteUrl}${routes.record(domain)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'we build real',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function RecordPage({ params }: PageProps): Promise<React.ReactElement> {
  const { domain } = await params;
  const state = await fetchDomainPageState(domain);
  const hasLedger = ledgerConfigured();

  return (
    <DomainPageView domain={domain} state={state} unconfigured={!state && !hasLedger} />
  );
}
