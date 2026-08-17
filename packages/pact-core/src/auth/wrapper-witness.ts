import type { WrapperDkimId } from '../encoding/wrapper.js';
import {
  FORWARDING_AGENT_ALLOWLIST,
  REPORTER_ALLOWLIST,
  domainSuffixMatches,
  extractEnvelopeDomain,
} from './allowlist.js';

export type WrapperDkimSource = 'verified' | 'signature-header' | 'envelope';

export interface WrapperDkimWitness {
  ids: WrapperDkimId[];
  source: WrapperDkimSource | null;
}

function normalizeId(domain: string, selector: string): WrapperDkimId {
  return { domain: domain.trim().toLowerCase(), selector: selector.trim().toLowerCase() };
}

function uniqueIds(ids: readonly WrapperDkimId[]): WrapperDkimId[] {
  const seen = new Set<string>();
  const out: WrapperDkimId[] = [];
  for (const id of ids) {
    const row = normalizeId(id.domain, id.selector);
    if (!row.domain) continue;
    const key = `${row.domain}:${row.selector}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

/** Read `d=` / `s=` from DKIM-Signature headers. Does not verify the signature. */
export function parseDkimIdsFromRfc822(raw: string): WrapperDkimId[] {
  const headerEnd = raw.search(/\r?\n\r?\n/);
  const headers = headerEnd === -1 ? raw : raw.slice(0, headerEnd);
  const unfolded = headers.replace(/\r?\n[ \t]+/g, ' ');
  const ids: WrapperDkimId[] = [];
  const re = /^dkim-signature:\s*(.+)$/gim;
  let match: RegExpExecArray | null;
  while ((match = re.exec(unfolded))) {
    const tags = match[1] ?? '';
    const domain = tags.match(/(?:^|;)\s*d\s*=\s*([^;\s]+)/i)?.[1];
    const selector = tags.match(/(?:^|;)\s*s\s*=\s*([^;\s]+)/i)?.[1] ?? '';
    if (domain) ids.push(normalizeId(domain, selector));
  }
  return uniqueIds(ids);
}

/** Map an allowlisted reporter/forwarder envelope to a DKIM id when signatures were stripped. */
export function wrapperDkimFromEnvelope(envelopeFrom: string): WrapperDkimId[] {
  const domain = extractEnvelopeDomain(envelopeFrom);
  if (!domain) return [];
  for (const entry of REPORTER_ALLOWLIST) {
    if (entry.envelopeDomains.some((allowed) => domainSuffixMatches(domain, allowed))) {
      return [normalizeId(entry.dkimDomains[0]!, '')];
    }
  }
  for (const allowed of FORWARDING_AGENT_ALLOWLIST) {
    if (domainSuffixMatches(domain, allowed)) {
      return [normalizeId(allowed, '')];
    }
  }
  return [];
}

/**
 * Prefer a cryptographically verified pass. If Email Routing rewrote the body,
 * fall back to DKIM-Signature header ids, then an allowlisted envelope domain.
 */
export function resolveWrapperDkimWitness(input: {
  verified?: readonly WrapperDkimId[];
  headerIds?: readonly WrapperDkimId[];
  rfc822?: string;
  envelopeFrom: string;
}): WrapperDkimWitness {
  const verified = uniqueIds(input.verified ?? []);
  if (verified.length) return { ids: verified, source: 'verified' };

  const headerIds = uniqueIds([
    ...(input.headerIds ?? []),
    ...(input.rfc822 ? parseDkimIdsFromRfc822(input.rfc822) : []),
  ]);
  if (headerIds.length) return { ids: headerIds, source: 'signature-header' };

  const envelope = wrapperDkimFromEnvelope(input.envelopeFrom);
  if (envelope.length) return { ids: envelope, source: 'envelope' };

  return { ids: [], source: null };
}
