import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import {
  badgeAmber,
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
        <Link href="/how-it-works#add-your-domain" className={btnPrimary}>
          Try again
        </Link>
      </PageShell>
    );
  }

  const needsManualCheck = provider === 'manual' && dmarc.startsWith('v=DMARC1');
  const providerLabel = needsManualCheck ? 'Pending verification' : 'Cloudflare';
  const message = needsManualCheck
    ? 'Double-check you pasted the line below. This domain shows up on the public record automatically once the first independent check comes back, usually within a day.'
    : 'Added — nothing else to do. It just started building your record.';

  return (
    <PageShell backHref="/domains" backLabel="Records" centered width="narrow">
      <div className="mb-8">
        <span className={`${needsManualCheck ? badgeAmber : badgeVerified} mb-4`}>
          {needsManualCheck ? 'Pending' : 'Added'}
        </span>
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
            <li>An independent check usually arrives within a day.</li>
            <li>
              That&apos;s what confirms everything and adds this domain to the public record.
              Nothing else to click.
            </li>
            <li>From there, your trust score builds and updates on its own.</li>
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
