'use client';

import { useState } from 'react';
import { useLocale } from '@/components/locale-provider';

interface CopyableValueProps {
  text: string;
  label?: string;
}

export function CopyableValue({ text, label }: CopyableValueProps) {
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
            copied
              ? 'bg-verified/15 text-verified'
              : 'bg-accent text-white group-hover:opacity-90'
          }`}
        >
          {copied ? t.common.copied : copyLabel}
        </span>
      </button>
    </div>
  );
}
