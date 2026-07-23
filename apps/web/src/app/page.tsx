import Link from 'next/link';
import { SiteNarrative } from '@/components/site-narrative';
import { VideoManifesto } from '@/components/video-manifesto';
import { btnPrimary, eyebrow } from '@/lib/ui';

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-20">
        <VideoManifesto />

        <p className={`${eyebrow} mt-8 sm:mt-10 mb-4`}>Prefer to read? Full transcript below</p>

        <SiteNarrative />

        <div className="mt-10 sm:mt-12">
          <Link href="/how-it-works#add-your-name" className={btnPrimary}>
            Add your name
          </Link>
          <p className="text-sm text-muted mt-3 max-w-md">
            In practice, that means connecting a domain — yours or your business&apos;s. Two
            minutes, and most of it happens automatically.
          </p>
          <p className="text-sm text-muted-2 mt-2">
            Be one of the first to stand on solid ground.
          </p>
        </div>

        <div className="mt-16 sm:mt-20 border-y border-border py-7 sm:py-8 text-center text-sm sm:text-[15px] text-muted-2">
          Curious how this actually works?{' '}
          <Link
            href="/how-it-works"
            className="text-txt underline underline-offset-2 decoration-border-h hover:decoration-txt transition-colors"
          >
            See the mechanism →
          </Link>
        </div>
      </div>
    </main>
  );
}
