'use client';

import { useState } from 'react';
import { useLocale } from '@/components/locale-provider';

interface CopyableValueProps {
  text: string;
  label?: string;
  href?: string;
}

export function CopyableValue({ text, label, href }: CopyableValueProps) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const copyLabel = label ?? t.common.copy;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  const copyClass = `shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide ${
    copied ? 'bg-verified/15 text-verified' : 'bg-accent text-white hover:opacity-90'
  }`;

  if (href) {
    return (
      <div className="w-full flex items-center justify-between gap-3 pl-4 sm:pl-5 pr-2 py-2 rounded-xl border border-accent/30 bg-accent/5">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-mono font-semibold text-accent min-w-0 no-underline hover:underline break-all"
        >
          {text}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className={copyClass}
          aria-label={`${copyLabel} ${text}`}
        >
          {copied ? t.common.copied : copyLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleCopy}
        className="group w-full flex items-center justify-between gap-3 pl-4 sm:pl-5 pr-2 py-2 rounded-xl border border-accent/30 bg-accent/5 hover:border-accent/60 hover:bg-accent/10 text-left"
        aria-label={`${copyLabel} ${text}`}
      >
        <code className="text-sm font-mono font-semibold text-accent truncate min-w-0">
          {text}
        </code>
        <span
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide ${
            copied ? 'bg-verified/15 text-verified' : 'bg-accent text-white group-hover:opacity-90'
          }`}
        >
          {copied ? t.common.copied : copyLabel}
        </span>
      </button>
    </div>
  );
}
