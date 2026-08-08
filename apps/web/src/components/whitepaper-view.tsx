'use client';

import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { WhitepaperBody } from '@/components/whitepaper-body';
import { eyebrow, linkMuted, pageTitle } from '@/lib/ui';

interface WhitepaperViewProps {
  markdown: string;
  sourceUrl: string;
}

export function WhitepaperView({ markdown, sourceUrl }: WhitepaperViewProps) {
  const { t } = useLocale();

  return (
    <PageShell backHref="/" backLabel={t.common.home}>
      <header className="mb-10">
        <p className={`${eyebrow} mb-3`}>{t.whitepaper.eyebrow}</p>
        <h1 className={`${pageTitle} text-2xl sm:text-3xl mb-4`}>{t.whitepaper.title}</h1>
        <p className="text-sm text-muted leading-relaxed max-w-xl">{t.whitepaper.intro}</p>
        <p className="mt-4 text-xs font-mono text-muted-2">
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
    </PageShell>
  );
}
