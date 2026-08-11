'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { routes } from '@/lib/routes';
import { eyebrow, pageTitle } from '@/lib/ui';

export function DocsView() {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.home} backLabel={t.common.home}>
      <header className="mb-12">
        <p className={`${eyebrow} mb-3`}>{t.docs.eyebrow}</p>
        <h1 className={`${pageTitle} text-2xl sm:text-3xl`}>{t.docs.title}</h1>
      </header>

      <nav className="space-y-8" aria-label={t.docs.title}>
        <div>
          <Link
            href={routes.docsWhy}
            className="text-lg sm:text-xl font-semibold text-txt no-underline hover:text-accent"
          >
            {t.docs.whyTitle}
          </Link>
        </div>
        <div>
          <Link
            href={routes.docsWhitepaper}
            className="text-lg sm:text-xl font-semibold text-txt no-underline hover:text-accent"
          >
            {t.docs.whitepaperTitle}
          </Link>
        </div>
        <div>
          <Link
            href={routes.docsRoadmap}
            className="text-lg sm:text-xl font-semibold text-txt no-underline hover:text-accent"
          >
            {t.docs.roadmapTitle}
          </Link>
        </div>
      </nav>
    </PageShell>
  );
}
