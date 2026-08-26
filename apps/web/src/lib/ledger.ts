export function ledgerUrl(): string {
  return (process.env.LEDGER_URL ?? '').replace(/\/$/, '');
}

async function ledgerFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${ledgerUrl()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  });
}

export async function registerLedgerDomain(
  domain: string,
  domainRegisteredAt?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.LEDGER_WRITE_SECRET ?? process.env.CONNECT_STATE_SECRET;
  if (!secret) {
    return { ok: false, error: 'Server not configured (missing ledger write secret)' };
  }
  try {
    const res = await ledgerFetch('/v1/domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        domain,
        domain_registered_at: domainRegisteredAt ?? null,
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: body.error ?? `ledger ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
