import { estimateScoreProgress, formatScoreForDisplay } from '@pact/core';
import { DomainPageView, type DomainLiveScoreView } from '@/components/domain-page-view';
import { fetchDomainPageState } from '@/lib/domain-data';
import { scoreBandKey, shouldShowTrustScore } from '@/lib/trust-display';

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
      unconfigured={!state && !hasSupabase}
    />
  );
}
