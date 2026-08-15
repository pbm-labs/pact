export function ledgerUrl(): string {
  return (process.env.LEDGER_URL ?? '').replace(/\/$/, '');
}

export function ledgerConfigured(): boolean {
  return Boolean(process.env.LEDGER_URL);
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

export interface LedgerDomainRow {
  domain: string;
  connected_at: string;
  domain_registered_at: string | null;
}

export interface LedgerLeafSummary {
  domain: string;
  dkim_pass_count: number;
  reporter_org: string;
  period_start: number;
}

export interface LedgerLeafRow {
  leaf_index: number;
  leaf_hash: string;
  domain: string;
  period_start: number;
  period_end: number;
  reporter_org: string;
  dkim_pass_count: number;
  dkim_fail_count: number;
  selectors: string;
  created_at: string;
}

export interface LedgerOnChain {
  root: string;
  leafCount: number;
  timestamp: number;
}

export async function fetchLedgerDomains(): Promise<{
  domains: LedgerDomainRow[];
  leaves: LedgerLeafSummary[];
} | null> {
  try {
    const res = await ledgerFetch('/v1/domains');
    if (!res.ok) return null;
    return (await res.json()) as { domains: LedgerDomainRow[]; leaves: LedgerLeafSummary[] };
  } catch {
    return null;
  }
}

export async function fetchLedgerDomain(domain: string): Promise<{
  domain: LedgerDomainRow;
  leaves: LedgerLeafRow[];
  globalLeaves: { leaf_index: number; leaf_hash: string }[];
  onChain: LedgerOnChain | null;
} | null> {
  try {
    const res = await ledgerFetch(`/v1/domains/${encodeURIComponent(domain)}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as {
      domain: LedgerDomainRow;
      leaves: LedgerLeafRow[];
      globalLeaves: { leaf_index: number; leaf_hash: string }[];
      onChain: LedgerOnChain | null;
    };
  } catch {
    return null;
  }
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
