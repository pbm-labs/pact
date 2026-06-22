import Link from 'next/link';
import { linkMuted } from '@/lib/ui';

export function MovementFooter() {
  return (
    <footer className="border-t border-border/60 mt-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center text-[13px] text-muted-2">
        <p className="lowercase mb-3 m-0">we build real</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          <Link href="/" className={linkMuted}>
            Home
          </Link>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <Link href="/domains" className={linkMuted}>
            Records
          </Link>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <Link href="/how-it-works" className={linkMuted}>
            Connect
          </Link>
        </nav>
      </div>
    </footer>
  );
}
