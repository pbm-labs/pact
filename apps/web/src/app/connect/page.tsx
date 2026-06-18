import { PACT_RUA_ADDRESS } from '@pact/core';
import { PageShell } from '@/components/page-shell';

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

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ConnectPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorKey = typeof params.error === 'string' ? params.error : undefined;
  const domainPrefill = typeof params.domain === 'string' ? params.domain : '';
  const detail = typeof params.detail === 'string' ? params.detail : undefined;

  return (
    <PageShell backHref="/">
      <p className="eyebrow">Connect</p>
      <h1>Add a domain</h1>
      <p className="hero-lead">
        PACT only edits your <code>_dmarc</code> TXT record — nothing else in DNS. Reports go to{' '}
        <code>{PACT_RUA_ADDRESS}</code>, not your inbox.
      </p>

      {errorKey && (
        <div className="banner-error">
          <p>{ERRORS[errorKey] ?? 'Something went wrong.'}</p>
          {detail && <p className="error-detail">{detail}</p>}
        </div>
      )}

      <section className="section card">
        <h2>1. Enter your domain</h2>
        <form className="connect-form" action="/api/connect/cloudflare" method="GET">
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
            Continue with Cloudflare
          </button>
        </form>
      </section>

      <section className="section card">
        <h2>2. Authorize on Cloudflare</h2>
        <p className="muted left">
          You will be asked to sign in and grant <strong>DNS Read</strong> and{' '}
          <strong>DNS Edit</strong> for the account that owns this zone. PACT cannot read email or
          change any record except <code>_dmarc</code>.
        </p>
      </section>

      <section className="section card">
        <h2>3. Wait for reports</h2>
        <p className="muted left">
          Within 24–48 hours, mail providers send the first aggregate report. Your domain page will
          switch from &ldquo;Awaiting reports&rdquo; to a live trust score.
        </p>
      </section>
    </PageShell>
  );
}
