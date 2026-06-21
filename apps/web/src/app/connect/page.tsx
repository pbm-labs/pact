import Link from 'next/link';
import { addPactRuaToDmarc, PACT_RUA_ADDRESS, PACT_RUA_MAILTO } from '@pact/core';
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

  const { content: newDmarcSnippet } = addPactRuaToDmarc(null);

  return (
    <PageShell backHref="/">
      <p className="eyebrow">Connect</p>
      <h1>Add a domain</h1>
      <p className="hero-lead">
        Two paths — pick whichever matches your DNS setup. PACT only touches your{' '}
        <code>_dmarc</code> TXT record. Reports go to <code>{PACT_RUA_ADDRESS}</code>, not your
        inbox.
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
          Lowest friction — for domains on Cloudflare DNS. One authorization click; PACT adds{' '}
          <code>{PACT_RUA_MAILTO}</code> to your existing <code>_dmarc</code> record.
        </p>
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
            Connect with Cloudflare
          </button>
        </form>
      </section>

      <section className="section card">
        <h2>Manual DNS</h2>
        <p className="section-lead">
          For GoDaddy, Namecheap, Google Domains, Route 53 console, or any other DNS host. Add PACT
          to <code>_dmarc</code>, then register.
        </p>
        <div className="dmarc-snippet">
          <p className="muted left">
            Host: <code>_dmarc.yourdomain.com</code> · Type: <code>TXT</code>
          </p>
          <p className="muted left">
            If you already have a <code>_dmarc</code> record, add{' '}
            <code>{PACT_RUA_MAILTO}</code> to the existing <code>rua=</code> list (comma-separated).
            Otherwise use this minimal record:
          </p>
          <pre className="snippet-code">{newDmarcSnippet}</pre>
        </div>
        <form className="connect-form" action="/api/connect/manual" method="POST">
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
            Register domain (after DNS update)
          </button>
        </form>
      </section>

      <p className="meta">
        <Link href="/disconnect" className="text-link">
          Disconnect a domain →
        </Link>
      </p>
    </PageShell>
  );
}
