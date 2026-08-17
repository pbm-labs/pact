import { Buffer } from 'node:buffer';
import { dkimVerify } from 'mailauth/lib/dkim/verify.js';

export interface DkimPass {
  domain: string;
  selector: string;
}

export interface DkimCheck {
  passed: DkimPass[];
  results: {
    domain: string;
    selector: string;
    result: string;
    comment?: string;
  }[];
}

interface DohAnswer {
  type: number;
  data: string;
}

interface DohJson {
  Status?: number;
  Answer?: DohAnswer[];
}

/** DNS-over-HTTPS TXT lookup (Workers have no UDP DNS). */
export async function resolveTxtDoH(name: string): Promise<string[][]> {
  const url = new URL('https://cloudflare-dns.com/dns-query');
  url.searchParams.set('name', name);
  url.searchParams.set('type', 'TXT');
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/dns-json' },
  });
  if (!res.ok) {
    throw new Error(`doh ${res.status} for ${name}`);
  }
  const json = (await res.json()) as DohJson;
  const rcode = json.Status ?? 0;
  // FORMERR / SERVFAIL / NOTIMP / REFUSED — retry the email, do not discard.
  if (rcode === 1 || rcode === 2 || rcode === 4 || rcode === 5) {
    throw new Error(`doh rcode ${rcode} for ${name}`);
  }
  const answers = json.Answer ?? [];
  return answers
    .filter((row) => row.type === 16)
    .map((row) => [parseDohTxt(row.data)]);
}

function parseDohTxt(data: string): string {
  return data.replace(/"\s*"/g, '').replace(/^"|"$/g, '');
}

/** Email Routing often hands the Worker LF-normalized RFC822. DKIM wants CRLF. */
export function ensureCrlf(raw: Uint8Array): Uint8Array {
  let extra = 0;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === 0x0a && (i === 0 || raw[i - 1] !== 0x0d)) extra += 1;
  }
  if (!extra) return raw;
  const out = new Uint8Array(raw.length + extra);
  let j = 0;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === 0x0a && (i === 0 || raw[i - 1] !== 0x0d)) out[j++] = 0x0d;
    out[j++] = raw[i]!;
  }
  return out;
}

/**
 * Cryptographically verify DKIM signatures on the wrapper RFC822 message.
 * Passing `d=` domains are the witness that the report came from that signer.
 */
export async function verifyWrapperDkim(
  raw: Uint8Array,
  resolver: (name: string) => Promise<string[][]> = resolveTxtDoH,
): Promise<DkimCheck> {
  const verified = await dkimVerify(Buffer.from(ensureCrlf(raw)), {
    resolver: async (name: string, type: string) => {
      if (String(type).toUpperCase() !== 'TXT') return [];
      return resolver(name);
    },
  });

  const results = (verified.results ?? [])
    .filter((row) => row.signingDomain)
    .map((row) => ({
      domain: String(row.signingDomain).toLowerCase(),
      selector: String(row.selector ?? ''),
      result: String(row.status?.result ?? 'none'),
      comment: row.status?.comment ? String(row.status.comment) : undefined,
    }));

  const passed = results
    .filter((row) => row.result === 'pass')
    .map((row) => ({ domain: row.domain, selector: row.selector }));

  if (
    !passed.length &&
    results.some((row) => row.result === 'temperror' || row.result === 'temperr')
  ) {
    throw new Error(
      `dkim temperror: ${results.map((row) => `${row.domain}=${row.result}`).join(',')}`,
    );
  }

  return { passed, results };
}

export interface DkimKeySnapshot {
  domain: string;
  selector: string;
  name: string;
  txt: string[] | null;
  error?: string;
  lookedUpAt: string;
}

/** Snapshot `selector._domainkey.domain` TXT at ingest so a later recheck is not stuck on rotated keys. */
export async function snapshotWrapperDkimKeys(
  ids: readonly { domain: string; selector: string }[],
  resolver: (name: string) => Promise<string[][]> = resolveTxtDoH,
): Promise<DkimKeySnapshot[]> {
  const out: DkimKeySnapshot[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    const domain = id.domain.trim().toLowerCase();
    const selector = id.selector.trim().toLowerCase();
    if (!domain || !selector) continue;
    const name = `${selector}._domainkey.${domain}`;
    if (seen.has(name)) continue;
    seen.add(name);
    const lookedUpAt = new Date().toISOString();
    try {
      const rows = await resolver(name);
      const txt = rows.map((row) => row.join('')).filter(Boolean);
      out.push({
        domain,
        selector,
        name,
        txt: txt.length ? txt : null,
        lookedUpAt,
        ...(txt.length ? {} : { error: 'no key' }),
      });
    } catch (err) {
      const message = String(err);
      if (message.includes('doh rcode') || message.includes('doh ')) throw err;
      out.push({ domain, selector, name, txt: null, error: message, lookedUpAt });
    }
  }
  return out;
}
