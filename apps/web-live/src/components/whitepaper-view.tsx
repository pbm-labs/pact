'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { WhitepaperBody } from '@/components/whitepaper-body';
import { routes } from '@/lib/routes';
import { eyebrow, linkMuted, metaText, pageIntro, pageTitle } from '@/lib/ui';

interface WhitepaperViewProps {
  markdown: string;
  sourceUrl: string;
}

export function WhitepaperView({ markdown, sourceUrl }: WhitepaperViewProps) {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.docs} backLabel={t.docs.title}>
      <header className="mb-10">
        <p className={`${eyebrow} mb-3`}>{t.whitepaper.eyebrow}</p>
        <h1 className={`${pageTitle} mb-4`}>{t.whitepaper.title}</h1>
        <p className={pageIntro}>{t.whitepaper.intro}</p>
        <p className={`mt-4 ${metaText}`}>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkMuted} text-xs font-mono`}
          >
            {t.whitepaper.source}
          </a>
        </p>
      </header>

      <WhitepaperBody markdown={markdown} />

      <p className="mt-12 m-0">
        <Link href={routes.docsRoadmap} className="text-sm font-semibold text-accent no-underline hover:opacity-90">
          {t.docs.readStatus}
        </Link>
      </p>
    </PageShell>
  );
}
