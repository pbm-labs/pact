'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { btnPrimary, container } from '@/lib/ui';

export function HomeLanding() {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <div className={`${container} pt-16 sm:pt-28 pb-20 sm:pb-28`}>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-txt leading-[1.12] m-0">
          {t.home.heroLine1}
        </h1>
        <p className="mt-6 mb-0 text-3xl sm:text-5xl font-bold tracking-tight leading-[1.12] text-brand">
          {t.home.heroLine2}
        </p>
        <p className="mt-8 mb-0 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
          {t.home.turnLine}
        </p>
        <div className="mt-10">
          <Link href={routes.howItWorks} className={btnPrimary}>
            {t.home.seeHowItWorks}
          </Link>
        </div>
      </div>
    </main>
  );
}
