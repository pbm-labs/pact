import Link from 'next/link';
import { SiteNarrative } from '@/components/site-narrative';
import { btnPrimary, linkAccent } from '@/lib/ui';

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <SiteNarrative />

        <div className="mt-10 sm:mt-12">
          <Link href="/how-it-works#add-your-name" className={btnPrimary}>
            Add your name
          </Link>
          <p className="text-sm text-muted-2 mt-3">
            Be one of the first to stand on solid ground.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-2">
          Curious how this actually works?{' '}
          <Link href="/how-it-works" className={linkAccent}>
            See the mechanism →
          </Link>
        </p>
      </div>
    </main>
  );
}
