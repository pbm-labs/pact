/**
 * Resolves a domain's public registration date via RDAP.
 * Called once at connection time — not on every report.
 * Returns null if lookup fails; callers must omit rather than guess.
 */
export async function resolveDomainRegisteredAt(domain: string): Promise<number | null> {
  try {
    const bootstrapRes = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { Accept: 'application/rdap+json, application/json' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!bootstrapRes.ok) return null;

    const data = (await bootstrapRes.json()) as {
      events?: { eventAction: string; eventDate?: string }[];
    };
    const registrationEvent = data.events?.find((e) => e.eventAction === 'registration');
    if (!registrationEvent?.eventDate) return null;

    const ms = new Date(registrationEvent.eventDate).getTime();
    return Number.isNaN(ms) ? null : ms;
  } catch {
    return null;
  }
}
