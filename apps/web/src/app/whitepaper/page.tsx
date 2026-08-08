import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { WhitepaperBody } from '@/components/whitepaper-body';
import { WHITEOBER_SOURCE_URL, loadWhitepaperMarkdown } from '@/lib/whitepaper';
import { eyebrow, linkMuted, pageTitle } from '@/lib/ui';

export const metadata = {
  title: 'Whitepaper — We build real',
  description:
    'PACT Protocol: an open provenance layer for independently verified domain history.',
};

export default async function WhitepaperPage() {
  const { markdown } = await loadWhitepaperMarkdown();

  return (
    <PageShell backHref="/" backLabel="Home" width="narrow">
      <header className="mb-10">
        <p className={`${eyebrow} mb-3`}>PACT Protocol</p>
        <h1 className={`${pageTitle} text-2xl sm:text-3xl mb-4`}>Whitepaper</h1>
        <p className="text-sm text-muted leading-relaxed max-w-xl">
          The open protocol behind the public record — how verified history is captured,
          published, and measured.
        </p>
        <p className="mt-4 text-xs font-mono text-muted-2">
          <a
            href={WHITEOBER_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkMuted} text-xs font-mono`}
          >
            Source on GitHub →
          </a>
        </p>
      </header>

      <WhitepaperBody markdown={markdown} />

      <p className="mt-12 pt-8 border-t border-border text-sm text-muted">
        Ready to start?{' '}
        <Link href="/how-it-works#add-your-domain" className="text-accent font-semibold no-underline hover:opacity-90">
          Add your domain
        </Link>
        {' · '}
        <Link href="/domains" className="text-accent font-semibold no-underline hover:opacity-90">
          Public records
        </Link>
      </p>
    </PageShell>
  );
}
