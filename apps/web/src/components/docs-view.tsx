'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { PROTOCOL_SPEC_URL, routes } from '@/lib/routes';
import { pageIntro, pageTitle, sectionTitle } from '@/lib/ui';

const docLink = `${sectionTitle} no-underline hover:text-accent`;

export function DocsView() {
  const { t } = useLocale();

  const documents: { href: string; title: string; external?: boolean }[] = [
    { href: routes.docsWhy, title: t.docs.whyTitle },
    { href: routes.docsWhitepaper, title: t.docs.whitepaperTitle },
    { href: PROTOCOL_SPEC_URL, title: t.docs.protocolTitle, external: true },
    { href: routes.docsRoadmap, title: t.docs.statusTitle },
  ];

  return (
    <PageShell>
      <header className="mb-12">
        <h1 className={`${pageTitle} mb-4`}>{t.docs.title}</h1>
        <p className={`${pageIntro} max-w-xl m-0`}>{t.docs.intro}</p>
      </header>

      <div className="space-y-10">
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

      <nav className="mt-14 pt-8 border-t border-border flex flex-col gap-3" aria-label={t.docs.title}>
        {documents.map((doc) =>
          doc.external ? (
            <a
              key={doc.href}
              href={doc.href}
              className={docLink}
              target="_blank"
              rel="noreferrer"
            >
              {doc.title} ↗
            </a>
          ) : (
            <Link key={doc.href} href={doc.href} className={docLink}>
              {doc.title}
            </Link>
          ),
        )}
      </nav>
    </PageShell>
  );
}
