'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { routes } from '@/lib/routes';
import { eyebrow, listTitle, pageIntro, pageTitle } from '@/lib/ui';

export function DocsView() {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.home} backLabel={t.common.home}>
      <header className="mb-12">
        <p className={`${eyebrow} mb-3`}>{t.docs.eyebrow}</p>
        <h1 className={`${pageTitle} mb-4`}>{t.docs.title}</h1>
        <p className={`${pageIntro} max-w-xl mb-4`}>{t.docs.intro}</p>
        <ul className={`${pageIntro} max-w-xl m-0 pl-5 list-disc space-y-1`}>
          <li>{t.docs.layerMovement}</li>
          <li>{t.docs.layerProtocol}</li>
          <li>{t.docs.layerImpl}</li>
        </ul>
      </header>

      <nav className="space-y-10" aria-label={t.docs.title}>
        <div>
          <Link href={routes.docsWhy} className={listTitle}>
            {t.docs.whyTitle}
          </Link>
          <p className={`${pageIntro} mt-2 m-0 max-w-xl`}>{t.docs.whyBody}</p>
        </div>
        <div>
          <Link href={routes.docsWhitepaper} className={listTitle}>
            {t.docs.whitepaperTitle}
          </Link>
          <p className={`${pageIntro} mt-2 m-0 max-w-xl`}>{t.docs.whitepaperBody}</p>
        </div>
        <div>
          <Link href={routes.docsRoadmap} className={listTitle}>
            {t.docs.roadmapTitle}
          </Link>
          <p className={`${pageIntro} mt-2 m-0 max-w-xl`}>{t.docs.roadmapBody}</p>
        </div>
      </nav>
    </PageShell>
  );
}
