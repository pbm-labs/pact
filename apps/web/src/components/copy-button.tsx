'use client';

import { useState } from 'react';

interface CopyableValueProps {
  text: string;
  label?: string;
  /** Optional caption above the bar (mono uppercase). */
  caption?: string;
}

/** Inline accent copy bar — same shape as signet-witness CopyableEmail. */
export function CopyableValue({ text, label = 'Copy', caption }: CopyableValueProps) {
  const [copied, setCopied] = useState(false);

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
      {caption && (
        <p className="text-xs text-muted-2 uppercase tracking-widest font-mono mb-2">
          {caption}
        </p>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="group w-full flex items-center justify-between gap-3 pl-4 sm:pl-5 pr-2 py-2 rounded-xl border border-accent/30 bg-accent/5 hover:border-accent/60 hover:bg-accent/10 transition-all text-left"
        aria-label={`${label} ${text}`}
      >
        <code className="text-sm sm:text-base font-mono font-semibold text-accent truncate min-w-0">
          {text}
        </code>
        <span
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
            copied
              ? 'bg-verified/15 text-verified'
              : 'bg-accent text-white group-hover:opacity-90'
          }`}
        >
          {copied ? 'Copied' : label}
        </span>
      </button>
    </div>
  );
}

/** @deprecated Prefer CopyableValue; kept for any remaining call sites. */
export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  return <CopyableValue text={text} label={label} />;
}
