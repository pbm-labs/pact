import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { SiteNarrative } from '@/components/site-narrative';
import { VideoManifesto } from '@/components/video-manifesto';
import { btnPrimary, eyebrow } from '@/lib/ui';

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col justify-center">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-20">
        <div className="mesh-glow" aria-hidden />

        <Reveal delay={40}>
          <VideoManifesto />
        </Reveal>

        <div className="max-w-2xl mx-auto">
          <p className={`${eyebrow} mt-10 sm:mt-12 mb-4`}>The Manifesto</p>

          <SiteNarrative />

          <Reveal delay={80}>
            <div className="mt-10 sm:mt-12 pt-8 border-t border-border flex flex-col items-start gap-4">
              <Link href="/how-it-works#add-your-name" className={btnPrimary}>
                Add your name
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
    </main>
  );
}
