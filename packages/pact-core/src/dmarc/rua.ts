export const PACT_RUA_ADDRESS = 'rua@webuildreal.dev';
export const PACT_RUA_MAILTO = `mailto:${PACT_RUA_ADDRESS}`;

/** Previous intake — still accepted for domains already pointing here. */
export const PACT_RUA_LEGACY_ADDRESSES = ['rua@pact.pbm-labs.com'] as const;

const PACT_RUA_ACCEPTED = [PACT_RUA_ADDRESS, ...PACT_RUA_LEGACY_ADDRESSES] as const;

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

/** True if the record already sends reports to canonical or legacy PACT intake. */
export function dmarcIncludesPactRua(record: string): boolean {
  const rua = parseDmarcTags(record).get('rua') ?? '';
  return PACT_RUA_ACCEPTED.some((address) => rua.includes(address));
}

/**
 * Add the canonical PACT rua= for new connects.
 * Does not rewrite domains that already use the legacy intake address.
 */
export function addPactRuaToDmarc(record: string | null | undefined): {
  content: string;
  changed: boolean;
} {
  const base = record?.trim().replace(/^"|"$/g, '') ?? '';
  if (!base) {
    return { content: `v=DMARC1; p=none; rua=${PACT_RUA_MAILTO}`, changed: true };
  }

  const tags = parseDmarcTags(base);
  if (!tags.has('v')) tags.set('v', 'DMARC1');

  if (dmarcIncludesPactRua(base)) {
    return { content: serializeDmarcTags(tags), changed: false };
  }

  const rua = tags.get('rua') ?? '';
  tags.set('rua', rua ? `${rua},${PACT_RUA_MAILTO}` : PACT_RUA_MAILTO);
  return { content: serializeDmarcTags(tags), changed: true };
}
