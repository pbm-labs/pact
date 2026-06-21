import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand">
          <span className="site-brand-mark">PACT</span>
          <span className="site-brand-sub">Protocol</span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link href="/domains">Domains</Link>
          <Link href="/connect" className="site-nav-cta">
            Connect
          </Link>
          <Link href="/disconnect">Disconnect</Link>
        </nav>
      </div>
    </header>
  );
}
