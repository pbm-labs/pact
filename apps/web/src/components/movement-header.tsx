import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export function MovementHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline group shrink-0">
          <span className="font-brand text-[11px] text-txt group-hover:text-brand transition-colors">
            PACT
          </span>
          <span className="hidden sm:inline text-[13px] text-muted-2 lowercase tracking-normal group-hover:text-muted transition-colors">
            we build real
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/domains"
            className="hidden sm:inline text-[13px] text-muted-2 hover:text-txt transition-colors no-underline"
          >
            Public records
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
