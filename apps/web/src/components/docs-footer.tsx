'use client';

import Link from 'next/link';

interface DocsFooterProps {
  href: string;
  label: string;
}

/** Shared doc-page closer: hairline rule + one accent link. */
export function DocsFooter({ href, label }: DocsFooterProps) {
  return (
    <aside className="mt-12 pt-8 border-t border-border">
      <p className="text-sm m-0">
        <Link href={href} className="text-accent font-semibold no-underline hover:opacity-90">
          {label}
        </Link>
      </p>
    </aside>
  );
}
