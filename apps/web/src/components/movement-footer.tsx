import Link from 'next/link';

export function MovementFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-3 text-center">
        <Link
          href="/whitepaper"
          className="text-xs text-muted-2 hover:text-muted transition-colors no-underline"
        >
          Whitepaper
        </Link>
        <p className="text-xs text-muted-2 m-0">
          &copy; {new Date().getFullYear()} we build real.
        </p>
      </div>
    </footer>
  );
}
