import Link from 'next/link';

export function MovementFooter() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex flex-col items-center gap-3 text-center text-xs text-muted-2 font-mono">
        <p className="m-0">&copy; {new Date().getFullYear()} we build real</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/terms" className="hover:text-muted no-underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-muted no-underline">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
