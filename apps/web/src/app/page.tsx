import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { SiteNarrative } from '@/components/site-narrative';

export default function HomePage() {
  return (
    <PageShell>
      <header className="hero">
        <p className="eyebrow">PACT Protocol</p>
        <SiteNarrative />
      </header>

      <section className="section narrative-bridge">
        <p className="bridge-lead">
          PACT lays that cornerstone one domain at a time — a public, verifiable history built from
          the authentication signals mail providers already send. No message content. One honest day
          at a time.
        </p>
        <p className="bridge-actions bridge-actions-row">
          <Link href="/connect" className="button-primary">
            Connect a domain
          </Link>
          <Link href="/domains" className="text-link">
            View live records →
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
