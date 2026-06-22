'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`shrink-0 px-4 h-9 rounded-lg border text-[0.7rem] font-semibold transition-colors ${
        copied
          ? 'border-verified/30 bg-verified/15 text-verified'
          : 'border-border bg-accent text-white hover:opacity-90'
      }`}
    >
      {copied ? 'Copied' : label}
    </button>
  );
}
