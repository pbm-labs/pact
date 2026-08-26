'use client';

import Link from 'next/link';
import { DomainClocks } from '@/components/domain-clocks';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { bodyText, btnPrimary, container, eyebrow, linkMuted, pageIntro, pageTitle, statValue } from '@/lib/ui';

export type HomePreview = {
  domain: string;
  domainRegisteredAt: string | null;
  pactHistoryStart: string | null;
  mailCount: number;
  ctCount: number;
  rekorCount: number;
};

export function HomeLanding({ preview }: { preview: HomePreview | null }) {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <section className="relative overflow-hidden">
        <div className={`relative ${container} pt-20 sm:pt-24 pb-16 sm:pb-20`}>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-txt leading-[1.1] mb-5">
              {t.home.heroTitle}
              <br />
              <span className="text-accent">{t.home.heroAccent}</span>
            </h1>
            <p className={`${pageIntro} max-w-xl mx-auto mb-4`}>
              {t.home.heroSub}
            </p>
            <p className={`${bodyText} max-w-xl mx-auto mb-10`}>
              {t.home.heroLead}
            </p>
            <Link href={routes.connect} className={btnPrimary}>
              {t.home.ctaButton}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-20`}>
        <div className="text-center mb-10">
          <p className={`${eyebrow} mb-3`}>{t.home.howEyebrow}</p>
          <h2 className={`${pageTitle} mb-3`}>
            {t.home.howTitle}
          </h2>
          <p className={`${pageIntro} max-w-2xl mx-auto`}>
            {t.home.howLead}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg overflow-hidden">
          {t.home.howSteps.map((step, i) => (
            <div
              key={step.title}
              className={`px-5 sm:px-7 py-5 ${i > 0 ? 'border-t border-border' : ''}`}
            >
              <p className={`${eyebrow} m-0`}>{String(i + 1).padStart(2, '0')}</p>
              <h3 className="text-base font-semibold text-txt m-0 mt-2 leading-snug">
                {step.title}
              </h3>
              <p className={`${pageIntro} mt-2 m-0`}>{step.body}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className={`${container} py-16 sm:py-20`}>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
            <div className="flex-1 min-w-0">
              <h2 className={`${pageTitle} mb-3`}>
                {t.home.privacyTitle}
              </h2>
              <p className={`${pageIntro} mb-3`}>{t.home.privacyBody1}</p>
              <p className={`${pageIntro} m-0`}>{t.home.privacyBody2}</p>
            </div>
            <div className="shrink-0 sm:w-64 w-full rounded-xl border border-border bg-surface overflow-hidden text-xs font-mono">
              <div className={`border-b border-border px-4 py-2.5 ${eyebrow}`}>
                {t.home.privacyTableTitle}
              </div>
              {t.home.privacyRows.map((label, i, arr) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-4 py-2.5 gap-3 ${
                    i < arr.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <span className="text-muted truncate">{label}</span>
                  <span className="text-verified shrink-0">✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-20`}>
        <div className="text-center mb-10">
          <p className={`${eyebrow} mb-3`}>{t.home.recordEyebrow}</p>
          <h2 className={`${pageTitle} mb-3`}>
            {t.home.recordTitle}
          </h2>
          <p className={`${pageIntro} max-w-xl mx-auto`}>
            {t.home.recordSub}
          </p>
        </div>

        {preview && (
          <Link
            href={routes.record(preview.domain)}
            className="block max-w-xl mx-auto rounded-xl border border-border bg-bg px-5 sm:px-7 py-6 no-underline hover:border-muted-2"
          >
            <h3 className="text-xl font-bold text-txt tracking-tight break-all leading-tight m-0">
              {preview.domain}
            </h3>
            <DomainClocks
              domainRegisteredAt={preview.domainRegisteredAt}
              pactHistoryStart={preview.pactHistoryStart}
            />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className={`${eyebrow} m-0`}>{t.domain.kindMail}</p>
                <p className={`${statValue} text-txt mt-2 mb-0`}>
                  {preview.mailCount}
                  <span className="ml-2 text-xs font-sans font-semibold text-muted-2 tracking-normal">
                    {t.domain.reports}
                  </span>
                </p>
              </div>
              <div>
                <p className={`${eyebrow} m-0`}>{t.domain.kindCt}</p>
                <p className={`${statValue} text-txt mt-2 mb-0`}>
                  {preview.ctCount}
                  <span className="ml-2 text-xs font-sans font-semibold text-muted-2 tracking-normal">
                    {t.domain.certs}
                  </span>
                </p>
              </div>
              <div>
                <p className={`${eyebrow} m-0`}>{t.domain.kindRekor}</p>
                <p className={`${statValue} text-txt mt-2 mb-0`}>
                  {preview.rekorCount}
                  <span className="ml-2 text-xs font-sans font-semibold text-muted-2 tracking-normal">
                    {t.domain.sigs}
                  </span>
                </p>
              </div>
            </div>
          </Link>
        )}
        <p className="text-center mt-6">
          <Link href={routes.records} className={`${linkMuted} text-xs font-mono`}>
            {t.records.title} →
          </Link>
        </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className={`${container} py-16 sm:py-20`}>
          <div className="max-w-xl mx-auto text-center">
            <h2 className={`${pageTitle} mb-4`}>
              {t.home.ctaTitle}
            </h2>
            <p className={`${pageIntro} mb-8`}>{t.home.ctaSub}</p>
            <Link href={routes.connect} className={btnPrimary}>
              {t.home.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
