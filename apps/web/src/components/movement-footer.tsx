'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';

export function MovementFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 text-xs text-muted-2 font-mono">
        <p className="m-0">&copy; {new Date().getFullYear()} we build real</p>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
          <Link href="/terms" className="hover:text-muted no-underline">
            {t.footer.terms}
          </Link>
          <Link href="/privacy" className="hover:text-muted no-underline">
            {t.footer.privacy}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
