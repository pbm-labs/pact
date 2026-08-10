'use client';

import { useLocale } from '@/components/locale-provider';
import { DocsFooter } from '@/components/docs-footer';
import { PageShell } from '@/components/page-shell';
import { WHY_PACT_PARAGRAPHS } from '@/lib/why-pact';
import { eyebrow, pageTitle } from '@/lib/ui';

function renderInline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="text-txt font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={i}>{token.slice(1, -1)}</em>;
    }
    return <span key={i}>{token}</span>;
  });
}

export function WhyPactView() {
  const { t } = useLocale();

  return (
    <PageShell backHref="/docs" backLabel={t.docs.title}>
      <header className="mb-10">
        <p className={`${eyebrow} mb-3`}>{t.whyPact.eyebrow}</p>
        <h1 className={`${pageTitle} text-2xl sm:text-3xl mb-4`}>{t.whyPact.title}</h1>
        <p className="text-sm text-muted leading-relaxed max-w-xl">{t.whyPact.intro}</p>
      </header>

      <article className="text-[15px] sm:text-base text-muted leading-[1.8] space-y-4">
        {WHY_PACT_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="m-0">
            {renderInline(paragraph)}
          </p>
        ))}
        <p className="m-0 pt-2 text-sm text-muted-2 leading-relaxed">{t.whyPact.scope}</p>
      </article>

      <DocsFooter href="/whitepaper" label={t.whyPact.whitepaperLink} />
    </PageShell>
  );
}
