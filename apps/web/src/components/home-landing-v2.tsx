'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { btnPrimary, pageIntro } from '@/lib/ui';

export function HomeLandingV2() {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1 flex flex-col" key={locale}>
      <section className="flex-1 flex items-center">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-txt leading-[1.1] mb-5">
            {t.home.heroTitle}
            <br />
            <span className="text-accent">{t.home.heroAccent}</span>
          </h1>
          <p className={`${pageIntro} max-w-md mx-auto mb-10`}>{t.home.heroSubV2}</p>
          <Link href={routes.connect} className={btnPrimary}>
            {t.home.ctaButtonV2}
          </Link>
        </div>
      </section>
    </main>
  );
}
