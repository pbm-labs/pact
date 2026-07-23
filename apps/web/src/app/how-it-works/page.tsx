import { Suspense } from 'react';
import Link from 'next/link';
import { addPactRuaToDmarc, PACT_RUA_ADDRESS } from '@pact/core';
import { DnsPathFlow } from '@/components/dns-path-flow';
import { Reveal } from '@/components/reveal';
import { parseConnectPath } from '@/lib/connect-path';
import { alertError, eyebrow, linkAccent, sectionTitle } from '@/lib/ui';

const PROTOCOL_SPEC_URL =
  'https://github.com/pbm-labs/pact/blob/main/docs/pact_protocol_v01.md';

const ERRORS: Record<string, string> = {
  invalid_domain: 'Enter a valid domain name (e.g. example.com).',
  server_config: 'Server is missing CONNECT_STATE_SECRET or Supabase credentials.',
  oauth_not_configured: 'Cloudflare OAuth is not configured on this server.',
  missing_code: 'Authorization was cancelled or incomplete.',
  invalid_state: 'Session expired — try connecting again.',
  token_exchange: 'Could not complete Cloudflare authorization.',
  zone_not_found:
    'This domain was not found in the Cloudflare account you authorized. Pick the account that hosts DNS for this zone.',
  dmarc_update: 'Could not update the _dmarc DNS record.',
  register: 'DNS updated but domain registration failed.',
};

const PROSE = 'text-[18px] leading-[1.8] text-muted';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = {
  title: 'How this works — We build real',
  description: 'How a name gets added to the foundation — plain language first, then the connect flow.',
};

function StepMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-h font-mono text-[0.65rem] text-muted-2">
        {number}
      </span>
      <p className={`${eyebrow} m-0`}>{label}</p>
    </div>
  );
}

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
        <Reveal>
          <section className="mb-14 sm:mb-16">
            <StepMarker number="01" label="Why this exists" />
            <h1 className={`${sectionTitle} text-2xl sm:text-3xl text-txt mb-6 font-bold tracking-tight`}>
              How a name gets added to the foundation
            </h1>
            <div className={PROSE}>
              <p className="mb-5">
                Every business already sends email — invoices, receipts, updates, replies. Every time
                it does, the mail systems that receive it (the ones running Gmail, Outlook, and
                hundreds of others) already check, quietly, whether that email really came from who it
                claims to be from. They&apos;ve been doing this since long before any of us thought to
                use it for anything.
              </p>
              <p className="mb-5">
                What&apos;s never existed is a place that keeps that proof — permanently, publicly, in
                a way nobody can fake or take back.
              </p>
              <p className="mb-5">
                That&apos;s what adding your name does. It doesn&apos;t change how your business sends
                email. It doesn&apos;t require reading anyone&apos;s messages, because no message is
                ever read — only the proof that the check happened. It simply starts keeping a
                permanent, public record that your name has been showing up, honestly, for as long as
                you&apos;ve been part of this.
              </p>
              <p className="mb-0">
                The longer that record grows, the more solid the ground underneath your name becomes.
                And it can only ever move forward from today — which is exactly why doing this today
                matters more than doing it later.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-14 sm:mb-16 pt-10 border-t border-border">
            <StepMarker number="02" label="What this never sees" />
            <div className={PROSE}>
              <p className="mb-5">
                No email content. No messages. No customer names or addresses. Nothing private, ever.
              </p>
              <p className="mb-0">
                What gets kept is much smaller than that: just a record that says &ldquo;this
                name&apos;s mail checked out, on this day, according to mail systems that already do
                this anyway.&rdquo; That&apos;s all it&apos;s ever allowed to be.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-14 sm:mb-16 pt-10 border-t border-border">
            <StepMarker number="03" label="Under the hood" />
            <p className={`${PROSE} mb-0`}>
              Under the hood, this runs on PACT Protocol — an open, freely verifiable system built on
              DMARC, the email authentication standard mail providers already use. Nothing about PACT
              requires trusting PBM Labs, the team that built it: every record it keeps can be checked
              independently by anyone, against a public ledger no single party controls.
            </p>
            <p className="text-sm text-muted-2 mt-4">
              If you want the full technical specification, it&apos;s public:{' '}
              <a href={PROTOCOL_SPEC_URL} className={linkAccent} target="_blank" rel="noopener noreferrer">
                PACT Protocol specification
              </a>
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section
            id="add-your-name"
            className="mb-14 sm:mb-16 pt-10 border-t-2 border-border scroll-mt-8"
          >
            <StepMarker number="04" label="The mechanism — starts here" />
            <h2 className={`${sectionTitle} text-xl text-txt mb-2`}>Add your name</h2>
            <p className="text-sm text-muted mb-6">Most businesses connect in under two minutes.</p>

            {errorKey && (
              <div className={alertError}>
                <p className="m-0">{ERRORS[errorKey] ?? 'Something went wrong.'}</p>
                {detail && (
                  <p className="m-0 mt-2 font-normal text-rose-400/80 text-xs">{detail}</p>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-border bg-surface/60 p-4 sm:p-6">
              <Suspense fallback={<p className="text-sm text-muted-2">Loading…</p>}>
                <DnsPathFlow
                  mode="connect"
                  variant="movement"
                  domainPrefill={domainPrefill}
                  dmarcSnippet={dmarcSnippet}
                  ruaAddress={PACT_RUA_ADDRESS}
                  initialPath={initialPath}
                />
              </Suspense>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="pt-10 border-t border-border">
            <StepMarker number="05" label="What happens next" />
            <div className={PROSE}>
              <p className="mb-5">
                Once you&apos;re connected, nothing changes about how your business sends email. In the
                background, your name&apos;s record starts building — quietly, automatically, for
                good.
              </p>
              <p className="mb-0">
                You&apos;ll be able to see it grow on the{' '}
                <Link href="/domains" className={linkAccent}>
                  public record page
                </Link>
                .
              </p>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
