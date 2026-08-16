'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { PROTOCOL_SPEC_URL, routes } from '@/lib/routes';
import { eyebrow, listTitle, pageIntro, pageTitle, sectionTitle } from '@/lib/ui';

export function DocsView() {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.home} backLabel={t.common.home}>
      <header className="mb-12">
        <p className={`${eyebrow} mb-3`}>{t.docs.eyebrow}</p>
        <h1 className={`${pageTitle} mb-4`}>{t.docs.title}</h1>
        <p className={`${pageIntro} max-w-xl`}>{t.docs.intro}</p>
      </header>

      <nav className="space-y-8 mb-14" aria-label={t.docs.furtherTitle}>
        <p className={`${eyebrow} m-0`}>{t.docs.furtherTitle}</p>
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
          <a
            href={PROTOCOL_SPEC_URL}
            className={listTitle}
            target="_blank"
            rel="noreferrer"
          >
            {t.docs.protocolTitle}
          </a>
          <p className={`${pageIntro} mt-2 m-0 max-w-xl`}>{t.docs.protocolBody}</p>
        </div>
        <div>
          <Link href={routes.docsRoadmap} className={listTitle}>
            {t.docs.statusTitle}
          </Link>
          <p className={`${pageIntro} mt-2 m-0 max-w-xl`}>{t.docs.statusBody}</p>
        </div>
      </nav>

      <div className="space-y-10 pt-10 border-t border-border">
        {t.docs.sections.map((section) => (
          <section key={section.title}>
            <h2 className={`${sectionTitle} m-0 mb-3`}>{section.title}</h2>
            {section.body.split('\n\n').map((paragraph, i) => (
              <p key={i} className={`${pageIntro} max-w-xl mb-3 last:mb-0`}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section>
          <h2 className={`${sectionTitle} m-0 mb-3`}>{t.docs.limitsTitle}</h2>
          <ul className="m-0 pl-5 list-disc space-y-2 text-sm text-muted leading-relaxed max-w-xl">
            {t.docs.limits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
