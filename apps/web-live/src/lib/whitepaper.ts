import { LOCAL_WHITEOBER_MARKDOWN } from '@/lib/whitepaper-markdown';

/** Canonical public source — the protocol spec in this repo. The essay is bundled. */
export const WHITEOBER_SOURCE_URL =
  'https://github.com/pbm-labs/pact/blob/main/docs/pact_protocol.md';

/** Drop the italic closing signature block from the published whitepaper. */
export function stripWhitepaperSignature(markdown: string): string {
  return markdown
    .replace(
      /\n---\n\n\*PACT [^\n]*\*\s*\n\*Whitepaper[^\n]*\*\s*\n\*[^\n]*@(?:pbm-labs\.com|webuildreal\.dev)\*\s*$/m,
      '\n',
    )
    .trimEnd()
    .concat('\n');
}

/**
 * Serve the bundled essay so /docs stays in sync with this repo.
 * (The older GitHub pact-protocol copy can lag.)
 */
export async function loadWhitepaperMarkdown(): Promise<{
  markdown: string;
  source: 'local';
}> {
  return {
    markdown: stripWhitepaperSignature(LOCAL_WHITEOBER_MARKDOWN),
    source: 'local',
  };
}
