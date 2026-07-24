import Link from 'next/link';
import { btnGhost } from '@/lib/ui';

export function DomainActions() {
  return (
    <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-border">
      <Link href="/domains" className={btnGhost}>
        All records
      </Link>
    </div>
  );
}
