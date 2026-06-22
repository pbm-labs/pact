import Link from 'next/link';
import { btnGhost } from '@/lib/ui';

interface DomainActionsProps {
  domain: string;
}

export function DomainActions({ domain }: DomainActionsProps) {
  const q = encodeURIComponent(domain);

  return (
    <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-border">
      <Link href="/domains" className={btnGhost}>
        All records
      </Link>
      <Link href={`/disconnect?domain=${q}`} className={`${btnGhost} text-muted-2 hover:text-muted`}>
        Disconnect
      </Link>
    </div>
  );
}
