import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DisconnectSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const domain = typeof params.domain === 'string' ? params.domain : '';
  const provider = typeof params.provider === 'string' ? params.provider : 'cloudflare';
  const dmarc = typeof params.dmarc === 'string' ? params.dmarc : 'updated';

  if (!domain) {
    return (
      <PageShell backHref="/disconnect" backLabel="Disconnect" centered>
        <h1>Disconnected</h1>
        <p className="lead">Missing domain in redirect.</p>
        <Link href="/disconnect">Try again →</Link>
      </PageShell>
    );
  }

  const providerLabel = provider === 'manual' ? 'Manual DNS' : 'Cloudflare';
  const dnsMessage =
    provider === 'manual'
      ? 'Domain unregistered. Confirm you removed PACT from your _dmarc record at your DNS provider.'
      : dmarc === 'unchanged'
        ? '_dmarc no longer included PACT — DNS unchanged.'
        : 'Removed PACT from your _dmarc record via Cloudflare.';

  return (
    <PageShell backHref="/" centered>
      <span className="badge badge-waiting">Disconnected</span>
      <p className="eyebrow">{providerLabel}</p>
      <h1>{domain}</h1>
      <p className="lead">{dnsMessage}</p>

      <section className="section card left">
        <h2>What this means</h2>
        <ol className="steps steps-compact">
          <li>No new aggregate reports will arrive at PACT for this domain.</li>
          <li>
            Any trust score and Merkle history already published remains publicly visible as a
            historical record.
          </li>
          <li>
            To reconnect later, use <Link href="/connect">Connect</Link>.
          </li>
        </ol>
      </section>

      <p>
        <Link href="/" className="button-primary">
          Back to domains
        </Link>
      </p>
    </PageShell>
  );
}
