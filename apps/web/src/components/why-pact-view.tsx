'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { WhitepaperBody } from '@/components/whitepaper-body';
import { routes } from '@/lib/routes';
import { eyebrow, pageTitle } from '@/lib/ui';

export function WhyPactView() {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.docs} backLabel={t.docs.title}>
      <header className="mb-10">
        <p className={`${eyebrow} mb-3`}>{t.whyPact.eyebrow}</p>
        <h1 className={`${pageTitle} mb-4`}>{t.whyPact.title}</h1>
        <p className="text-sm text-muted leading-relaxed">{t.whyPact.intro}</p>
      </header>

      <WhitepaperBody markdown={`${t.whyPact.body}\n\n${t.whyPact.scope}`} />

      <p className="mt-12 m-0">
        <Link href={routes.docsWhitepaper} className="text-sm font-semibold text-accent no-underline hover:opacity-90">
          {t.docs.readWhitepaper}
        </Link>
      </p>
    </PageShell>
  );
}
