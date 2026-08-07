import Link from 'next/link';
import type { ReactNode } from 'react';
import { containerDefault, containerNarrow, containerWide, linkMuted } from '@/lib/ui';

interface PageShellProps {
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  centered?: boolean;
  width?: 'narrow' | 'default' | 'wide';
}

export function PageShell({
  children,
  backHref,
  backLabel = 'Back',
  centered = false,
  width = 'default',
}: PageShellProps) {
  const container =
    width === 'narrow' ? containerNarrow : width === 'wide' ? containerWide : containerDefault;

  return (
    <main className="flex-1">
      <div
        className={`${container} py-12 sm:py-16 ${centered ? 'text-center flex flex-col items-center' : ''}`}
      >
        {backHref && (
          <p className="mb-6">
            <Link href={backHref} className={`${linkMuted} text-sm font-mono`}>
              ← {backLabel}
            </Link>
          </p>
        )}
        {children}
      </div>
    </main>
  );
}
