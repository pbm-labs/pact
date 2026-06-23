import Link from 'next/link';
import { HomeLightShell } from '@/components/home-light-shell';
import { SiteNarrative } from '@/components/site-narrative';

const btnManifesto =
  'inline-flex items-center justify-center h-11 px-6 rounded-md bg-[#111111] text-white text-sm font-medium tracking-normal transition-opacity hover:opacity-85 no-underline';

export default function HomePage() {
  return (
    <HomeLightShell>
      <main className="flex-1 bg-white">
        <div className="max-w-[42rem] mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24">
          <SiteNarrative />

          <div className="mt-12 sm:mt-14">
            <Link href="/how-it-works#add-your-name" className={btnManifesto}>
              Add your name
            </Link>
            <p className="text-[13px] text-[#888888] mt-3 m-0">
              Be one of the first to stand on solid ground.
            </p>
          </div>

          <div className="mt-16 sm:mt-20 border-y border-[#e8e8e8] py-7 sm:py-8 text-center text-[15px] text-[#666666]">
            Curious how this actually works?{' '}
            <Link
              href="/how-it-works"
              className="text-[#111111] underline underline-offset-2 decoration-[#cccccc] hover:decoration-[#111111] transition-colors"
            >
              See the mechanism →
            </Link>
          </div>
        </div>
      </main>
    </HomeLightShell>
  );
}
