'use client';

import { WakePoints } from '@/components/wake-points';
import { useLocale } from '@/components/locale-provider';
import { container, eyebrow } from '@/lib/ui';

export function HomeLanding() {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className={`${container} pt-24 sm:pt-32 pb-20 sm:pb-28`}>
        <p className={`${eyebrow} mb-10`}>Wake</p>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.06] m-0">
          <span className="text-muted">{t.home.heroLine1}</span>
          <br />
          <span className="text-txt">{t.home.heroLine2}</span>
        </h1>
        <p className="mt-10 mb-0 text-base sm:text-xl text-muted leading-relaxed max-w-xl">
          {t.home.turnLine}
        </p>
      </div>

      {/* ── The problem ──────────────────────────────────────── */}
      <div className="border-t border-border">
        <div className={`${container} py-16 sm:py-24`}>
          <div className="border-l-2 border-brand/60 pl-8 max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-txt m-0">
              {t.home.problemHeading}
            </h2>
            <p className="mt-5 mb-0 text-base sm:text-lg text-muted leading-relaxed">
              {t.home.problemBody}
            </p>
          </div>
        </div>
      </div>

      {/* ── Gap: why every current tool fails ────────────────── */}
      <div className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-24`}>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-txt m-0">
            {t.home.gapHeading}
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            <div className="rounded-xl border border-border bg-bg p-7">
              <p className={`${eyebrow} mb-3`}>{t.home.gapSelfAttestHeading}</p>
              <p className="m-0 text-sm sm:text-base text-muted leading-relaxed">
                {t.home.gapSelfAttestBody}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-bg p-7">
              <p className={`${eyebrow} mb-3`}>{t.home.gapScannerHeading}</p>
              <p className="m-0 text-sm sm:text-base text-muted leading-relaxed">
                {t.home.gapScannerBody}
              </p>
            </div>
          </div>
          <p className="mt-8 mb-0 text-base sm:text-lg font-semibold text-txt">
            {t.home.gapConclusion}
          </p>
        </div>
      </div>

      {/* ── Three rails: Uncommissioned / Outlives / Not a score */}
      <div className="border-t border-border">
        <div className={`${container} py-16 sm:py-24`}>
          <WakePoints />
        </div>
      </div>

      {/* ── Accountability receipt ───────────────────────────── */}
      <div className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-24`}>
          <div className="rounded-2xl border border-brand/25 bg-brand/5 p-8 sm:p-12 max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-txt m-0">
              {t.home.receiptHeading}
            </h2>
            <p className="mt-5 mb-0 text-base sm:text-lg text-muted leading-relaxed">
              {t.home.receiptBody}
            </p>
          </div>
        </div>
      </div>

    </main>
  );
}
