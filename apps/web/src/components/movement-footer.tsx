const WHITEPAPER_URL = 'https://github.com/pbm-labs/pact-protocol/blob/main/white-paper.md';

export function MovementFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-3 text-center">
        <a
          href={WHITEPAPER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-2 hover:text-muted transition-colors no-underline"
        >
          Whitepaper
        </a>
        <p className="text-xs text-muted-2 m-0">
          &copy; {new Date().getFullYear()} we build real.
        </p>
      </div>
    </footer>
  );
}
