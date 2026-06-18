export interface AllowlistEntry {
  /** Normalized org_name values accepted in report metadata */
  orgNames: string[];
  /** Envelope sender domains accepted for direct delivery */
  envelopeDomains: string[];
}

/** v0.2 reporter allowlist seed — extend as needed */
export const REPORTER_ALLOWLIST: AllowlistEntry[] = [
  {
    orgNames: ['google.com', 'gmail.com'],
    envelopeDomains: ['google.com', 'gmail.com'],
  },
  {
    orgNames: ['microsoft.com', 'outlook.com', 'hotmail.com'],
    envelopeDomains: ['microsoft.com', 'outlook.com', 'protection.outlook.com'],
  },
  {
    orgNames: ['yahoo.com', 'yahoo-inc.com'],
    envelopeDomains: ['yahoo.com', 'yahoo-inc.com'],
  },
  {
    orgNames: ['apple.com'],
    envelopeDomains: ['apple.com'],
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

export function isAllowedReporter(orgName: string, envelopeSender: string): boolean {
  const org = orgName.trim().toLowerCase();
  const envelopeDomain = extractEnvelopeDomain(envelopeSender);

  for (const entry of REPORTER_ALLOWLIST) {
    const orgMatch = entry.orgNames.includes(org);
    if (!orgMatch) continue;
    if (!envelopeDomain) return false;
    return entry.envelopeDomains.some(
      (d) => envelopeDomain === d || envelopeDomain.endsWith(`.${d}`),
    );
  }
  return false;
}

export function isAllowedForwardingAgent(envelopeSender: string): boolean {
  const envelopeDomain = extractEnvelopeDomain(envelopeSender);
  if (!envelopeDomain) return false;
  return FORWARDING_AGENT_ALLOWLIST.some(
    (d) => envelopeDomain === d || envelopeDomain.endsWith(`.${d}`),
  );
}

export function validateReportSource(orgName: string, envelopeSender: string): boolean {
  if (isAllowedReporter(orgName, envelopeSender)) return true;
  if (isAllowedForwardingAgent(envelopeSender)) return true;
  return false;
}
