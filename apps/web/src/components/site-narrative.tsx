'use client';

import { useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { eyebrow, narrative } from '@/lib/ui';

function paragraphClass(index: number, length: number): string {
  const base = `${narrative} mb-5`;
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
    <article aria-label={t.home.manifestoEyebrow}>
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
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent"
            aria-hidden
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`relative inline-flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer ${eyebrow} hover:text-muted mt-3`}
      >
        <span className={`inline-block ${expanded ? 'rotate-90' : ''}`}>›</span>
        {expanded ? t.home.showLess : t.home.readMore}
      </button>
    </article>
  );
}
