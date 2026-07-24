import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import {
  badgeVerified,
  btnGhost,
  btnPrimary,
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
      <PageShell backHref="/how-it-works" backLabel="Connect" centered width="narrow">
        <h1 className={pageTitle}>Connected</h1>
        <p className="text-sm text-muted mt-2 mb-6">Something went missing from that link — let&apos;s try again.</p>
        <Link href="/how-it-works#add-your-name" className={btnPrimary}>
          Try again
        </Link>
      </PageShell>
    );
  }

  const providerLabel = provider === 'manual' ? 'Added manually' : 'Cloudflare';
  const needsManualCheck = provider === 'manual' && dmarc.startsWith('v=DMARC1');
  const message = needsManualCheck
    ? 'Added. Double check you pasted the line from the last step wherever you manage that.'
    : 'Added — nothing else to do. It just started building your record.';

  return (
    <PageShell backHref="/domains" backLabel="Records" centered width="narrow">
      <div className="mb-8">
        <span className={`${badgeVerified} mb-4`}>Added</span>
        <h1 className={`${pageTitle} break-all`}>{domain}</h1>
        <p className="text-sm text-muted-2 font-mono mt-2">{providerLabel}</p>
        <p className="text-sm text-muted mt-3 max-w-md mx-auto">{message}</p>
      </div>

      {needsManualCheck && (
        <section className={`${panel} w-full text-left mb-4`}>
          <div className={panelBody}>
            <h2 className={panelSectionTitle}>What to paste</h2>
            <pre className={snippetPre}>{dmarc}</pre>
          </div>
        </section>
      )}

      <section className={`${panel} w-full text-left mb-8`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>What happens next</h2>
          <ol className="text-sm text-muted space-y-2 pl-4 border-l border-border m-0">
            <li>Your name gets independently noticed, usually within a day.</li>
            <li>It quietly confirms everything checks out.</li>
            <li>Your page shows a trust score that grows from there.</li>
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
