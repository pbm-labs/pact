'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { btnPrimary, btnSecondary } from '@/lib/ui';

export function MovementHero() {
  const { t } = useLocale();

  return (
    <header>
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-txt leading-[1.12] m-0">
        {t.home.heroLine1}
      </h1>
      <p className="mt-6 mb-0 text-3xl sm:text-5xl font-bold tracking-tight leading-[1.12] text-brand">
        {t.home.heroLine2}
      </p>
      <p className="mt-6 mb-0 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
        {t.home.heroSubline}
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Link href={routes.connect} className={btnPrimary}>
          {t.home.ctaButton}
        </Link>
        <a href="#how-it-works" className={btnSecondary}>
          {t.home.howItWorksHeading}
        </a>
      </div>
    </header>
  );
}
