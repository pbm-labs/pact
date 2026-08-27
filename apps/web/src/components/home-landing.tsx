'use client';

import Link from 'next/link';
import { EvidenceQuery } from '@/components/evidence-query';
import { useLocale } from '@/components/locale-provider';
import type { CatalogKind } from '@/lib/kind-catalog';
import { routes } from '@/lib/routes';
import { btnSecondary, container, linkMuted } from '@/lib/ui';

export function HomeLanding({ kinds }: { kinds: CatalogKind[] }) {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <div className={`${container} pt-16 sm:pt-24 pb-20 sm:pb-28`}>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-txt leading-[1.12] m-0">
          {t.home.heroLine1}
        </h1>
        <p className="mt-6 mb-0 text-3xl sm:text-5xl font-bold tracking-tight leading-[1.12] text-brand">
          {t.home.heroLine2}
        </p>
        <p className="mt-8 mb-0 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
          {t.home.turnLine}
        </p>

        <EvidenceQuery kinds={kinds} />

        <p className="mt-10 mb-0">
          <Link href={routes.howItWorks} className={btnSecondary}>
            {t.home.seeHowItWorks}
          </Link>
        </p>
        <p className="mt-8 mb-0 text-sm text-muted-2">
          {t.home.agents}{' '}
          <a href={routes.ledgerKinds} className={`${linkMuted} font-mono`}>
            {t.home.catalog}
          </a>
        </p>
      </div>
    </main>
  );
}
