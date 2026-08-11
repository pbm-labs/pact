'use client';

import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { WhitepaperBody } from '@/components/whitepaper-body';
import { WHY_PACT_MARKDOWN } from '@/lib/why-pact';
import { routes } from '@/lib/routes';
import { eyebrow, pageTitle } from '@/lib/ui';

export function WhyPactView() {
  const { t } = useLocale();

  return (
    <PageShell backHref={routes.docs} backLabel={t.docs.title}>
      <header className="mb-10">
        <p className={`${eyebrow} mb-3`}>{t.whyPact.eyebrow}</p>
        <h1 className={`${pageTitle} text-2xl sm:text-3xl mb-4`}>{t.whyPact.title}</h1>
      </header>

      <WhitepaperBody markdown={`${WHY_PACT_MARKDOWN}\n\n${t.whyPact.scope}`} />
    </PageShell>
  );
}
