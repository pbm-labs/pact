'use client';

import { useState } from 'react';
import { Reveal } from '@/components/reveal';

const PARAGRAPHS = [
  'In 1969, four computers connected for the first time. Nobody in that room thought about identity. They didn\'t need to. Everyone online already knew everyone else.',
  'So the internet was born without a way to know who anyone really is. Not a flaw. Just a question nobody had to ask yet.',
  'Then the world got smaller, and full of strangers.',
  'A name on a screen could be anyone. Or no one. We built an entire civilization on a network that was never given the one thing every community needs to survive: a way to tell who\'s real.',
  'We got used to it. A foundation the size of the whole internet has been missing for forty years, hidden in plain sight.',
  'Here\'s what\'s quietly true right now: that foundation can still be laid. Not because faking it got easier — it\'s been easy for years. Because real history can only be built one honest day at a time, and every day we wait is a day someone else gets that we never will.',
  'This isn\'t an alarm. It won\'t ring. One day it will simply be too late, and most people won\'t notice the moment it happened.',
  'The foundation the internet never had can still be poured. Not as a repair. As something finally finished, forty years late.',
  'We don\'t have to live in the gap.',
  'We build real — starting now.',
] as const;

const PEAK_START = PARAGRAPHS.length - 2;
const COLLAPSED_HEIGHT = 340;
const EXPANDED_HEIGHT = 3000;

function paragraphClass(index: number): string {
  const base = 'text-[18px] leading-[1.8] mb-5';
  if (index >= PEAK_START) {
    return `${base} text-txt font-semibold`;
  }
  return `${base} text-muted`;
}

export function SiteNarrative() {
  const [expanded, setExpanded] = useState(false);

  return (
    <article aria-label="Manifesto">
      <div
        className="fog-collapse relative overflow-hidden"
        style={{ maxHeight: expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT }}
      >
        {PARAGRAPHS.map((text, i) => (
          <Reveal key={i} delay={Math.min(i, 4) * 60}>
            <p className={paragraphClass(i)}>{text}</p>
          </Reveal>
        ))}

        {!expanded && (
          <div className="fog-veil pointer-events-none absolute inset-x-0 bottom-0 h-44" aria-hidden />
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="relative inline-flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer text-xs font-mono uppercase tracking-widest text-muted-2 hover:text-muted transition-colors mt-3"
      >
        <span className={`inline-block transition-transform ${expanded ? 'rotate-90' : ''}`}>
          ›
        </span>
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </article>
  );
}
