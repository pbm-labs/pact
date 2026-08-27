import { resolveDomainRegisteredAt } from '@/lib/domain-age';
import { registerLedgerDomain } from '@/lib/ledger';

export async function registerDomain(
  domain: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  let domainRegisteredAt: string | null = null;
  const resolved = await resolveDomainRegisteredAt(domain);
  if (resolved != null) {
    domainRegisteredAt = new Date(resolved).toISOString();
  }
  return registerLedgerDomain(domain, domainRegisteredAt);
}

export async function ensureDomainRegisteredAt(
  domain: string,
  existing: string | null | undefined,
): Promise<string | null> {
  if (existing) return existing;
  const resolved = await resolveDomainRegisteredAt(domain);
  if (resolved == null) return null;
  const iso = new Date(resolved).toISOString();
  await registerLedgerDomain(domain, iso);
  return iso;
}
