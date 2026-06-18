import Link from 'next/link';
import { COMPANY_SITE_URL } from '@/lib/site-urls';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand">
          <span className="site-brand-mark">PACT</span>
          <span className="site-brand-sub">Protocol</span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link href="/">Domains</Link>
          <Link href="/connect" className="site-nav-cta">
            Connect
          </Link>
          <a href={COMPANY_SITE_URL} className="site-nav-external">
            PBM Labs
          </a>
        </nav>
      </div>
    </header>
  );
}
