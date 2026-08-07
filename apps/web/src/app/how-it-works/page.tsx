import { Suspense } from 'react';
import Link from 'next/link';
import { addPactRuaToDmarc, PACT_RUA_ADDRESS } from '@pact/core';
import { DnsPathFlow } from '@/components/dns-path-flow';
import { Reveal } from '@/components/reveal';
import { parseConnectPath } from '@/lib/connect-path';
import { alertError, eyebrow, pageTitle } from '@/lib/ui';

const ERRORS: Record<string, string> = {
  invalid_domain: 'Enter a valid domain (e.g. example.com).',
  server_config: 'Server is missing CONNECT_STATE_SECRET or Supabase credentials.',
  oauth_not_configured: 'Cloudflare sign-in is not configured on this server.',
  missing_code: 'Sign-in was cancelled or incomplete.',
  invalid_state: 'Session expired — try connecting again.',
  token_exchange: 'Could not finish connecting to Cloudflare.',
  zone_not_found: 'This domain wasn\u2019t found in the Cloudflare account you picked. Try a different account.',
  dmarc_update: 'Could not finish setting this up automatically. Try the manual option instead.',
  register: 'Almost there — the last step failed. Try again.',
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = {
  title: 'Add your domain — We build real',
  description: 'Connect your domain and start building a public, honest record — in about two minutes.',
};

export default async function HowItWorksPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorKey = typeof params.error === 'string' ? params.error : undefined;
  const domainPrefill = typeof params.domain === 'string' ? params.domain : '';
  const detail = typeof params.detail === 'string' ? params.detail : undefined;
  const initialPath = parseConnectPath(typeof params.path === 'string' ? params.path : undefined);

  const { content: dmarcSnippet } = addPactRuaToDmarc(null);

  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <header id="add-your-domain" className="mb-8 sm:mb-10 scroll-mt-8">
              <p className={`${eyebrow} mb-3`}>Two minutes, mostly automatic</p>
              <h1 className={`${pageTitle} text-2xl sm:text-3xl mb-4`}>Add your domain</h1>
              <p className="text-base text-muted leading-relaxed">
                No paperwork, no waiting on anyone. Just the first day of a history that&apos;s
                genuinely yours.
              </p>
            </header>
          </Reveal>

          <Reveal delay={60}>
            <section>
              {errorKey && (
                <div className={alertError}>
                  <p className="m-0">{ERRORS[errorKey] ?? 'Something went wrong.'}</p>
                  {detail && (
                    <p className="m-0 mt-2 font-normal text-rose-400/80 text-xs">{detail}</p>
                  )}
                </div>
              )}

              <Suspense fallback={<p className="text-sm text-muted-2">Loading…</p>}>
                <DnsPathFlow
                  variant="movement"
                  domainPrefill={domainPrefill}
                  dmarcSnippet={dmarcSnippet}
                  ruaAddress={PACT_RUA_ADDRESS}
                  initialPath={initialPath}
                />
              </Suspense>
            </section>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-sm text-muted mt-10 pt-8 border-t border-border leading-relaxed">
              Once you&apos;re connected, there&apos;s nothing else to do. Your record builds
              quietly in the background, for good — you can check on it anytime from the{' '}
              <Link
                href="/domains"
                className="text-txt underline underline-offset-2 decoration-border-h hover:decoration-txt transition-colors"
              >
                public record
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
