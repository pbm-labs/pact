'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { eyebrow, pageIntro, pageTitle } from '@/lib/ui';

export function DocsView() {
  const { t } = useLocale();

  return (
    <PageShell backHref="/" backLabel={t.common.home}>
      <header className="mb-12">
        <p className={`${eyebrow} mb-3`}>{t.docs.eyebrow}</p>
        <h1 className={`${pageTitle} text-2xl sm:text-3xl mb-4`}>{t.docs.title}</h1>
        <p className={`${pageIntro} max-w-xl`}>{t.docs.intro}</p>
      </header>

      <nav className="space-y-10" aria-label={t.docs.title}>
        <div>
          <Link
            href="/why-pact"
            className="text-lg sm:text-xl font-semibold text-txt no-underline hover:text-accent"
          >
            {t.docs.whyTitle}
          </Link>
          <p className="text-sm text-muted leading-relaxed mt-2 m-0 max-w-xl">{t.docs.whyBody}</p>
        </div>
        <div>
          <Link
            href="/whitepaper"
            className="text-lg sm:text-xl font-semibold text-txt no-underline hover:text-accent"
          >
            {t.docs.whitepaperTitle}
          </Link>
          <p className="text-sm text-muted leading-relaxed mt-2 m-0 max-w-xl">
            {t.docs.whitepaperBody}
          </p>
        </div>
        <div>
          <Link
            href="/roadmap"
            className="text-lg sm:text-xl font-semibold text-txt no-underline hover:text-accent"
          >
            {t.docs.roadmapTitle}
          </Link>
          <p className="text-sm text-muted leading-relaxed mt-2 m-0 max-w-xl">
            {t.docs.roadmapBody}
          </p>
        </div>
      </nav>
    </PageShell>
  );
}
