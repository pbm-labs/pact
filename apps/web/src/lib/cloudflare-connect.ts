import { addPactRuaToDmarc, removePactRuaFromDmarc } from '@pact/core';

const CF_API = 'https://api.cloudflare.com/client/v4';

export interface CfDnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
}

export interface CfZone {
  id: string;
  name: string;
}

async function cfFetch<T>(
  accessToken: string,
  path: string,
  init?: RequestInit,
): Promise<{ success: boolean; result: T; errors?: { message: string }[] }> {
  const res = await fetch(`${CF_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  return res.json() as Promise<{ success: boolean; result: T; errors?: { message: string }[] }>;
}

export async function findZoneForDomain(
  accessToken: string,
  domain: string,
): Promise<CfZone | null> {
  const data = await cfFetch<CfZone[]>(
    accessToken,
    `/zones?name=${encodeURIComponent(domain)}&status=active`,
  );
  if (!data.success || !data.result?.length) return null;
  const exact = data.result.find((z) => z.name.toLowerCase() === domain.toLowerCase());
  return exact ?? data.result[0] ?? null;
}

export async function listDmarcRecords(
  accessToken: string,
  zoneId: string,
  domain: string,
): Promise<CfDnsRecord[]> {
  const name = `_dmarc.${domain}`;
  const data = await cfFetch<CfDnsRecord[]>(
    accessToken,
    `/zones/${zoneId}/dns_records?type=TXT&name=${encodeURIComponent(name)}`,
  );
  if (!data.success) return [];
  return (data.result ?? []).filter((r) => r.content.toLowerCase().includes('v=dmarc1'));
}

export type DmarcUpdateResult =
  | { ok: true; action: 'created' | 'updated' | 'unchanged'; content: string }
  | { ok: false; error: string };

export async function ensurePactDmarcRecord(
  accessToken: string,
  zoneId: string,
  domain: string,
): Promise<DmarcUpdateResult> {
  const records = await listDmarcRecords(accessToken, zoneId, domain);
  const dmarcName = `_dmarc.${domain}`;

  if (!records.length) {
    const { content } = addPactRuaToDmarc(null);
    const created = await cfFetch<CfDnsRecord>(accessToken, `/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({ type: 'TXT', name: dmarcName, content, ttl: 1 }),
    });
    if (!created.success) {
      return { ok: false, error: created.errors?.[0]?.message ?? 'Failed to create _dmarc record' };
    }
    return { ok: true, action: 'created', content };
  }

  const primary = records[0]!;
  const { content, changed } = addPactRuaToDmarc(primary.content);
  if (!changed) {
    return { ok: true, action: 'unchanged', content };
  }

  const updated = await cfFetch<CfDnsRecord>(
    accessToken,
    `/zones/${zoneId}/dns_records/${primary.id}`,
    {
      method: 'PUT',
      body: JSON.stringify({ type: 'TXT', name: dmarcName, content, ttl: 1 }),
    },
  );
  if (!updated.success) {
    return { ok: false, error: updated.errors?.[0]?.message ?? 'Failed to update _dmarc record' };
  }
  return { ok: true, action: 'updated', content };
}

export async function removePactDmarcRecord(
  accessToken: string,
  zoneId: string,
  domain: string,
): Promise<DmarcUpdateResult> {
  const records = await listDmarcRecords(accessToken, zoneId, domain);
  if (!records.length) {
    return { ok: true, action: 'unchanged', content: '' };
  }

  const primary = records[0]!;
  const { content, changed } = removePactRuaFromDmarc(primary.content);
  if (!changed) {
    return { ok: true, action: 'unchanged', content: primary.content };
  }

  const dmarcName = `_dmarc.${domain}`;
  const updated = await cfFetch<CfDnsRecord>(
    accessToken,
    `/zones/${zoneId}/dns_records/${primary.id}`,
    {
      method: 'PUT',
      body: JSON.stringify({ type: 'TXT', name: dmarcName, content, ttl: 1 }),
    },
  );
  if (!updated.success) {
    return { ok: false, error: updated.errors?.[0]?.message ?? 'Failed to update _dmarc record' };
  }
  return { ok: true, action: 'updated', content };
}

export async function exchangeCloudflareCode(
  code: string,
  redirectUri: string,
): Promise<{ accessToken: string } | { error: string }> {
  const clientId = process.env.CLOUDFLARE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.CLOUDFLARE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return { error: 'Cloudflare OAuth is not configured on this server' };
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch('https://dash.cloudflare.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body,
  });

  const json = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !json.access_token) {
    return { error: json.error_description ?? json.error ?? 'Token exchange failed' };
  }

  return { accessToken: json.access_token };
}

export function cloudflareAuthorizeUrl(state: string, redirectUri: string): string | null {
  const clientId = process.env.CLOUDFLARE_OAUTH_CLIENT_ID;
  if (!clientId) return null;

  const scopes = process.env.CLOUDFLARE_OAUTH_SCOPES ?? 'dns.read dns.write';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    state,
  });

  return `https://dash.cloudflare.com/oauth2/auth?${params}`;
}
