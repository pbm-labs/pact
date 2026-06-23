'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MovementHeaderBarProps {
  joined: number;
}

export function MovementHeaderBar({ joined }: MovementHeaderBarProps) {
  const isHome = usePathname() === '/';

  if (isHome) {
    return (
      <header className="border-b border-[#e8e8e8] bg-white">
        <div className="max-w-[42rem] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-[15px] text-[#111111] lowercase tracking-normal no-underline hover:opacity-70 transition-opacity"
          >
            we build real
          </Link>
          <p className="text-[15px] text-[#999999] lowercase m-0 tabular-nums">
            {joined.toLocaleString()} joined
          </p>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-[13px] text-muted-2 lowercase tracking-normal no-underline hover:text-muted transition-colors"
        >
          we build real
        </Link>
        <p className="text-[13px] text-unclaimed lowercase m-0 tabular-nums">
          {joined.toLocaleString()} joined
        </p>
      </div>
    </header>
  );
}
