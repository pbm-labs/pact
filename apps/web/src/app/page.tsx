'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { SiteNarrative } from '@/components/site-narrative';
import { VideoManifesto } from '@/components/video-manifesto';
import { btnPrimary, eyebrow } from '@/lib/ui';

export default function HomePage() {
  const { t } = useLocale();

  return (
    <main className="flex-1">
      <div className="relative overflow-hidden bg-surface">
        <div className="mesh-glow" aria-hidden />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-20">
          <VideoManifesto />

          <div className="max-w-2xl mx-auto">
            <p className={`${eyebrow} mt-10 sm:mt-12 mb-4`}>{t.home.manifestoEyebrow}</p>

            <SiteNarrative />
          </div>
        </div>
      </div>

      <section className="border-t border-border bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-base sm:text-lg text-txt font-semibold leading-relaxed mb-3">
              {t.home.ctaTitle}
            </p>
            <p className="text-sm sm:text-base text-muted leading-relaxed mb-8 whitespace-pre-line">
              {t.home.ctaBody}
            </p>
            <Link href="/how-it-works#add-your-domain" className={btnPrimary}>
              {t.home.ctaButton}
            </Link>
            <p className="mt-5 text-xs text-muted-2 font-mono">{t.home.ctaSub}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
