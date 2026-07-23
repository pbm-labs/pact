'use client';

import { useState } from 'react';

const VIDEO_SRC = encodeURI("/The-Internet's-Identity-Problem.mp4");
const VIDEO_TITLE = "The Internet's Identity Problem";

export function VideoManifesto() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface">
      {playing ? (
        <video
          className="absolute inset-0 h-full w-full"
          src={VIDEO_SRC}
          controls
          autoPlay
          playsInline
          title={VIDEO_TITLE}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${VIDEO_TITLE}`}
          className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_30%_25%,rgba(124,106,247,0.16),transparent_60%)] cursor-pointer"
        >
          <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-txt text-bg shadow-lg transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 sm:h-7 sm:w-7 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="px-4 text-center text-sm sm:text-base font-semibold text-txt">
            {VIDEO_TITLE}
          </span>
          <span className="text-xs text-muted-2">Watch the manifesto</span>
        </button>
      )}
    </div>
  );
}
