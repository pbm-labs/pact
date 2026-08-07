'use client';

import { useState } from 'react';

const PARAGRAPHS = [
  'In 1969, four computers connected for the first time. Nobody in that room thought about identity. They didn\'t need to. Everyone online already knew everyone else.',
  'So the internet was born without a way to know who anyone really is. Not a flaw. Just a question nobody had to ask yet.',
  'Then the world got smaller, and filled with strangers.',
  'A name on a screen could be anyone. Or no one. We built an entire civilization on a network that was never given the one thing every community needs to survive: a way to tell who\'s real.',
  'And we got used to it. A foundation the size of the internet, missing in plain sight for half a century.',
  'Here\'s what\'s quietly true: it isn\'t too late. Almost everything about who you are online can be faked in minutes. History is the one thing that can\'t. It\'s earned one honest day at a time, and every day we wait is a day we never get back.',
  'The foundation the internet never had can still be poured. Not as a repair. As something finally finished, half a century late.',
  'We don\'t have to live in the gap.',
  'We build real. Starting now.',
] as const;

const PEAK_START = PARAGRAPHS.length - 2;

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
      <div className="relative">
        <div className={expanded ? '' : 'max-h-40 overflow-hidden'}>
          {PARAGRAPHS.map((text, i) => (
            <p key={i} className={paragraphClass(i)}>
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
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </article>
  );
}
