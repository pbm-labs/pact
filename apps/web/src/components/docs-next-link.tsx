'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';

export type DocsPageId = 'why' | 'whitepaper' | 'roadmap';

const SEQUENCE: readonly DocsPageId[] = ['why', 'whitepaper', 'roadmap'];

export function DocsNextLink({ current }: { current: DocsPageId }) {
  const { t } = useLocale();
  const index = SEQUENCE.indexOf(current);
  const nextId = SEQUENCE[(index + 1) % SEQUENCE.length]!;

  const href =
    nextId === 'why'
      ? routes.docsWhy
      : nextId === 'whitepaper'
        ? routes.docsWhitepaper
        : routes.docsRoadmap;

  const title =
    nextId === 'why'
      ? t.docs.whyTitle
      : nextId === 'whitepaper'
        ? t.docs.whitepaperTitle
        : t.docs.roadmapTitle;

  return (
    <nav
      className="mt-14 pt-8 border-t border-border"
      aria-label={t.docs.nextLabel}
    >
      <Link
        href={href}
        className="group flex items-center justify-between gap-4 no-underline rounded-lg border border-border bg-surface px-4 py-4 hover:border-muted-2 active:bg-bg/60"
      >
        <span className="min-w-0 flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-2">
            {t.docs.nextLabel}
          </span>
          <span className="text-base font-semibold text-txt group-hover:text-accent transition-colors">
            {title}
          </span>
        </span>
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
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </Link>
    </nav>
  );
}
