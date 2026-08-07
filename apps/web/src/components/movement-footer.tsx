import Link from 'next/link';
import { WHITEPAPER_URL } from '@/lib/links';

export function MovementFooter() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex flex-col items-center text-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:text-left text-xs text-muted-2 font-mono">
        <p className="m-0">&copy; {new Date().getFullYear()} we build real</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start">
          <Link href="/domains" className="hover:text-muted transition-colors">
            Public records
          </Link>
          <a href={WHITEPAPER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-muted transition-colors">
            Whitepaper
          </a>
        </nav>
      </div>
    </footer>
  );
}
