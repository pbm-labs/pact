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

/**
 * Cryptographically verify DKIM signatures on the wrapper RFC822 message.
 * Passing `d=` domains are the witness that the report came from that signer.
 */
export async function verifyWrapperDkim(
  raw: Uint8Array,
  resolver: (name: string) => Promise<string[][]> = resolveTxtDoH,
): Promise<DkimCheck> {
  const verified = await dkimVerify(Buffer.from(raw), {
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
