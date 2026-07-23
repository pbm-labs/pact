'use client';

import { useState } from 'react';

const VIDEO_SRC = encodeURI("/The-Internet's-Identity-Problem.mp4");
const VIDEO_TITLE = "The Internet's Identity Problem";

export function VideoManifesto() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-h bg-surface shadow-2xl shadow-black/20">
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
          className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_30%_25%,rgba(124,106,247,0.22),transparent_60%)] cursor-pointer"
        >
          <span className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-txt text-bg shadow-xl transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 sm:h-10 sm:w-10 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="px-4 text-center text-lg sm:text-2xl font-semibold text-txt">
            {VIDEO_TITLE}
          </span>
          <span className="text-xs sm:text-sm text-muted-2">Watch The Manifesto</span>
        </button>
      )}
    </div>
  );
}
