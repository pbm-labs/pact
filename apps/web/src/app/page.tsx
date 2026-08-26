import type { Metadata } from 'next';
import { HomeLanding, type HomePreview } from '@/components/home-landing';
import { fetchDomainSummaries } from '@/lib/domain-data';

export const dynamic = 'force-dynamic';

const title = 'AI can fake everything. Except yesterday.';
const description = 'Leftover traces as separate streams on one tree.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
  },
};

export default async function HomePage() {
  const preview = await loadHomePreview();
  return <HomeLanding preview={preview} />;
}

async function loadHomePreview(): Promise<HomePreview | null> {
  const domains = await fetchDomainSummaries();
  const pick =
    domains.find((d) => d.status === 'live' && d.domain === 'webuildreal.dev') ??
    domains.find((d) => d.status === 'live');
  if (!pick) return null;

  return {
    domain: pick.domain,
    domainRegisteredAt: pick.domainRegisteredAt ?? null,
    pactHistoryStart: pick.connectedAt ?? null,
    mailCount: pick.mailCount ?? 0,
    ctCount: pick.ctCount ?? 0,
    rekorCount: pick.rekorCount ?? 0,
  };
}
