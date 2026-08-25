'use client';

import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { WhitepaperBody } from '@/components/whitepaper-body';
import { LOCAL_WHITEPAPER_MARKDOWN } from '@/lib/whitepaper-markdown';
import { routes } from '@/lib/routes';
import { eyebrow, pageTitle } from '@/lib/ui';

export function WhitepaperView() {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.home} backLabel={t.common.home}>
      <header className="mb-10">
        <p className={`${eyebrow} mb-3`}>{t.whitepaper.eyebrow}</p>
        <h1 className={pageTitle}>{t.whitepaper.title}</h1>
      </header>

      <WhitepaperBody markdown={LOCAL_WHITEPAPER_MARKDOWN} />
    </PageShell>
  );
}
