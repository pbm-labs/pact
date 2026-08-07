import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { SiteNarrative } from '@/components/site-narrative';
import { VideoManifesto } from '@/components/video-manifesto';
import { btnPrimary, eyebrow } from '@/lib/ui';

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="relative overflow-hidden">
        <div className="mesh-glow" aria-hidden />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-20">
          <Reveal delay={40}>
            <VideoManifesto />
          </Reveal>

          <div className="max-w-2xl mx-auto">
            <p className={`${eyebrow} mt-10 sm:mt-12 mb-4`}>The Manifesto</p>

            <SiteNarrative />
          </div>
        </div>
      </div>

      <section className="border-t border-border bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="max-w-2xl mx-auto">
            <Reveal delay={80}>
              <div className="flex flex-col items-start gap-4">
                <Link href="/how-it-works#add-your-domain" className={btnPrimary}>
                  Add your domain
                </Link>
                <p className="text-[13px] text-muted-2 flex items-center gap-2">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-verified animate-soft-pulse" />
                  </span>
                  Be one of the first to stand on solid ground.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
