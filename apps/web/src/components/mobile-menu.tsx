'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { container } from '@/lib/ui';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.common.closeMenu : t.common.openMenu}
        aria-expanded={open}
        className="w-8 h-8 -mr-1 flex items-center justify-center rounded-md border border-border text-muted hover:text-txt hover:border-border-h"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="fixed inset-x-0 top-14 z-30 border-b border-border/60 bg-bg/95 backdrop-blur-md">
          <nav className={`${container} py-4 flex flex-col gap-1`}>
            <Link
              href={routes.howItWorks}
              onClick={() => setOpen(false)}
              className={`py-2.5 text-sm no-underline ${
                pathname === routes.howItWorks ? 'text-txt' : 'text-muted hover:text-txt'
              }`}
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              href={routes.whitepaper}
              onClick={() => setOpen(false)}
              className={`py-2.5 text-sm no-underline ${
                pathname === routes.whitepaper || pathname.startsWith('/docs')
                  ? 'text-txt'
                  : 'text-muted hover:text-txt'
              }`}
            >
              {t.nav.whitepaper}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
