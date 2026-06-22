import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import {
  badgeMuted,
  btnGhost,
  btnPrimary,
  pageTitle,
  panel,
  panelBody,
  panelSectionTitle,
} from '@/lib/ui';

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
      <PageShell backHref="/disconnect" backLabel="Disconnect" centered width="narrow">
        <h1 className={pageTitle}>Disconnected</h1>
        <p className="text-sm text-muted mt-2 mb-6">Missing domain in redirect.</p>
        <Link href="/disconnect" className={btnPrimary}>
          Try again
        </Link>
      </PageShell>
    );
  }

  const providerLabel = provider === 'manual' ? 'Manual DNS' : 'Cloudflare';
  const dnsMessage =
    provider === 'manual'
      ? 'Domain unregistered. Confirm you removed PACT from _dmarc at your DNS provider.'
      : dmarc === 'unchanged'
        ? '_dmarc no longer included PACT — DNS unchanged.'
        : 'Removed PACT from _dmarc via Cloudflare.';

  return (
    <PageShell backHref="/domains" backLabel="Records" centered width="narrow">
      <div className="mb-8">
        <span className={`${badgeMuted} mb-4`}>Disconnected</span>
        <h1 className={`${pageTitle} break-all`}>{domain}</h1>
        <p className="text-sm text-muted-2 font-mono mt-2">{providerLabel}</p>
        <p className="text-sm text-muted mt-3 max-w-md mx-auto">{dnsMessage}</p>
      </div>

      <section className={`${panel} w-full text-left mb-8`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>What this means</h2>
          <ol className="text-sm text-muted space-y-2 pl-4 border-l border-border m-0">
            <li>No new reports will arrive for this domain.</li>
            <li>Historical provenance data remains publicly visible.</li>
            <li>You can reconnect anytime from the connect flow.</li>
          </ol>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/domains" className={btnPrimary}>
          All records
        </Link>
        <Link href={`/connect?domain=${encodeURIComponent(domain)}`} className={btnGhost}>
          Reconnect {domain}
        </Link>
      </div>
    </PageShell>
  );
}
