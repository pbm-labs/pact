'use client';

import Link from 'next/link';
import { BrandMark } from '@/components/brand-mark';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { LEGAL_ENTITY } from '@/lib/legal';
import { routes } from '@/lib/routes';
import { container } from '@/lib/ui';

export function MovementHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-md">
      <div className={`${container} h-14 flex items-center justify-between gap-4`}>
        <Link href={routes.home} className="flex items-center gap-2.5 no-underline group shrink-0">
          <BrandMark className="h-5 w-auto shrink-0 opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-brand text-sm text-txt group-hover:text-brand transition-colors">
            {LEGAL_ENTITY.brand}
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
