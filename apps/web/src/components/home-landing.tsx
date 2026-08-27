'use client';

import { CtaBlock } from '@/components/cta-block';
import { LiveProof } from '@/components/live-proof';
import { MovementHero } from '@/components/movement-hero';
import { StreamCard } from '@/components/stream-card';
import { useLocale } from '@/components/locale-provider';
import type { LiveProofData } from '@/lib/evidence';
import type { CatalogKind } from '@/lib/kind-catalog';
import { routes } from '@/lib/routes';
import { container, linkMuted } from '@/lib/ui';

export function HomeLanding({
  kinds,
  liveProof,
}: {
  kinds: CatalogKind[];
  liveProof: LiveProofData | null;
}) {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <div className={`${container} pt-16 sm:pt-24 pb-20 sm:pb-28`}>
        <MovementHero />

        <p className="mt-10 mb-0 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
          {t.home.turnLine}
        </p>

        <h2
          id="how-it-works"
          className="mt-16 sm:mt-20 mb-0 text-2xl sm:text-3xl font-bold tracking-tight text-txt scroll-mt-20"
        >
          {t.home.howItWorksHeading}
        </h2>
        <p className="mt-4 mb-0 text-base text-muted leading-relaxed max-w-xl">{t.home.lede}</p>

        <ol className="mt-8 sm:mt-10 m-0 p-0 list-none divide-y divide-border border-y border-border">
          {kinds.map((kind) => (
            <StreamCard key={kind.id} kind={kind} />
          ))}
        </ol>

        {liveProof ? <LiveProof domain={liveProof.domain} results={liveProof.results} /> : null}

        <p className="mt-10 mb-0 text-sm text-muted-2">
          {t.home.agents}{' '}
          <a href={routes.ledgerKinds} className={`${linkMuted} font-mono`}>
            {t.home.catalog}
          </a>
        </p>

        <CtaBlock />
      </div>
    </main>
  );
}
