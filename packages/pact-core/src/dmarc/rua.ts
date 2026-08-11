export const PACT_RUA_ADDRESS = 'rua@webuildreal.dev';
export const PACT_RUA_MAILTO = `mailto:${PACT_RUA_ADDRESS}`;

/** Previous intake host — still accepted so existing DMARC records keep working. */
export const PACT_RUA_LEGACY_ADDRESSES = ['rua@pact.pbm-labs.com'] as const;

const PACT_RUA_ACCEPTED = [PACT_RUA_ADDRESS, ...PACT_RUA_LEGACY_ADDRESSES] as const;

/** Canonical first, then legacy — both receive aggregate reports during the transition. */
export const PACT_RUA_MAILTOS = [
  PACT_RUA_MAILTO,
  ...PACT_RUA_LEGACY_ADDRESSES.map((address) => `mailto:${address}` as const),
] as const;

const TAG_ORDER = ['v', 'p', 'sp', 'adkim', 'aspf', 'pct', 'rua', 'ruf', 'np'] as const;

export function parseDmarcTags(record: string): Map<string, string> {
  const content = record.trim().replace(/^"|"$/g, '');
  const tags = new Map<string, string>();
  for (const part of content.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    tags.set(trimmed.slice(0, eq).trim().toLowerCase(), trimmed.slice(eq + 1).trim());
  }
  return tags;
}

export function serializeDmarcTags(tags: Map<string, string>): string {
  const used = new Set<string>();
  const parts: string[] = [];
  for (const key of TAG_ORDER) {
    const val = tags.get(key);
    if (val !== undefined) {
      parts.push(`${key}=${val}`);
      used.add(key);
    }
  }
  for (const [key, val] of tags) {
    if (!used.has(key)) parts.push(`${key}=${val}`);
  }
  return parts.join('; ');
}

export function dmarcIncludesPactRua(record: string): boolean {
  const rua = parseDmarcTags(record).get('rua') ?? '';
  return PACT_RUA_ACCEPTED.some((address) => rua.includes(address));
}

function withAllPactRuas(rua: string): { rua: string; changed: boolean } {
  let next = rua;
  let changed = false;
  for (const mailto of PACT_RUA_MAILTOS) {
    const address = mailto.slice('mailto:'.length);
    if (!next.includes(address)) {
      next = next ? `${next},${mailto}` : mailto;
      changed = true;
    }
  }
  return { rua: next, changed };
}

/** Add PACT rua= addresses (canonical + legacy) to an existing _dmarc TXT value. */
export function addPactRuaToDmarc(record: string | null | undefined): {
  content: string;
  changed: boolean;
} {
  const base = record?.trim().replace(/^"|"$/g, '') ?? '';
  if (!base) {
    return {
      content: `v=DMARC1; p=none; rua=${PACT_RUA_MAILTOS.join(',')}`,
      changed: true,
    };
  }

  const tags = parseDmarcTags(base);
  if (!tags.has('v')) tags.set('v', 'DMARC1');

  const { rua, changed } = withAllPactRuas(tags.get('rua') ?? '');
  if (!changed) {
    return { content: serializeDmarcTags(tags), changed: false };
  }

  tags.set('rua', rua);
  return { content: serializeDmarcTags(tags), changed: true };
}
