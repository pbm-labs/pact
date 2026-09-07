'use client';

import { useLocale } from '@/components/locale-provider';
import { DiagnosticForm } from '@/components/diagnostic-form';
import { EvidenceQuery } from '@/components/evidence-query';
import { EvidenceTimeline } from '@/components/evidence-timeline';
import { LiveProof } from '@/components/live-proof';
import type { LiveProofData } from '@/lib/evidence';
import type { CatalogKind } from '@/lib/kind-catalog';
import { btnPrimary, container, eyebrow } from '@/lib/ui';

export function HomeLanding({
  kinds,
  liveProof,
}: {
  kinds: CatalogKind[];
  liveProof: LiveProofData | null;
}) {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>

      {/* ── Hook ─────────────────────────────────────────────── */}
      <div className={`${container} pt-24 sm:pt-32 pb-20 sm:pb-28`}>
        <p className={`${eyebrow} mb-10`}>Wake</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08] m-0">
          <span className="text-muted">{t.home.heroLine1}</span>
          <br />
          <span className="text-muted">{t.home.heroLine2}</span>
          <br />
          <span className="text-txt">{t.home.heroLine3}</span>
        </h1>
        <p className="mt-10 mb-0 text-base sm:text-xl text-muted leading-relaxed max-w-xl">
          {t.home.turnLine}
        </p>
        <a
          href="#diagnostic"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-txt hover:text-brand no-underline"
        >
          {t.home.heroScrollHint}
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      {/* ── The moment it breaks ─────────────────────────────── */}
      <div className="border-t border-border">
        <div className={`${container} py-16 sm:py-24`}>
          <div className="border-l-2 border-brand/60 pl-6 sm:pl-8 max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-txt m-0 leading-tight">
              {t.home.sceneHeading}
            </h2>
            <p className="mt-5 mb-0 text-base sm:text-lg text-muted leading-relaxed">
              {t.home.sceneBody}
            </p>
            <p className="mt-5 mb-0 text-sm sm:text-base text-muted-2 leading-relaxed italic">
              {t.home.sceneProof}
            </p>
          </div>
        </div>
      </div>

      {/* ── Why nothing built for this survives it ───────────── */}
      <div className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-24`}>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-txt m-0 max-w-2xl leading-tight">
            {t.home.gapHeading}
          </h2>
          <p className="mt-5 mb-0 text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
            {t.home.gapIntro}
          </p>

          <div className="mt-10 max-w-2xl border-t border-border divide-y divide-border">
            <div className="py-6">
              <h3 className="m-0 text-base sm:text-lg font-bold tracking-tight text-txt">
                {t.home.gapSelfAttestHeading}
              </h3>
              <p className="mt-2 mb-0 text-sm sm:text-base text-muted leading-relaxed">
                {t.home.gapSelfAttestBody}
              </p>
            </div>
            <div className="py-6">
              <h3 className="m-0 text-base sm:text-lg font-bold tracking-tight text-txt">
                {t.home.gapScannerHeading}
              </h3>
              <p className="mt-2 mb-0 text-sm sm:text-base text-muted leading-relaxed">
                {t.home.gapScannerBody}
              </p>
            </div>
            <div className="py-6">
              <h3 className="m-0 text-base sm:text-lg font-bold tracking-tight text-txt">
                {t.home.gapAuditHeading}
              </h3>
              <p className="mt-2 mb-0 text-sm sm:text-base text-muted leading-relaxed">
                {t.home.gapAuditBody}
              </p>
            </div>
          </div>

          <p className="mt-10 mb-0 text-lg sm:text-xl font-semibold tracking-tight text-txt leading-snug max-w-2xl">
            {t.home.gapConclusion}
          </p>
        </div>
      </div>

      {/* ── What's already standing when the vendor isn't ───── */}
      <div className="border-t border-border">
        <div className={`${container} py-16 sm:py-24`}>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-txt m-0 max-w-2xl leading-tight">
            {t.home.mechanismHeading}
          </h2>
          <p className="mt-5 mb-0 text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
            {t.home.mechanismIntro}
          </p>

          <EvidenceTimeline
            items={t.home.mechanismItems}
            liveTag={t.home.mechanismLiveTag}
            plannedTag={t.home.mechanismPlannedTag}
            marker={t.home.mechanismMarker}
            afterMarker={t.home.mechanismAfterMarker}
          />

          <p className="mt-2 mb-0 text-lg sm:text-xl font-semibold tracking-tight text-txt leading-snug max-w-2xl">
            {t.home.mechanismConclusion}
          </p>

          <div className="mt-14 sm:mt-16 max-w-2xl rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="m-0 text-lg sm:text-xl font-bold tracking-tight text-txt">
              {t.home.mechanismDemoHeading}
            </h3>
            <p className="mt-2.5 mb-0 text-sm sm:text-base text-muted leading-relaxed">
              {t.home.mechanismDemoBody}
            </p>

            <div className="[&>section]:!mt-6 [&>section+section]:!mt-10">
              {liveProof ? <LiveProof domain={liveProof.domain} results={liveProof.results} /> : null}
              <EvidenceQuery kinds={kinds} />
            </div>
          </div>
        </div>
      </div>

      {/* ── The offer — the smoke test itself ────────────────── */}
      <div id="diagnostic" className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-24`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-txt m-0 leading-tight">
                {t.home.offerHeading}
              </h2>
              <p className="mt-5 mb-0 text-base sm:text-lg text-muted leading-relaxed">
                {t.home.offerBody}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-bg shadow-sm p-6 sm:p-8">
              <DiagnosticForm />
            </div>
          </div>
        </div>
      </div>

      {/* ── Close ─────────────────────────────────────────────── */}
      <div className="border-t border-border">
        <div className={`${container} py-16 sm:py-24 text-center`}>
          <p className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-txt leading-snug max-w-xl mx-auto">
            {t.home.closeHeading}
          </p>
          <a href="#diagnostic" className={`${btnPrimary} mt-8`}>
            {t.home.closeCta}
          </a>
        </div>
      </div>

    </main>
  );
}
