import Link from 'next/link';
import { COMPANY_SITE_URL } from '@/lib/site-urls';
import { linkMuted } from '@/lib/ui';

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex flex-col items-center text-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:text-left sm:gap-x-6 sm:gap-y-2 text-xs text-muted-2 font-mono">
        <p>
          © {new Date().getFullYear()}{' '}
          <a href={COMPANY_SITE_URL} className={linkMuted}>
            PBM Labs
          </a>
          <span aria-hidden="true"> · </span>
          <span className="text-unclaimed">Staging — not yet on-chain</span>
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start"
          aria-label="Site"
        >
          <Link href="/" className={linkMuted}>
            Home
          </Link>
          <Link href="/domains" className={linkMuted}>
            Records
          </Link>
          <Link href="/connect" className={linkMuted}>
            Connect
          </Link>
          <Link href="/disconnect" className={linkMuted}>
            Disconnect
          </Link>
        </nav>
      </div>
    </footer>
  );
}
