/** A certificate as returned by a public CT *index* (not a log operator). */

export interface CtIndexCert {
  logId: string;
  logIndex: bigint;
  issuer: string;
  commonName: string;
  names: string[];
  loggedAtIso: string | undefined;
  notBeforeIso: string;
  notAfterIso: string;
  sha256: string | undefined;
  serial: string | undefined;
}

export function splitCertNames(
  ...parts: Array<string | readonly string[] | undefined | null>
): string[] {
  const names: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    const blob = typeof part === 'string' ? part : part.join('\n');
    for (const raw of blob.split(/[\s,]+/)) {
      const name = raw.trim().toLowerCase().replace(/\.$/, '');
      if (name) names.push(name);
    }
  }
  return names;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : value == null ? '' : String(value);
}

function parseLogIndex(value: unknown): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) {
    return BigInt(value);
  }
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    return BigInt(value.trim());
  }
  return 0n;
}

function rowObject(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
}

/** crt.sh `output=json` uses `entry_timestamp`, not `min_entry_timestamp`. */
export function parseCrtShJson(raw: unknown, logId = 'crt.sh'): CtIndexCert[] {
  if (!Array.isArray(raw)) return [];
  const out: CtIndexCert[] = [];
  for (const item of raw) {
    const row = rowObject(item);
    if (!row) continue;
    const notBeforeIso = asString(row.not_before).trim();
    const notAfterIso = asString(row.not_after).trim();
    if (!notBeforeIso || !notAfterIso) continue;
    const commonName = asString(row.common_name).trim();
    out.push({
      logId,
      logIndex: parseLogIndex(row.id),
      issuer: asString(row.issuer_name).trim(),
      commonName,
      names: splitCertNames(asString(row.name_value), commonName),
      loggedAtIso:
        asString(row.entry_timestamp).trim() ||
        asString(row.min_entry_timestamp).trim() ||
        undefined,
      notBeforeIso,
      notAfterIso,
      sha256:
        asString(row.sha256).trim() ||
        asString(row.sha256_cert).trim() ||
        asString(row.cert_sha256).trim() ||
        undefined,
      serial: asString(row.serial_number).trim() || undefined,
    });
  }
  return out;
}

/** SSLMate Cert Spotter unauthenticated issuances API. */
export function parseCertSpotterJson(raw: unknown, logId = 'certspotter'): CtIndexCert[] {
  if (!Array.isArray(raw)) return [];
  const out: CtIndexCert[] = [];
  for (const item of raw) {
    const row = rowObject(item);
    if (!row) continue;
    const notBeforeIso = asString(row.not_before).trim();
    const notAfterIso = asString(row.not_after).trim();
    if (!notBeforeIso || !notAfterIso) continue;
    const issuerObj = rowObject(row.issuer);
    const issuer = issuerObj
      ? asString(issuerObj.name).trim() || asString(issuerObj.friendly_name).trim()
      : asString(row.issuer).trim();
    const dnsNames = Array.isArray(row.dns_names)
      ? row.dns_names.map((name) => asString(name))
      : [];
    out.push({
      logId,
      logIndex: parseLogIndex(row.id),
      issuer,
      commonName: dnsNames[0] ?? '',
      names: splitCertNames(dnsNames),
      loggedAtIso: notBeforeIso,
      notBeforeIso,
      notAfterIso,
      sha256: asString(row.cert_sha256).trim() || undefined,
      serial: asString(row.serial_number).trim() || undefined,
    });
  }
  return out;
}

export function parseLinkRelNext(linkHeader: string | null | undefined): string | null {
  if (!linkHeader) return null;
  const match = /<([^>]+)>\s*;\s*rel="next"/i.exec(linkHeader);
  return match?.[1] ?? null;
}
