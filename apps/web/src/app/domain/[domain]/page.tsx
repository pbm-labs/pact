import { estimateScoreProgress, formatScoreForDisplay } from '@pact/core';
import { DomainPageView, type DomainLiveScoreView } from '@/components/domain-page-view';
import { fetchDomainPageState } from '@/lib/domain-data';
import {
  formatScoreProgressHint,
  formatVerifiedDays,
  shouldShowTrustScore,
} from '@/lib/trust-display';

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
      display,
      showScore: shouldShowTrustScore(trust),
      progressHint: formatScoreProgressHint(progress, trust.score),
      verifiedLabel: formatVerifiedDays(trust.pactAgeDays),
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
