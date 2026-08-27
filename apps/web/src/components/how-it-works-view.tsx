'use client';

import { LiveProof } from '@/components/live-proof';
import { StreamCard } from '@/components/stream-card';
import { useLocale } from '@/components/locale-provider';
import type { LiveProofData } from '@/lib/evidence';
import type { CatalogKind } from '@/lib/kind-catalog';
import { routes } from '@/lib/routes';
import { container, linkMuted, pageTitle } from '@/lib/ui';

export function HowItWorksView({
  kinds,
  liveProof,
}: {
  kinds: CatalogKind[];
  liveProof: LiveProofData | null;
}) {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <div className={`${container} pt-16 sm:pt-20 pb-20 sm:pb-28`}>
        <h1 className={`${pageTitle} m-0`}>{t.home.howItWorksHeading}</h1>
        <p className="mt-4 mb-0 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
          {t.home.lede}
        </p>

        <section className="mt-12 sm:mt-14">
          <h2 className="m-0 text-xl font-semibold tracking-tight text-txt">
            {t.home.outlivesHeading}
          </h2>
          <p className="mt-3 mb-0 text-sm sm:text-base text-muted leading-relaxed max-w-xl">
            {t.home.outlivesBody}
          </p>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className="m-0 text-xl font-semibold tracking-tight text-txt">
            {t.home.governedHeading}
          </h2>
          <p className="mt-3 mb-0 text-sm sm:text-base text-muted leading-relaxed max-w-xl">
            {t.home.governedBody}
          </p>
        </section>

        <ol className="mt-12 sm:mt-16 m-0 p-0 list-none divide-y divide-border border-y border-border">
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
      </div>
    </main>
  );
}
