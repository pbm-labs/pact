'use client';

import Link from 'next/link';
import { SiteNarrative } from '@/components/site-narrative';
import { VideoManifesto } from '@/components/video-manifesto';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { btnPrimary, eyebrow, metaText, sectionTitle } from '@/lib/ui';
import { DomainLookup } from './domain-lookup';

const MOCK = {
  domain: 'acmecorp.com',
  verifiedDays: '14d',
  reports: '12',
  orgs: '4',
};

const PRIVACY_ROWS: { label: string; inReport: boolean }[] = [
  { label: 'Sending domain', inReport: true },
  { label: 'Reporting period', inReport: true },
  { label: 'Pass / fail counts', inReport: true },
  { label: 'Reporting organization', inReport: true },
  { label: 'Message content', inReport: false },
  { label: 'Recipients', inReport: false },
  { label: 'Mailboxes', inReport: false },
  { label: 'Personal identities', inReport: false },
];

export function V2Landing() {
  const { t } = useLocale();

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-20 text-center">
          <h1 className="text-[2.5rem] sm:text-5xl font-bold tracking-tight text-txt leading-[1.05] mb-6">
            AI can fake everything.
            <br />
            <span className="text-accent">Except yesterday.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-lg mx-auto leading-relaxed mb-10">
            A verifiable public record for your domain — built passively, impossible to
            backdate.
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
            <p className={`${eyebrow} mb-3`}>The manifesto</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-txt mb-3">
              The Internet&apos;s Identity Problem
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
              Why history is the one thing that still can&apos;t be manufactured.
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
          <p className={`${eyebrow} mb-3`}>Behind every record</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-txt mb-3">
            Your full public page.
          </h2>
          <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
            Anyone can open it. Independently confirmed history — shareable anywhere a
            counterparty might look.
          </p>
        </div>

        <div className="max-w-xl mx-auto rounded-xl border border-border bg-surface px-5 sm:px-7 py-6 sm:py-8 shadow-sm">
          <p className="text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
            Public record
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
                <p className="text-lg sm:text-xl font-bold text-amber leading-none">Building</p>
                <p className="text-[0.7rem] sm:text-xs text-muted mt-1">
                  Independently confirmed history, still accumulating.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-6">
            {[
              { value: MOCK.verifiedDays, label: 'Time verified', sub: 'since first report' },
              { value: MOCK.reports, label: 'Reports', sub: 'all time' },
              { value: MOCK.orgs, label: 'Reporting orgs', sub: 'independent' },
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
            Every entry was confirmed by receiving mail systems — not self-reported. This
            record only grows forward.
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-muted mb-3">
            Check if your domain is on record
          </p>
          <DomainLookup />
          <p className="text-center text-xs text-muted mt-4">
            or see public records:{' '}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-txt mb-4">Private by design.</h2>
              <p className="text-muted text-sm leading-relaxed mb-4">
                We never receive your mail. Connecting points a DNS report address (rua) at
                us — the aggregate reports receivers already send domain owners each day.
                Those reports are authentication counts and infrastructure, not messages.
                No content. No people.
              </p>
              <p className="text-muted text-sm leading-relaxed">
                That feed is the only data source. The public record is a domain&apos;s
                confirmed history, not anyone&apos;s correspondence.
              </p>
            </div>
            <div className="shrink-0 sm:w-64 w-full rounded-xl border border-border bg-bg overflow-hidden text-xs font-mono">
              <div className="border-b border-border px-4 py-2.5 text-muted-2 uppercase tracking-widest text-[0.6rem]">
                What&apos;s in a report
              </div>
              {PRIVACY_ROWS.map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between px-4 py-2.5 gap-3 ${
                    i < arr.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <span className="text-muted truncate">{row.label}</span>
                  {row.inReport ? (
                    <span className="text-verified shrink-0">✓</span>
                  ) : (
                    <span className="text-muted-2 shrink-0">✗ never</span>
                  )}
                </div>
              ))}
            </div>
          </div>
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
