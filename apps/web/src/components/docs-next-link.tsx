'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';

export type DocsPageId = 'why' | 'whitepaper' | 'roadmap';

const NEXT: Partial<
  Record<DocsPageId, { href: string; titleKey: 'whyTitle' | 'whitepaperTitle' | 'roadmapTitle' }>
> = {
  why: { href: routes.docsWhitepaper, titleKey: 'whitepaperTitle' },
  whitepaper: { href: routes.docsRoadmap, titleKey: 'roadmapTitle' },
};

export function DocsNextLink({ current }: { current: DocsPageId }) {
  const { t } = useLocale();
  const next = NEXT[current];
  if (!next) return null;

  return (
    <p className="mt-12 pt-6 border-t border-border m-0">
      <Link href={next.href} className="text-sm font-semibold text-accent no-underline hover:opacity-90">
        {t.docs.nextLabel}: {t.docs[next.titleKey]} →
      </Link>
    </p>
  );
}
