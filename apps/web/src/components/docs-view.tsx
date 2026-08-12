'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { routes } from '@/lib/routes';
import { eyebrow, pageIntro, pageTitle, pathCard } from '@/lib/ui';

function DocsChevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-muted-2 group-hover:text-accent transition-colors"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function DocsView() {
  const { t } = useLocale();

  const items = [
    {
      href: routes.docsWhy,
      title: t.docs.whyTitle,
      body: t.docs.whyBody,
    },
    {
      href: routes.docsWhitepaper,
      title: t.docs.whitepaperTitle,
      body: t.docs.whitepaperBody,
    },
    {
      href: routes.docsRoadmap,
      title: t.docs.roadmapTitle,
      body: t.docs.roadmapBody,
    },
  ] as const;

  return (
    <PageShell backHref={routes.home} backLabel={t.common.home}>
      <header className="mb-10">
        <p className={`${eyebrow} mb-3`}>{t.docs.eyebrow}</p>
        <h1 className={`${pageTitle} mb-4`}>{t.docs.title}</h1>
        <p className={`${pageIntro} max-w-xl`}>{t.docs.intro}</p>
      </header>

      <nav className="grid gap-3" aria-label={t.docs.title}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${pathCard} no-underline active:bg-bg/60 sm:hover:bg-bg/40`}
          >
            <span className="flex w-full items-start justify-between gap-3">
              <span className="min-w-0 flex flex-col gap-1.5">
                <span className="text-base font-semibold text-txt group-hover:text-accent transition-colors">
                  {item.title}
                </span>
                <span className="text-sm text-muted leading-snug">{item.body}</span>
              </span>
              <DocsChevron />
            </span>
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}
