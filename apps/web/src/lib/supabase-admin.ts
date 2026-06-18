import { createClient } from '@supabase/supabase-js';

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

  const { error } = await supabase.from('domains').upsert({ domain });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
