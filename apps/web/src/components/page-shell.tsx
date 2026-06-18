import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  centered?: boolean;
}

export function PageShell({
  children,
  backHref,
  backLabel = 'All domains',
  centered = false,
}: PageShellProps) {
  return (
    <main className={`page${centered ? ' page-centered' : ''}`}>
      {backHref && (
        <p className="page-back">
          <Link href={backHref}>← {backLabel}</Link>
        </p>
      )}
      {children}
    </main>
  );
}
