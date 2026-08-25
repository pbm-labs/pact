'use client';

import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { WhitepaperBody } from '@/components/whitepaper-body';
import { getWhitepaper } from '@/lib/i18n/whitepapers';
import { routes } from '@/lib/routes';
import { bodyText, eyebrow, pageTitle } from '@/lib/ui';

export function WhitepaperView() {
  const { t, locale } = useLocale();

  return (
    <PageShell backHref={routes.home} backLabel={t.common.home}>
      <header className="mb-10">
        <p className={`${eyebrow} mb-3`}>{t.whitepaper.eyebrow}</p>
        <h1 className={`${pageTitle} mb-3`}>{t.whitepaper.title}</h1>
        <p className={`${bodyText} mb-2`}>{t.whitepaper.subtitle}</p>
        <p className="text-xs font-mono text-muted-2 m-0">{t.whitepaper.updated}</p>
      </header>

      <WhitepaperBody key={locale} markdown={getWhitepaper(locale)} />
    </PageShell>
  );
}
