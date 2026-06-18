import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ConnectSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const domain = typeof params.domain === 'string' ? params.domain : '';
  const dmarc = typeof params.dmarc === 'string' ? params.dmarc : 'updated';

  if (!domain) {
    return (
      <PageShell backHref="/connect" backLabel="Connect" centered>
        <h1>Connected</h1>
        <p className="lead">Missing domain in redirect.</p>
        <Link href="/connect">Try again →</Link>
      </PageShell>
    );
  }

  const dmarcMessage =
    dmarc === 'unchanged'
      ? '_dmarc already pointed at PACT — no DNS change needed.'
      : dmarc === 'created'
        ? 'Created a new _dmarc record with PACT as report recipient.'
        : 'Updated _dmarc to include PACT as report recipient.';

  return (
    <PageShell backHref="/" centered>
      <span className="badge badge-live">Connected</span>
      <h1>{domain}</h1>
      <p className="lead">{dmarcMessage}</p>

      <section className="section card left">
        <h2>Next steps</h2>
        <ol className="steps steps-compact">
          <li>DMARC reporters pick up the new <code>_dmarc</code> within ~24 hours.</li>
          <li>First aggregate report arrives at PACT (not your inbox).</li>
          <li>
            <Link href={`/domain/${domain}`}>Open your domain page</Link> — it will show a
            provisional trust score after the first report.
          </li>
        </ol>
      </section>

      <p>
        <Link href={`/domain/${domain}`} className="button-primary">
          View {domain}
        </Link>
      </p>
    </PageShell>
  );
}
