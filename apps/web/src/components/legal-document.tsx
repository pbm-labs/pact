'use client';

import type { ReactNode } from 'react';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { LEGAL_ENTITY } from '@/lib/legal';
import { routes } from '@/lib/routes';
import { eyebrow, pageTitle } from '@/lib/ui';

export function LegalDocument({
  kind,
  children,
}: {
  kind: 'terms' | 'privacy';
  children?: ReactNode;
}) {
  const { t } = useLocale();
  const title = kind === 'terms' ? t.legal.termsTitle : t.legal.privacyTitle;
  const sections = kind === 'terms' ? t.legal.terms : t.legal.privacy;

  return (
    <PageShell backHref={routes.home} backLabel={t.common.home}>
      <div className="max-w-2xl">
        <header className="mb-10">
          <p className={`${eyebrow} mb-3`}>{t.legal.eyebrow}</p>
          <h1 className={`${pageTitle} mb-3`}>{title}</h1>
          <p className="text-xs font-mono text-muted-2 m-0">{t.legal.lastUpdated}</p>
        </header>

        <section className="mb-10 text-sm text-muted leading-relaxed">
          <h2 className="text-base font-semibold text-txt m-0 mb-3">{LEGAL_ENTITY.name}</h2>
          <p className="m-0">
            {LEGAL_ENTITY.address.line}
            <br />
            {LEGAL_ENTITY.address.cityStateZip}
            <br />
            {LEGAL_ENTITY.address.country}
          </p>
          <p className="mt-3 m-0">
            {t.legal.emailLabel}:{' '}
            <a
              href={`mailto:${LEGAL_ENTITY.email}`}
              className="text-accent font-semibold no-underline"
            >
              {LEGAL_ENTITY.email}
            </a>
          </p>
          {children}
        </section>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-txt m-0 mb-2">{section.title}</h2>
              <p className="text-sm text-muted leading-relaxed m-0">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
