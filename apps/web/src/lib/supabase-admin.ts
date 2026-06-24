import { createClient } from '@supabase/supabase-js';
import { resolveDomainRegisteredAt } from '@/lib/domain-age';

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function registerDomain(domain: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: 'Server not configured (missing Supabase credentials)' };
  }

  const { data: existing } = await supabase
    .from('domains')
    .select('domain_registered_at')
    .eq('domain', domain)
    .maybeSingle();

  let domainRegisteredAt: string | null = existing?.domain_registered_at ?? null;
  if (!domainRegisteredAt) {
    const resolved = await resolveDomainRegisteredAt(domain);
    if (resolved != null) {
      domainRegisteredAt = new Date(resolved).toISOString();
    }
  }

  const row: {
    domain: string;
    disconnected_at: null;
    domain_registered_at?: string;
  } = { domain, disconnected_at: null };

  if (domainRegisteredAt) {
    row.domain_registered_at = domainRegisteredAt;
  }

  const { error } = await supabase.from('domains').upsert(row, { onConflict: 'domain' });
  if (error?.code === '42703') {
    const { error: fallbackError } = await supabase
      .from('domains')
      .upsert({ domain, disconnected_at: null }, { onConflict: 'domain' });
    if (fallbackError) return { ok: false, error: fallbackError.message };
    return { ok: true };
  }
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function ensureDomainRegisteredAt(
  domain: string,
  existing: string | null | undefined,
): Promise<string | null> {
  if (existing) return existing;

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const resolved = await resolveDomainRegisteredAt(domain);
  if (resolved == null) return null;

  const iso = new Date(resolved).toISOString();
  const { error } = await supabase
    .from('domains')
    .update({ domain_registered_at: iso })
    .eq('domain', domain);
  if (error?.code === '42703') return null;
  return iso;
}

export async function disconnectDomain(
  domain: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: 'Server not configured (missing Supabase credentials)' };
  }

  const { data: row, error: fetchError } = await supabase
    .from('domains')
    .select('domain')
    .eq('domain', domain)
    .maybeSingle();

  if (fetchError) return { ok: false, error: fetchError.message };
  if (!row) return { ok: false, error: 'Domain is not registered with PACT' };

  const { error } = await supabase
    .from('domains')
    .update({ disconnected_at: new Date().toISOString() })
    .eq('domain', domain);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
