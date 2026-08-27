'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { container } from '@/lib/ui';

export function MovementFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border mt-auto">
      <div
        className={`${container} py-4 flex items-center justify-between gap-4 text-xs text-muted-2 font-mono`}
      >
        <p className="m-0">
          &copy; {new Date().getFullYear()} we build real · {t.footer.operator}
        </p>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
          <Link href={routes.connect} className="hover:text-muted no-underline">
            {t.nav.intake}
          </Link>
          <a href={routes.ledger} className="hover:text-muted no-underline">
            {t.footer.ledger}
          </a>
          <a href="mailto:hello@pbm-labs.com" className="hover:text-muted no-underline">
            {t.footer.contact}
          </a>
          <Link href={routes.terms} className="hover:text-muted no-underline">
            {t.footer.terms}
          </Link>
          <Link href={routes.privacy} className="hover:text-muted no-underline">
            {t.footer.privacy}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
