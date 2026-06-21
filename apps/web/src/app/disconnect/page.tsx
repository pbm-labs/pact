import { PACT_RUA_ADDRESS, PACT_RUA_MAILTO } from '@pact/core';
import { PageShell } from '@/components/page-shell';

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

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DisconnectPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorKey = typeof params.error === 'string' ? params.error : undefined;
  const domainPrefill = typeof params.domain === 'string' ? params.domain : '';
  const detail = typeof params.detail === 'string' ? params.detail : undefined;

  return (
    <PageShell backHref="/">
      <p className="eyebrow">Disconnect</p>
      <h1>Remove a domain</h1>
      <p className="hero-lead">
        Stops new DMARC reports from reaching PACT. Historical provenance data already ingested
        remains in the public record. Remove <code>{PACT_RUA_ADDRESS}</code> from your{' '}
        <code>_dmarc</code> record so mail providers stop sending reports.
      </p>

      {errorKey && (
        <div className="banner-error">
          <p>{ERRORS[errorKey] ?? 'Something went wrong.'}</p>
          {detail && <p className="error-detail">{detail}</p>}
        </div>
      )}

      <section className="section card">
        <h2>Cloudflare OAuth</h2>
        <p className="section-lead">
          PACT removes <code>{PACT_RUA_MAILTO}</code> from your <code>_dmarc</code> record and
          unregisters the domain.
        </p>
        <form className="connect-form" action="/api/disconnect/cloudflare" method="GET">
          <label htmlFor="cf-domain">Domain name</label>
          <input
            id="cf-domain"
            name="domain"
            type="text"
            placeholder="example.com"
            defaultValue={domainPrefill}
            required
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="button-primary">
            Disconnect with Cloudflare
          </button>
        </form>
      </section>

      <section className="section card">
        <h2>Manual DNS</h2>
        <p className="section-lead">
          Edit <code>_dmarc</code> at your DNS provider and remove{' '}
          <code>{PACT_RUA_MAILTO}</code> from the <code>rua=</code> list, then unregister below.
        </p>
        <form className="connect-form" action="/api/disconnect/manual" method="POST">
          <label htmlFor="manual-domain">Domain name</label>
          <input
            id="manual-domain"
            name="domain"
            type="text"
            placeholder="example.com"
            defaultValue={domainPrefill}
            required
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="button-secondary">
            Unregister domain (after DNS update)
          </button>
        </form>
      </section>
    </PageShell>
  );
}
