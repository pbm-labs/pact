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
  verifiedDays: '14d',
  reports: '12',
  orgs: '4',
};

const SIGNATURE_DOMAIN = 'acme.studio';

export function HomeLanding() {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <section className="relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-20 text-center">
          <h1 className="text-[2.5rem] sm:text-5xl font-bold tracking-tight text-txt leading-[1.05] mb-6">
            {t.home.heroTitle}
            <br />
            <span className="text-accent">{t.home.heroAccent}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-lg mx-auto leading-relaxed mb-10">
            {t.home.heroSub}
          </p>
          <Link href={routes.connect} className={btnPrimary}>
            {t.home.ctaButton}
          </Link>
          <p className={`mt-5 ${metaText}`}>{t.home.ctaSub}</p>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className={`${eyebrow} mb-3`}>{t.home.manifestoEyebrow}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-txt mb-3">
              {t.home.manifestoTitle}
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
              {t.home.manifestoSub}
            </p>
          </div>
          <VideoManifesto />
          <div className="max-w-2xl mx-auto mt-10">
            <SiteNarrative />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
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
              { value: MOCK.verifiedDays, label: t.domain.timeVerified, sub: t.home.mockTimeSub },
              { value: MOCK.reports, label: t.domain.reports, sub: t.domain.allTime },
              { value: MOCK.orgs, label: t.home.mockOrgs, sub: t.home.mockOrgsSub },
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
      </section>

      <section className="border-y border-border bg-surface py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-14 items-start">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-txt mb-4">{t.home.privacyTitle}</h2>
              <p className="text-muted text-sm leading-relaxed mb-4">{t.home.privacyBody1}</p>
              <p className="text-muted text-sm leading-relaxed">{t.home.privacyBody2}</p>
            </div>
            <div className="shrink-0 sm:w-64 w-full rounded-xl border border-border bg-bg overflow-hidden text-xs font-mono">
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
