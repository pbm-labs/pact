'use client';

import Link from 'next/link';
import { DemoBadge } from '@/components/demo-badge';
import { DomainLookup } from '@/components/domain-lookup';
import { SiteNarrative } from '@/components/site-narrative';
import { VideoManifesto } from '@/components/video-manifesto';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { btnPrimary, eyebrow, metaText, sectionTitle } from '@/lib/ui';

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
            <h1 className="text-[2.5rem] sm:text-5xl font-bold tracking-tight text-txt leading-[1.05] mb-6">
              {t.home.heroTitle}
              <br />
              <span className="text-accent">{t.home.heroAccent}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-lg mx-auto leading-relaxed mb-10">
              {t.home.heroSub}
            </p>
          </div>
          <VideoManifesto />
          <div className="max-w-2xl mx-auto mt-10">
            <SiteNarrative />
          </div>
          <div className="text-center mt-10">
            <Link href={routes.connect} className={btnPrimary}>
              {t.home.ctaButton}
            </Link>
            <p className={`mt-5 ${metaText}`}>{t.home.ctaSub}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className={`${eyebrow} mb-3`}>{t.home.howEyebrow}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-txt mb-3">
            {t.home.howTitle}
          </h2>
          <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed">
            {t.home.howLead}
          </p>
        </div>

        <ol className="space-y-8 max-w-xl mx-auto m-0 p-0 list-none">
          {t.home.howSteps.map((step, i) => (
            <li key={step.title} className="flex gap-4 sm:gap-5">
              <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-widest text-muted-2 pt-1.5 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-txt m-0 leading-snug">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed mt-2 m-0">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 max-w-xl mx-auto flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-txt m-0">{t.home.privacyTitle}</h3>
            <p className="text-sm text-muted leading-relaxed mt-2 m-0">{t.home.privacyBody2}</p>
          </div>
          <div className="shrink-0 sm:w-56 w-full rounded-xl border border-border bg-surface overflow-hidden text-xs font-mono">
            <div className="border-b border-border px-4 py-2.5 text-muted-2 uppercase tracking-widest text-[0.6rem]">
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

        <p className="text-center mt-10 m-0">
          <Link
            href={routes.docsWhy}
            className="text-sm font-semibold text-accent no-underline hover:opacity-90"
          >
            {t.home.howMore} →
          </Link>
        </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className={`${eyebrow} mb-3`}>{t.home.recordEyebrow}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-txt mb-3">
            {t.home.recordTitle}
          </h2>
          <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
            {t.home.recordSub}
          </p>
        </div>

        <div className="max-w-xl mx-auto rounded-xl border border-border bg-surface px-5 sm:px-7 py-6 sm:py-8 shadow-sm">
          <p className="text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
            {t.domain.publicRecord}
          </p>
          <div className="mt-2.5">
            <h3 className="text-xl sm:text-2xl font-bold text-txt tracking-tight break-all leading-[1.1]">
              {MOCK.domain}
            </h3>
            <p className="text-[0.7rem] sm:text-xs text-muted-2 font-mono mt-1.5 break-all">
              webuildreal.dev/records/{MOCK.domain}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-amber/40 bg-amber/10 px-4 py-4">
            <div className="flex items-center gap-3.5">
              <span
                aria-hidden
                className="shrink-0 w-8 h-8 rounded-full bg-amber flex items-center justify-center"
              >
                <span className="w-2 h-2 rounded-full bg-bg" />
              </span>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold text-amber leading-none">
                  {t.domain.building}
                </p>
                <p className="text-[0.7rem] sm:text-xs text-muted mt-1">
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
                <p className="text-xl sm:text-2xl font-bold font-mono leading-none text-txt">
                  {stat.value}
                </p>
                <p className="text-[0.7rem] sm:text-xs font-semibold text-txt mt-1.5">{stat.label}</p>
                <p className="text-[0.6rem] sm:text-[0.7rem] text-muted-2 mt-0.5 leading-tight">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[0.8rem] text-muted leading-relaxed">
            {t.home.recordFoot}
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-muted mb-3">
            {t.home.lookupEyebrow}
          </p>
          <DomainLookup />
          <p className="text-center text-xs text-muted mt-4">
            {t.home.lookupOrRecords}{' '}
            <Link
              href={routes.records}
              className="text-accent hover:underline font-mono whitespace-nowrap"
            >
              webuildreal.dev/records →
            </Link>
          </p>
        </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className={`${eyebrow} mb-3`}>{t.home.badgeEyebrow}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-txt mb-3">
              {t.home.badgeTitle}
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
              {t.home.badgeSub}
            </p>
          </div>

          <div className="max-w-md mx-auto rounded-xl border border-border bg-bg overflow-hidden shadow-sm">
            <div className="px-5 py-2.5 border-b border-border text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
              {t.badge.mockLabel}
            </div>
            <div className="px-5 py-5">
              <p className="text-sm font-semibold text-txt leading-tight">{t.home.signatureName}</p>
              <p className="text-xs text-muted mt-0.5">{t.home.signatureRole}</p>
              <p className="text-[0.7rem] text-muted-2 mt-1 font-mono">
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

          <p className="mt-6 text-center text-xs text-muted-2 leading-relaxed max-w-md mx-auto">
            {t.home.badgeFoot}
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className={`${sectionTitle} leading-relaxed mb-3`}>
              {t.home.ctaTitle}
            </p>
            <p className="text-sm text-muted leading-relaxed mb-8">
              {t.home.ctaBody}
            </p>
            <Link href={routes.connect} className={btnPrimary}>
              {t.home.ctaButton}
            </Link>
            <p className={`mt-5 ${metaText}`}>{t.home.ctaSub}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
