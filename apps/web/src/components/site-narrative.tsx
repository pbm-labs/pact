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
const PREVIEW_COUNT = 2;

function paragraphClass(index: number): string {
  const base = 'text-[18px] leading-[1.8] mb-5';
  if (index >= PEAK_START) {
    return `${base} text-txt font-semibold`;
  }
  return `${base} text-muted`;
}

export function SiteNarrative() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? PARAGRAPHS : PARAGRAPHS.slice(0, PREVIEW_COUNT);

  return (
    <article aria-label="Manifesto">
      {visible.map((text, i) => (
        <Reveal key={i} delay={Math.min(i, 4) * 60}>
          <p className={paragraphClass(i)}>{text}</p>
        </Reveal>
      ))}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="bg-transparent border-none p-0 cursor-pointer text-sm font-semibold text-txt underline underline-offset-4 decoration-border-h hover:decoration-txt transition-colors"
      >
        {expanded ? 'Show less' : 'Read the full manifesto'}
      </button>
    </article>
  );
}
