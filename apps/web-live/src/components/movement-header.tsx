'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/brand-mark';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useLocale } from '@/components/locale-provider';
import { isRecordsNav, routes } from '@/lib/routes';

function navClass(active: boolean, mobile = false) {
  return `${mobile ? 'text-base py-2' : 'text-sm'} font-medium no-underline ${
    active ? 'text-txt' : 'text-muted hover:text-txt'
  }`;
}

export function MovementHeader() {
  const { t } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  const items = [
    {
      href: routes.records,
      label: t.nav.records,
      active: isRecordsNav(pathname),
    },
    {
      href: routes.docs,
      label: t.nav.docs,
      active: pathname === routes.docs || pathname.startsWith(`${routes.docs}/`),
    },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-md"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href={routes.home}
          className="flex items-center gap-2.5 no-underline group shrink-0"
        >
          <BrandMark className="h-5 w-auto shrink-0 opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-brand text-sm text-txt group-hover:text-brand transition-colors">
            we build real
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden sm:flex items-center gap-5" aria-label={t.nav.menu}>
            {items.map((item) => (
              <Link key={item.href} href={item.href} className={navClass(item.active)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher />
          <ThemeToggle />

          <button
            type="button"
            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted hover:text-txt hover:border-border-h"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="site-menu"
          className="sm:hidden border-t border-border/60"
          aria-label={t.nav.menu}
        >
          <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navClass(item.active, true)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
