'use client';

import Link from 'next/link';
import { useState } from 'react';

const WHITEPAPER_URL = 'https://github.com/pbm-labs/pact-protocol/blob/main/white-paper.md';

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="w-8 h-8 -mr-1 flex items-center justify-center rounded-md border border-border text-muted hover:text-txt hover:border-border-h transition-colors"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="fixed inset-x-0 top-14 z-30 border-b border-border/60 bg-bg/95 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
            <Link
              href="/domains"
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm text-muted hover:text-txt transition-colors no-underline"
            >
              Public records
            </Link>
            <a
              href={WHITEPAPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm text-muted hover:text-txt transition-colors no-underline"
            >
              Whitepaper
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
