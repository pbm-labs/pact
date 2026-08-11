import { LOCAL_WHITEOBER_MARKDOWN } from '@/lib/whitepaper-markdown';

/** Canonical public source — always linked from the on-site reader. */
export const WHITEOBER_SOURCE_URL =
  'https://github.com/pbm-labs/pact-protocol/blob/main/white-paper.md';

const WHITEOBER_RAW_URL =
  'https://raw.githubusercontent.com/pbm-labs/pact-protocol/main/white-paper.md';

/** Drop the italic closing signature block from the published whitepaper. */
export function stripWhitepaperSignature(markdown: string): string {
  return markdown
    .replace(
      /\n---\n\n\*PACT [^\n]*\*\s*\n\*Whitepaper[^\n]*\*\s*\n\*[^\n]*@pbm-labs\.com\*\s*$/m,
      '\n',
    )
    .trimEnd()
    .concat('\n');
}

/**
 * Prefer the live GitHub source; fall back to the bundled copy so the
 * reader still works if GitHub is unreachable at request time.
 */
export async function loadWhitepaperMarkdown(): Promise<{
  markdown: string;
  source: 'github' | 'local';
}> {
  try {
    const res = await fetch(WHITEPAPBER_RAW_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: 'text/plain' },
    });
    if (res.ok) {
      const markdown = await res.text();
      if (markdown.trim().startsWith('#')) {
        return { markdown: stripWhitepaperSignature(markdown), source: 'github' };
      }
    }
  } catch {
    /* fall through to local copy */
  }

  return {
    markdown: stripWhitepaperSignature(LOCAL_WHITEOBER_MARKDOWN),
    source: 'local',
  };
}
