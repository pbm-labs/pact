import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { SiteNarrative } from '@/components/site-narrative';
import { VideoManifesto } from '@/components/video-manifesto';
import { fetchJoinedCount } from '@/lib/domain-data';
import { btnPrimary, btnSecondary, eyebrow } from '@/lib/ui';

export default async function HomePage() {
  const joined = await fetchJoinedCount();

  return (
    <main className="flex-1">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-20">
        <div className="mesh-glow" aria-hidden />

        <Reveal>
          <p className={`${eyebrow} mb-4`}>The manifesto</p>
        </Reveal>

        <VideoManifesto />

        <p className={`${eyebrow} mt-8 sm:mt-10 mb-4`}>Prefer to read? Full transcript below</p>

        <SiteNarrative />

        <Reveal delay={80}>
          <div className="mt-12 sm:mt-14 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
            <p className="text-lg font-semibold text-txt mb-1">Add your name</p>
            <p className="text-sm text-muted mb-6 max-w-md leading-relaxed">
              In practice, that means connecting a domain — yours or your business&apos;s. Two
              minutes, and most of it happens automatically.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/how-it-works#add-your-name" className={btnPrimary}>
                Add your name
              </Link>
              <Link href="/how-it-works" className={btnSecondary}>
                See the mechanism
              </Link>
            </div>
            <p className="text-xs text-muted-2 mt-5 inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-verified animate-soft-pulse" />
              </span>
              {joined > 0
                ? `${joined.toLocaleString()} ${joined === 1 ? 'domain has' : 'domains have'} already joined. `
                : ''}
              Be one of the first to stand on solid ground.
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
