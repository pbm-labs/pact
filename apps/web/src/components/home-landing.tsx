'use client';

import { useLocale } from '@/components/locale-provider';
import { container } from '@/lib/ui';

export function HomeLanding() {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <div className={`${container} pt-16 sm:pt-28 pb-20 sm:pb-28`}>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-txt leading-[1.05] m-0">
          {t.home.heroTitle}
          <br />
          <span className="text-brand">{t.home.heroAccent}</span>
        </h1>
        <p className="mt-6 mb-0 text-lg text-muted leading-relaxed max-w-xl">{t.home.lede}</p>
      </div>
    </main>
  );
}
