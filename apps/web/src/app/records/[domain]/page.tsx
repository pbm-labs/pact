import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { normalizeDomain } from '@pact/core';
import { RecordsView } from '@/components/records-view';
import { fetchEvidence } from '@/lib/evidence';
import { loadKindCatalog } from '@/lib/kind-catalog';

interface PageProps {
  params: Promise<{ domain: string }>;
}

function parseRecordDomain(raw: string): string | null {
  const decoded = decodeURIComponent(raw).trim().toLowerCase();
  if (!decoded || decoded.includes('/') || decoded.includes(' ')) return null;
  const domain = normalizeDomain(decoded);
  if (!domain || !domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return null;
  }
  return domain;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain: raw } = await params;
  const domain = parseRecordDomain(raw);
  if (!domain) return { title: 'Record — We build real' };
  return {
    title: `${domain} — We build real`,
    description: `Leftover streams for ${domain}. Kind plus identity. Judgement stays outside.`,
  };
}

export default async function RecordPage({ params }: PageProps) {
  const { domain: raw } = await params;
  const domain = parseRecordDomain(raw);
  if (!domain) notFound();

  const kinds = await loadKindCatalog();
  const results = (
    await Promise.all(kinds.map((kind) => fetchEvidence(kind.id, domain)))
  ).filter((row): row is NonNullable<typeof row> => row !== null);

  return <RecordsView domain={domain} kinds={kinds} results={results} />;
}
