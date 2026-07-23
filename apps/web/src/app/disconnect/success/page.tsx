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
        <p className="text-sm text-muted mt-2 mb-6">Something went missing from that link.</p>
        <Link href="/disconnect" className={btnPrimary}>
          Try again
        </Link>
      </PageShell>
    );
  }

  const providerLabel = provider === 'manual' ? 'Removed manually' : 'Cloudflare';
  const message =
    provider === 'manual'
      ? 'Removed. Double check you also took the line out wherever you manage that.'
      : dmarc === 'unchanged'
        ? 'Already removed — nothing else needed.'
        : 'Removed automatically via Cloudflare.';

  return (
    <PageShell backHref="/domains" backLabel="Records" centered width="narrow">
      <div className="mb-8">
        <span className={`${badgeMuted} mb-4`}>Disconnected</span>
        <h1 className={`${pageTitle} break-all`}>{domain}</h1>
        <p className="text-sm text-muted-2 font-mono mt-2">{providerLabel}</p>
        <p className="text-sm text-muted mt-3 max-w-md mx-auto">{message}</p>
      </div>

      <section className={`${panel} w-full text-left mb-8`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>What this means</h2>
          <ol className="text-sm text-muted space-y-2 pl-4 border-l border-border m-0">
            <li>No new verification will happen for this name.</li>
            <li>Its history stays publicly visible.</li>
            <li>You can add it back anytime.</li>
          </ol>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/domains" className={btnPrimary}>
          All records
        </Link>
        <Link href={`/how-it-works?domain=${encodeURIComponent(domain)}`} className={btnGhost}>
          Reconnect {domain}
        </Link>
      </div>
    </PageShell>
  );
}
