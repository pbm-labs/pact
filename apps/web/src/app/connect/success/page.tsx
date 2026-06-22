import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import {
  badgeVerified,
  btnGhost,
  btnPrimary,
  inlineCode,
  pageTitle,
  panel,
  panelBody,
  panelSectionTitle,
  snippetPre,
} from '@/lib/ui';

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
      <PageShell backHref="/connect" backLabel="Connect" centered width="narrow">
        <h1 className={pageTitle}>Connected</h1>
        <p className="text-sm text-muted mt-2 mb-6">Missing domain in redirect.</p>
        <Link href="/connect" className={btnPrimary}>
          Try again
        </Link>
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
            ? 'Update _dmarc with the snippet from the connect flow, if you have not already.'
            : 'Updated _dmarc to include PACT as report recipient.';

  return (
    <PageShell backHref="/domains" backLabel="Records" centered width="narrow">
      <div className="mb-8">
        <span className={`${badgeVerified} mb-4`}>Connected</span>
        <h1 className={`${pageTitle} break-all`}>{domain}</h1>
        <p className="text-sm text-muted-2 font-mono mt-2">{providerLabel}</p>
        <p className="text-sm text-muted mt-3 max-w-md mx-auto">{dmarcMessage}</p>
      </div>

      {provider === 'manual' && dmarc.startsWith('v=DMARC1') && (
        <section className={`${panel} w-full text-left mb-4`}>
          <div className={panelBody}>
            <h2 className={panelSectionTitle}>Expected _dmarc value</h2>
            <pre className={snippetPre}>{dmarc}</pre>
          </div>
        </section>
      )}

      <section className={`${panel} w-full text-left mb-8`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>What happens next</h2>
          <ol className="text-sm text-muted space-y-2 pl-4 border-l border-border m-0">
            <li>
              Mail providers pick up <code className={inlineCode}>_dmarc</code> within ~24 hours.
            </li>
            <li>First aggregate report arrives at PACT.</li>
            <li>Your domain page shows a provisional trust score.</li>
          </ol>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href={`/domain/${domain}`} className={btnPrimary}>
          View {domain}
        </Link>
        <Link href="/domains" className={btnGhost}>
          All records
        </Link>
      </div>
    </PageShell>
  );
}
