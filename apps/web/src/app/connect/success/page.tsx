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
} from '@/lib/ui';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Reached only after a real Cloudflare connection: OAuth proved DNS control,
// so this domain was actually registered. The manual / email-tool paths skip
// this page entirely — they go straight to the domain's own page, since
// there's nothing to confirm until a real report arrives.
export default async function ConnectSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const domain = typeof params.domain === 'string' ? params.domain : '';

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

  return (
    <PageShell backHref="/domains" backLabel="Records" centered width="narrow">
      <div className="mb-8">
        <span className={`${badgeVerified} mb-4`}>Added</span>
        <h1 className={`${pageTitle} break-all`}>{domain}</h1>
        <p className="text-sm text-muted-2 font-mono mt-2">Cloudflare</p>
        <p className="text-sm text-muted mt-3 max-w-md mx-auto">
          Added, nothing else to do. It just started building your record.
        </p>
      </div>

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
