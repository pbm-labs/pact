'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/brand-mark';
import { LanguageSwitcher } from '@/components/language-switcher';
import { MobileMenu } from '@/components/mobile-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { container } from '@/lib/ui';

export function MovementHeader() {
  const { t } = useLocale();
  const pathname = usePathname();
  const whitepaperActive = pathname === routes.whitepaper || pathname.startsWith('/docs');
  const howItWorksActive = pathname === routes.howItWorks;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-md">
      <div className={`${container} h-14 flex items-center justify-between gap-4`}>
        <Link href={routes.home} className="flex items-center gap-2.5 no-underline group shrink-0">
          <BrandMark className="h-5 w-auto shrink-0 opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="font-brand text-sm text-txt group-hover:text-brand transition-colors">
            we build real
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden sm:flex items-center gap-3 sm:gap-5">
            <Link
              href={routes.howItWorks}
              className={`text-sm font-medium no-underline ${
                howItWorksActive ? 'text-txt' : 'text-muted hover:text-txt'
              }`}
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              href={routes.whitepaper}
              className={`text-sm font-medium no-underline ${
                whitepaperActive ? 'text-txt' : 'text-muted hover:text-txt'
              }`}
            >
              {t.nav.whitepaper}
            </Link>
          </nav>
          <LanguageSwitcher />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
