'use client';

import Link from 'next/link';
import { DemoBadge } from '@/components/demo-badge';
import { VideoManifesto } from '@/components/video-manifesto';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { btnPrimary, eyebrow, pageIntro, pageTitle } from '@/lib/ui';

const MOCK = {
  domain: 'acmecorp.com',
  verifiedDays: 14,
  reports: 12,
  orgs: 4,
};

const SIGNATURE_DOMAIN = 'acme.studio';

export function HomeLanding() {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <section className="relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-txt leading-[1.1] mb-5">
              {t.home.heroTitle}
              <br />
              <span className="text-accent">{t.home.heroAccent}</span>
            </h1>
            <p className={`${pageIntro} max-w-md mx-auto mb-10`}>
              {t.home.heroSub}
            </p>
          </div>
          <VideoManifesto />
          <div className="text-center mt-10">
            <Link href={routes.connect} className={btnPrimary}>
              {t.home.ctaButton}
            </Link>
            <p className={`${pageIntro} mt-3 mb-0`}>{t.home.ctaSub}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className={`${eyebrow} mb-3`}>{t.home.howEyebrow}</p>
          <h2 className={`${pageTitle} mb-3`}>
            {t.home.howTitle}
          </h2>
          <p className={`${pageIntro} max-w-md mx-auto`}>
            {t.home.howLead}
          </p>
        </div>

        <div className="max-w-xl mx-auto rounded-xl border border-border bg-bg overflow-hidden">
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className={`${eyebrow} mb-3`}>{t.home.recordEyebrow}</p>
          <h2 className={`${pageTitle} mb-3`}>
            {t.home.recordTitle}
          </h2>
          <p className={`${pageIntro} max-w-md mx-auto`}>
            {t.home.recordSub}
          </p>
        </div>

        <div className="max-w-xl mx-auto rounded-xl border border-border bg-bg px-5 sm:px-7 py-6">
          <p className={eyebrow}>
            {t.domain.publicRecord}
          </p>
          <div className="mt-2.5">
            <h3 className="text-xl font-bold text-txt tracking-tight break-all leading-tight">
              {MOCK.domain}
            </h3>
            <p className="text-xs text-muted-2 font-mono mt-1.5 break-all">
              webuildreal.dev/records/{MOCK.domain}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-amber/30 bg-amber/5 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="shrink-0 w-2 h-2 rounded-full bg-amber"
              />
              <div className="min-w-0">
                <p className="text-base font-semibold text-txt leading-none">
                  {t.domain.building}
                </p>
                <p className="text-xs text-muted mt-1">
                  {t.home.mockStatusSub}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-6">
            {[
              { value: `${MOCK.verifiedDays}d`, label: t.domain.timeVerified, sub: t.home.mockTimeSub },
              { value: String(MOCK.reports), label: t.domain.reports, sub: t.domain.allTime },
              { value: String(MOCK.orgs), label: t.home.mockOrgs, sub: t.home.mockOrgsSub },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-bold font-mono leading-none text-txt">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-muted mt-1.5">{stat.label}</p>
                <p className="text-xs text-muted-2 mt-0.5 leading-tight">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>

          <p className={`${pageIntro} mt-6`}>
            {t.home.recordFoot}
          </p>
        </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-10">
            <p className={`${eyebrow} mb-3`}>{t.home.badgeEyebrow}</p>
            <h2 className={`${pageTitle} mb-3`}>
              {t.home.badgeTitle}
            </h2>
            <p className={`${pageIntro} max-w-md mx-auto`}>
              {t.home.badgeSub}
            </p>
          </div>

          <div className="max-w-md mx-auto rounded-xl border border-border bg-surface overflow-hidden">
            <div className={`px-5 py-2.5 border-b border-border ${eyebrow}`}>
              {t.badge.mockLabel}
            </div>
            <div className="px-5 py-5">
              <p className="text-sm font-semibold text-txt leading-tight">{t.home.signatureName}</p>
              <p className="text-xs text-muted mt-0.5">{t.home.signatureRole}</p>
              <p className="text-xs text-muted-2 mt-1 font-mono">
                {t.home.signatureContact}
              </p>
              <div className="mt-4">
                <DemoBadge
                  domain={SIGNATURE_DOMAIN}
                  state="verified"
                  alt={t.badge.alt.replace('{domain}', SIGNATURE_DOMAIN)}
                />
              </div>
            </div>
          </div>

          <p className={`${pageIntro} mt-6 text-center max-w-md mx-auto`}>
            {t.home.badgeFoot}
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-md mx-auto text-center">
            <h2 className={`${pageTitle} mb-3`}>
              {t.home.ctaTitle}
            </h2>
            <p className={`${pageIntro} mb-8`}>
              {t.home.ctaBody}
            </p>
            <Link href={routes.connect} className={btnPrimary}>
              {t.home.ctaButton}
            </Link>
            <p className={`${pageIntro} mt-3 mb-0`}>{t.home.ctaSub}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
