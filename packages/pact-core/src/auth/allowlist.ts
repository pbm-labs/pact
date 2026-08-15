export interface AllowlistEntry {
  /** Normalized org_name values accepted in report metadata */
  orgNames: string[];
  /** Envelope sender domains accepted for direct delivery */
  envelopeDomains: string[];
  /** DKIM d= domains that count as this reporter's wrapper signature */
  dkimDomains: string[];
}

/** Reporter allowlist seed — extend as needed */
export const REPORTER_ALLOWLIST: AllowlistEntry[] = [
  {
    orgNames: ['google.com', 'gmail.com'],
    envelopeDomains: ['google.com', 'gmail.com'],
    dkimDomains: ['google.com', 'gmail.com'],
  },
  {
    orgNames: ['microsoft.com', 'outlook.com', 'hotmail.com'],
    envelopeDomains: ['microsoft.com', 'outlook.com', 'protection.outlook.com'],
    dkimDomains: ['microsoft.com', 'outlook.com', 'office365.com', 'protection.outlook.com'],
  },
  {
    orgNames: ['yahoo.com', 'yahoo-inc.com'],
    envelopeDomains: ['yahoo.com', 'yahoo-inc.com'],
    dkimDomains: ['yahoo.com', 'yahooinc.com', 'yahoodns.net'],
  },
  {
    orgNames: ['apple.com'],
    envelopeDomains: ['apple.com'],
    dkimDomains: ['apple.com'],
  },
];

export const FORWARDING_AGENT_ALLOWLIST: string[] = [
  'valimail.com',
  'reports.valimail.com',
  'postmarkapp.com',
  'bounces.postmarkapp.com',
  'easydmarc.com',
  'dmarcian.com',
];

export function extractEnvelopeDomain(sender: string): string | null {
  const match = sender.match(/@([^>\s]+)/);
  return match?.[1]?.toLowerCase() ?? null;
}

export function domainSuffixMatches(value: string, allowed: string): boolean {
  const v = value.trim().toLowerCase().replace(/^\./, '');
  const a = allowed.trim().toLowerCase().replace(/^\./, '');
  if (!v || !a) return false;
  return v === a || v.endsWith(`.${a}`);
}

export function isKnownReporterOrg(orgName: string): boolean {
  const org = orgName.trim().toLowerCase();
  return REPORTER_ALLOWLIST.some((entry) => entry.orgNames.includes(org));
}

export function isAllowedReporter(orgName: string, envelopeSender: string): boolean {
  const org = orgName.trim().toLowerCase();
  const envelopeDomain = extractEnvelopeDomain(envelopeSender);
  const entry = REPORTER_ALLOWLIST.find((e) => e.orgNames.includes(org));
  if (!entry || !envelopeDomain) return false;
  return entry.envelopeDomains.some((d) => domainSuffixMatches(envelopeDomain, d));
}

export function isAllowedForwardingAgent(envelopeSender: string): boolean {
  const envelopeDomain = extractEnvelopeDomain(envelopeSender);
  if (!envelopeDomain) return false;
  return FORWARDING_AGENT_ALLOWLIST.some((d) => domainSuffixMatches(envelopeDomain, d));
}

export function dkimMatchesReporter(orgName: string, dkimDomains: readonly string[]): boolean {
  const org = orgName.trim().toLowerCase();
  const entry = REPORTER_ALLOWLIST.find((e) => e.orgNames.includes(org));
  if (!entry) return false;
  return dkimDomains.some((domain) =>
    entry.dkimDomains.some((allowed) => domainSuffixMatches(domain, allowed)),
  );
}

export function dkimMatchesForwardingAgent(dkimDomains: readonly string[]): boolean {
  return dkimDomains.some((domain) =>
    FORWARDING_AGENT_ALLOWLIST.some((allowed) => domainSuffixMatches(domain, allowed)),
  );
}

export interface ReportSourceAuth {
  orgName: string;
  envelopeFrom: string;
  /**
   * DKIM d= domains whose signatures passed cryptographic verification
   * of the wrapper message (not the XML inside it).
   */
  dkimDomains: readonly string[];
}

/**
 * A report is authentic only if the wrapper was DKIM-signed by an allowed
 * reporter (or an allowed forwarding agent) and org_name / envelope-from
 * are consistent with that signature.
 */
export function validateReportSource(input: ReportSourceAuth): boolean {
  const dkimDomains = input.dkimDomains
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  if (!dkimDomains.length) return false;

  const reporterDkim = dkimMatchesReporter(input.orgName, dkimDomains);
  const reporterOk = isAllowedReporter(input.orgName, input.envelopeFrom);
  if (reporterOk && reporterDkim) {
    return true;
  }

  if (
    isKnownReporterOrg(input.orgName) &&
    isAllowedForwardingAgent(input.envelopeFrom) &&
    (dkimMatchesForwardingAgent(dkimDomains) || reporterDkim)
  ) {
    return true;
  }

  return false;
}
