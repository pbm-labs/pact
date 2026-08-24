import { LOCAL_WHITEPAPER_MARKDOWN } from '@/lib/whitepaper-markdown';
import { PROTOCOL_SPEC_URL } from '@/lib/routes';

/** Normative spec. This page renders the public essay; encoding lives in the spec. */
export const WHITEPAPER_SOURCE_URL = PROTOCOL_SPEC_URL;

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
    markdown: stripWhitepaperSignature(LOCAL_WHITEPAPER_MARKDOWN),
    source: 'local',
  };
}
