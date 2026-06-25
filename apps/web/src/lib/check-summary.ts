import type { DomainPageState } from '@/lib/domain-data';
import { formatDomainRegisteredAt, formatPactHistoryStart } from '@/lib/format-time';

export type CheckStatus =
  | 'none'
  | 'waiting'
  | 'live-provisional'
  | 'live-activated'
  | 'disconnected';

export interface CheckSummary {
  domain: string;
  headline: string;
  detail: string;
  registrationLine: string | null;
  pactHistoryLine: string | null;
  status: CheckStatus;
  recordHref: string;
  connectHref: string | null;
}

export function buildCheckSummary(
  state: DomainPageState | null,
  domain: string,
): CheckSummary {
  const recordHref = `/domain/${encodeURIComponent(domain)}`;
  const connectHref = `/how-it-works?domain=${encodeURIComponent(domain)}`;

  if (!state) {
    return {
      domain,
      headline: 'No public record yet',
      detail:
        "This domain hasn't connected to PACT. That doesn't mean it's illegitimate — only that there's no verified email history to show here.",
      registrationLine: null,
      pactHistoryLine: null,
      status: 'none',
      recordHref,
      connectHref,
    };
  }

  if (state.status === 'disconnected') {
    const reg = state.data.domainRegisteredAt
      ? `Domain registered ${formatDomainRegisteredAt(state.data.domainRegisteredAt)}`
      : null;
    return {
      domain,
      headline: 'Previously on PACT',
      detail:
        'This domain disconnected from PACT. Historical provenance may still be visible on the full record.',
      registrationLine: reg,
      pactHistoryLine: null,
      status: 'disconnected',
      recordHref,
      connectHref,
    };
  }

  const registrationLine = state.data.domainRegisteredAt
    ? `Domain registered ${formatDomainRegisteredAt(state.data.domainRegisteredAt)}`
    : state.data.domainRegisteredAt === null
      ? 'Domain registration age unknown'
      : null;

  if (state.status === 'waiting') {
    return {
      domain,
      headline: 'On PACT — record building',
      detail:
        'Connected and waiting for the first authenticated email report from a major mail provider.',
      registrationLine,
      pactHistoryLine: 'PACT verified since — awaiting first report',
      status: 'waiting',
      recordHref,
      connectHref: null,
    };
  }

  const pactHistoryLine = state.data.pactHistoryStart
    ? `PACT verified since ${formatPactHistoryStart(state.data.pactHistoryStart)}`
    : null;

  if (state.data.trust.status === 'activated') {
    return {
      domain,
      headline: 'Established PACT record',
      detail:
        'Sustained verified email history from independent mail providers. Trust score reflects accumulated PACT history — not company age.',
      registrationLine,
      pactHistoryLine,
      status: 'live-activated',
      recordHref,
      connectHref: null,
    };
  }

  return {
    domain,
    headline: 'On PACT — history building',
    detail:
      'Verified email activity is accumulating. The score starts low by design until enough PACT history exists — domain registration age is shown separately.',
    registrationLine,
    pactHistoryLine,
    status: 'live-provisional',
    recordHref,
    connectHref: null,
  };
}
