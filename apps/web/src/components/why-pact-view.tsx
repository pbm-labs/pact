'use client';

import { DocsNextLink } from '@/components/docs-next-link';
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
        <h1 className={`${pageTitle} mb-4`}>{t.whyPact.title}</h1>
        <p className="text-sm text-muted leading-relaxed max-w-xl">{t.whyPact.intro}</p>
      </header>

      <WhitepaperBody markdown={`${WHY_PACT_MARKDOWN}\n\n${t.whyPact.scope}`} />
      <DocsNextLink current="why" />
    </PageShell>
  );
}
