import Link from 'next/link';

export function MovementFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-[13px] text-muted-2">
        <p className="font-brand text-[10px] text-muted-2 m-0">PACT</p>
        <nav className="flex items-center gap-5">
          <Link href="/how-it-works" className="hover:text-muted transition-colors no-underline">
            How it works
          </Link>
          <Link href="/domains" className="hover:text-muted transition-colors no-underline">
            Public records
          </Link>
        </nav>
        <p className="lowercase m-0">we build real</p>
      </div>
    </footer>
  );
}
