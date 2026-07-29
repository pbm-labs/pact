'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const VIDEO_SRC = encodeURI("/The-Internet's-Identity-Problem.mp4");
const VIDEO_TITLE = "The Internet's Identity Problem";

function CloseIcon() {
  return (
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
  );
}

export function VideoManifesto() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-h bg-surface shadow-2xl shadow-black/20">
        <button
          type="button"
          onClick={() => setOpen(true)}
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
      </div>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm p-2 sm:p-6"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={VIDEO_TITLE}
          >
            <div
              className="relative w-full max-w-[98vw] sm:max-w-[94vw] max-h-[92vh] sm:max-h-[90vh] aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                className="h-full w-full rounded-lg sm:rounded-2xl bg-black shadow-2xl"
                src={VIDEO_SRC}
                autoPlay
                controls
                playsInline
                title={VIDEO_TITLE}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close video"
                className="absolute top-2 right-2 sm:-top-4 sm:-right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
              >
                <CloseIcon />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
