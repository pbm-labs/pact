import type { Metadata } from 'next';
import { estimateScoreProgress, formatScoreForDisplay } from '@pact/core';
import { DomainPageView, type DomainLiveScoreView } from '@/components/domain-page-view';
import { fetchDomainPageState, ledgerConfigured } from '@/lib/domain-data';
import { routes } from '@/lib/routes';
import { scoreBandKey, shouldShowTrustScore } from '@/lib/trust-display';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string }>;
}

const siteUrl = 'https://webuildreal.dev';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain: raw } = await params;
  const domain = decodeURIComponent(raw).toLowerCase().trim();
  const title = `${domain} — public record`;
  const description =
    'Independently confirmed history anyone can recheck. Impossible to backdate.';
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

export default async function RecordPage({ params }: PageProps) {
  const { domain } = await params;
  const state = await fetchDomainPageState(domain);

  const hasLedger = ledgerConfigured();

  let liveScore: DomainLiveScoreView | null = null;
  if (state?.status === 'live') {
    const { trust } = state.data;
    const display = formatScoreForDisplay(trust.score);
    const progress = estimateScoreProgress({
      rawScore: trust.score,
      volume: trust.volume,
      diversity: trust.diversity,
      pactAgeDays: trust.pactAgeDays,
    });
    liveScore = {
      rawScore: display.rawScore,
      displayScore: display.displayScore,
      bandKey: scoreBandKey(trust.score, display.band),
      showScore: shouldShowTrustScore(trust),
      progress,
      verifiedDays: Math.floor(trust.pactAgeDays),
    };
  }

  return (
    <DomainPageView
      domain={domain}
      state={state}
      liveScore={liveScore}
      unconfigured={!state && !hasLedger}
    />
  );
}
