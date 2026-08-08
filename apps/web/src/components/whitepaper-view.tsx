'use client';

import Link from 'next/link';
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
    <PageShell backHref="/" backLabel={t.common.home} width="narrow">
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

      <p className="mt-12 pt-8 border-t border-border text-sm text-muted">
        {t.whitepaper.ready}{' '}
        <Link
          href="/how-it-works#add-your-domain"
          className="text-accent font-semibold no-underline hover:opacity-90"
        >
          {t.whitepaper.addDomain}
        </Link>
        {' · '}
        <Link href="/domains" className="text-accent font-semibold no-underline hover:opacity-90">
          {t.whitepaper.publicRecords}
        </Link>
      </p>
    </PageShell>
  );
}
