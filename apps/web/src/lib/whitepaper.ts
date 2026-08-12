import { LOCAL_WHITEOBER_MARKDOWN } from '@/lib/whitepaper-markdown';

/** Canonical public source — always linked from the on-site reader. */
export const WHITEOBER_SOURCE_URL =
  'https://github.com/pbm-labs/pact-protocol/blob/main/white-paper.md';

/** Prefer jsDelivr — raw.githubusercontent.com can lag after pushes. */
const WHITEOBER_RAW_URLS = [
  'https://cdn.jsdelivr.net/gh/pbm-labs/pact-protocol@main/white-paper.md',
  'https://raw.githubusercontent.com/pbm-labs/pact-protocol/main/white-paper.md',
] as const;

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
  for (const url of WHITEOBER_RAW_URLS) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        headers: { Accept: 'text/plain' },
      });
      if (!res.ok) continue;
      const markdown = await res.text();
      if (markdown.trim().startsWith('#')) {
        return { markdown: stripWhitepaperSignature(markdown), source: 'github' };
      }
    } catch {
      /* try next source */
    }
  }

  return {
    markdown: stripWhitepaperSignature(LOCAL_WHITEOBER_MARKDOWN),
    source: 'local',
  };
}
