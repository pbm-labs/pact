import Link from 'next/link';
import { MobileMenu } from '@/components/mobile-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { WHITEOBER_URL } from '@/lib/links';

export function MovementHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center no-underline group shrink-0">
          <span className="font-brand text-[13px] sm:text-sm text-txt group-hover:text-brand transition-colors">
            we build real
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href={WHITEOBER_URL}
            className="hidden sm:inline text-[13px] text-muted-2 hover:text-txt no-underline"
          >
            Whitepaper
          </Link>
          <Link
            href="/domains"
            className="hidden sm:inline text-[13px] text-muted-2 hover:text-txt no-underline"
          >
            Public records
          </Link>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
