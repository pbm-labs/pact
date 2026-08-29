'use client';

import Link from 'next/link';
import { EvidenceQuery } from '@/components/evidence-query';
import { LeftoverPoints } from '@/components/leftover-points';
import { useLocale } from '@/components/locale-provider';
import type { CatalogKind } from '@/lib/kind-catalog';
import { routes } from '@/lib/routes';
import { btnPrimary, btnSecondary, container, eyebrow, linkMuted } from '@/lib/ui';

export function HomeLanding({ kinds }: { kinds: CatalogKind[] }) {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className={`${container} pt-20 sm:pt-28 pb-16 sm:pb-20`}>
        <p className={`${eyebrow} mb-8`}>leftover</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08] m-0 text-muted">
          {t.home.heroLine1}
        </h1>
        <p className="mt-2 mb-0 text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-txt">
          {t.home.heroLine2}
        </p>
        <p className="mt-8 mb-0 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
          {t.home.turnLine}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#query" className={btnPrimary}>
            {t.home.queryHeading}
          </a>
          <Link href={routes.howItWorks} className={btnSecondary}>
            {t.home.seeHowItWorks}
          </Link>
        </div>
      </div>

      {/* ── The problem ──────────────────────────────────────── */}
      <div className="border-t border-border">
        <div className={`${container} py-14 sm:py-20`}>
          <div className="border-l-2 border-brand/60 pl-6 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-txt m-0">
              {t.home.problemHeading}
            </h2>
            <p className="mt-4 mb-0 text-base sm:text-lg text-muted leading-relaxed">
              {t.home.problemBody}
            </p>
          </div>
        </div>
      </div>

      {/* ── Gap: why every current tool fails ────────────────── */}
      <div className="border-t border-border bg-surface">
        <div className={`${container} py-14 sm:py-20`}>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-txt m-0">
            {t.home.gapHeading}
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            <div className="rounded-xl border border-border bg-bg p-6">
              <p className={`${eyebrow} mb-3`}>{t.home.gapSelfAttestHeading}</p>
              <p className="m-0 text-sm sm:text-base text-muted leading-relaxed">
                {t.home.gapSelfAttestBody}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-bg p-6">
              <p className={`${eyebrow} mb-3`}>{t.home.gapScannerHeading}</p>
              <p className="m-0 text-sm sm:text-base text-muted leading-relaxed">
                {t.home.gapScannerBody}
              </p>
            </div>
          </div>
          <p className="mt-7 mb-0 text-base sm:text-lg font-semibold text-txt">
            {t.home.gapConclusion}
          </p>
        </div>
      </div>

      {/* ── Three rails: Uncommissioned / Outlives / Not a score */}
      <div className="border-t border-border">
        <div className={`${container} py-14 sm:py-20`}>
          <LeftoverPoints />
        </div>
      </div>

      {/* ── Accountability receipt ───────────────────────────── */}
      <div className="border-t border-border bg-surface">
        <div className={`${container} py-14 sm:py-20`}>
          <div className="rounded-2xl border border-brand/25 bg-brand/5 p-7 sm:p-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-txt m-0">
              {t.home.receiptHeading}
            </h2>
            <p className="mt-4 mb-0 text-base sm:text-lg text-muted leading-relaxed">
              {t.home.receiptBody}
            </p>
          </div>
        </div>
      </div>

      {/* ── Live evidence query ──────────────────────────────── */}
      <div className="border-t border-border" id="query">
        <div className={`${container} py-14 sm:py-20`}>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-txt m-0">
            {t.home.queryHeading}
          </h2>
          <div className="mt-8">
            <EvidenceQuery kinds={kinds} />
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <div className="border-t border-border bg-surface">
        <div className={`${container} py-14 sm:py-16`}>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-txt m-0">
            {t.home.bottomLine}
          </p>
          <p className="mt-6 mb-0">
            <Link href={routes.howItWorks} className={btnSecondary}>
              {t.home.seeHowItWorks}
            </Link>
          </p>
          <p className="mt-6 mb-0 text-sm text-muted-2">
            {t.home.agents}{' '}
            <a href={routes.ledgerKinds} className={`${linkMuted} font-mono`}>
              {t.home.catalog}
            </a>
          </p>
        </div>
      </div>

    </main>
  );
}
