'use client';

import { useRef, useState } from 'react';

const VIDEO_SRC = encodeURI("/The-Internet's-Identity-Problem.mp4");
const VIDEO_TITLE = "The Internet's Identity Problem";

export function VideoManifesto() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [muted, setMuted] = useState(true);

  function handleReplay() {
    setDismissed(false);
    setMuted(true);
  }

  function handleDismiss() {
    videoRef.current?.pause();
    setDismissed(true);
  }

  function handleUnmute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
    video.play().catch(() => {});
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-h bg-surface shadow-2xl shadow-black/20">
      {!dismissed && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full"
          src={VIDEO_SRC}
          autoPlay
          muted={muted}
          controls
          playsInline
          title={VIDEO_TITLE}
          onVolumeChange={() => {
            if (videoRef.current) setMuted(videoRef.current.muted);
          }}
        />
      )}

      {!dismissed && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close video and read the manifesto instead"
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {!dismissed && muted && (
        <button
          type="button"
          onClick={handleUnmute}
          className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-full bg-black/55 text-white text-xs font-medium px-3.5 py-2 backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          Tap for sound
        </button>
      )}

      {dismissed && (
        <button
          type="button"
          onClick={handleReplay}
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
