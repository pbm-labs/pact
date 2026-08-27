'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { btnPrimary } from '@/lib/ui';

export function CtaBlock() {
  const { t } = useLocale();

  return (
    <section className="mt-16 sm:mt-20 pt-10 border-t border-border">
      <h2 className="m-0 text-xl sm:text-2xl font-semibold tracking-tight text-txt leading-snug max-w-xl">
        {t.home.ctaHeading}
      </h2>
      <p className="mt-6 mb-0">
        <Link href={routes.connect} className={btnPrimary}>
          {t.home.ctaButton}
        </Link>
      </p>
    </section>
  );
}
