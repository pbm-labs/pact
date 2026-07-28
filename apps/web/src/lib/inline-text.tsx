import type { ReactNode } from 'react';

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;

/**
 * Renders a small, deliberately limited subset of markdown inline syntax
 * (**bold**, `code`, *italic*) as React nodes, without pulling in a full
 * markdown parser for what is otherwise plain, hand-authored copy.
 */
export function renderInline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-txt font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[0.85em] text-txt bg-surface-2 px-1 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={i} className="italic text-muted">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
