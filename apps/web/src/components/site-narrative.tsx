'use client';

import { useState } from 'react';
import { useLocale } from '@/components/locale-provider';

function paragraphClass(index: number, length: number): string {
  const base = 'text-[18px] leading-[1.8] mb-5';
  const peakStart = length - 2;
  if (index >= peakStart) {
    return `${base} text-txt font-semibold`;
  }
  return `${base} text-muted`;
}

export function SiteNarrative() {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const paragraphs = t.home.manifestoParagraphs;

  return (
    <article aria-label="Manifesto">
      <div className="relative">
        <div className={expanded ? '' : 'max-h-40 overflow-hidden'}>
          {paragraphs.map((text, i) => (
            <p key={i} className={paragraphClass(i, paragraphs.length)}>
              {text}
            </p>
          ))}
        </div>

        {!expanded && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent"
            aria-hidden
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="relative inline-flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer text-xs font-mono uppercase tracking-widest text-muted-2 hover:text-muted mt-3"
      >
        <span className={`inline-block ${expanded ? 'rotate-90' : ''}`}>›</span>
        {expanded ? t.home.showLess : t.home.readMore}
      </button>
    </article>
  );
}
