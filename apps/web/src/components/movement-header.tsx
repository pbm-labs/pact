import Link from 'next/link';
import { fetchJoinedCount } from '@/lib/domain-data';

export async function MovementHeader() {
  const joined = await fetchJoinedCount();

  return (
    <header className="border-b border-border/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-[13px] text-muted-2 lowercase tracking-normal no-underline hover:text-muted transition-colors"
        >
          we build real
        </Link>
        <p className="text-[13px] text-unclaimed lowercase m-0">
          {joined.toLocaleString()} joined
        </p>
      </div>
    </header>
  );
}
