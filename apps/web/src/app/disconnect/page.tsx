import { Suspense } from 'react';
import { PACT_RUA_ADDRESS } from '@pact/core';
import { PageShell } from '@/components/page-shell';
import { DnsPathFlow } from '@/components/dns-path-flow';
import { parseDisconnectPath } from '@/lib/connect-path';
import { alertError, eyebrow, inlineCode, pageIntro, pageTitle } from '@/lib/ui';

const ERRORS: Record<string, string> = {
  invalid_domain: 'Enter a valid domain name (e.g. example.com).',
  server_config: 'Server is missing CONNECT_STATE_SECRET or Supabase credentials.',
  oauth_not_configured: 'Cloudflare OAuth is not configured on this server.',
  missing_code: 'Authorization was cancelled or incomplete.',
  invalid_state: 'Session expired — try again.',
  token_exchange: 'Could not complete Cloudflare authorization.',
  zone_not_found:
    'This domain was not found in the Cloudflare account you authorized. Pick the account that hosts DNS for this zone.',
  dmarc_update: 'Could not update the _dmarc DNS record.',
  disconnect: 'Could not unregister this domain.',
};

function parsePath(value: string | undefined) {
  return parseDisconnectPath(value);
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DisconnectPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorKey = typeof params.error === 'string' ? params.error : undefined;
  const domainPrefill = typeof params.domain === 'string' ? params.domain : '';
  const detail = typeof params.detail === 'string' ? params.detail : undefined;
  const initialPath = parsePath(typeof params.path === 'string' ? params.path : undefined);

  return (
    <PageShell backHref="/domains" backLabel="Records" width="narrow">
      <header className="mb-8">
        <p className={`${eyebrow} mb-2`}>Disconnect</p>
        <h1 className={`${pageTitle} mb-2`}>Remove a domain</h1>
        <p className={pageIntro}>
          Stops new reports from reaching PACT. Historical data stays public. Remove{' '}
          <code className={inlineCode}>{PACT_RUA_ADDRESS}</code> from{' '}
          <code className={inlineCode}>_dmarc</code> so providers stop sending.
        </p>
      </header>

      {errorKey && (
        <div className={alertError}>
          <p className="m-0">{ERRORS[errorKey] ?? 'Something went wrong.'}</p>
          {detail && <p className="m-0 mt-2 font-normal text-rose-400/80 text-xs">{detail}</p>}
        </div>
      )}

      <Suspense fallback={<p className="text-sm text-muted-2">Loading…</p>}>
        <DnsPathFlow mode="disconnect" domainPrefill={domainPrefill} initialPath={initialPath} />
      </Suspense>
    </PageShell>
  );
}
