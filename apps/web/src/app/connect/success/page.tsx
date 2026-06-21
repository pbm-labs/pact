import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ConnectSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const domain = typeof params.domain === 'string' ? params.domain : '';
  const provider = typeof params.provider === 'string' ? params.provider : 'cloudflare';
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

  const providerLabel = provider === 'manual' ? 'Manual DNS' : 'Cloudflare';
  const dmarcMessage =
    provider === 'manual'
      ? 'Domain registered. Confirm your _dmarc TXT record includes PACT as report recipient.'
      : dmarc === 'unchanged'
        ? '_dmarc already pointed at PACT — no DNS change needed.'
        : dmarc === 'created'
          ? 'Created a new _dmarc record with PACT as report recipient.'
          : dmarc.startsWith('v=DMARC1')
            ? 'Update _dmarc with the snippet from the connect page, if you have not already.'
            : 'Updated _dmarc to include PACT as report recipient.';

  return (
    <PageShell backHref="/" centered>
      <span className="badge badge-live">Connected</span>
      <p className="eyebrow">{providerLabel}</p>
      <h1>{domain}</h1>
      <p className="lead">{dmarcMessage}</p>
      {provider === 'manual' && dmarc.startsWith('v=DMARC1') && (
        <section className="section card left">
          <h2>Expected _dmarc value</h2>
          <pre className="snippet-code">{dmarc}</pre>
        </section>
      )}

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
