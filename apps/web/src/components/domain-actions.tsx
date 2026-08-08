'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { btnGhost } from '@/lib/ui';

export function DomainActions() {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-border">
      <Link href="/domains" className={btnGhost}>
        {t.connectSuccess.allRecords}
      </Link>
    </div>
  );
}
