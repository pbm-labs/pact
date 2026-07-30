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

function PlayPoster({
  onPlay,
  size = 'default',
}: {
  onPlay: () => void;
  size?: 'default' | 'compact';
}) {
  const compact = size === 'compact';
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play: ${VIDEO_TITLE}`}
      className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_30%_25%,rgba(124,106,247,0.22),transparent_60%)] cursor-pointer"
    >
      <span
        className={`flex items-center justify-center rounded-full bg-txt text-bg shadow-xl transition-transform group-hover:scale-105 ${
          compact ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-20 w-20 sm:h-28 sm:w-28'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={compact ? 'h-7 w-7 sm:h-8 sm:w-8 ml-1' : 'h-8 w-8 sm:h-10 sm:w-10 ml-1'}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span
        className={`px-4 text-center font-semibold text-txt ${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-2xl'}`}
      >
        {VIDEO_TITLE}
      </span>
      <span className="text-xs sm:text-sm text-muted-2">Watch The Manifesto</span>
    </button>
  );
}

export function VideoManifesto() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function closeModal() {
    setOpen(false);
    setPlaying(false);
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal();
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
        <PlayPoster onPlay={() => setOpen(true)} />
      </div>

      {mounted &&
        open &&
        createPortal(
          <div
            className="modal-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-bg/75 backdrop-blur-[3px] p-4 sm:p-8"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={VIDEO_TITLE}
          >
            <div
              className="modal-card-in relative w-full max-w-[94vw] sm:max-w-4xl lg:max-w-6xl max-h-[88vh] sm:max-h-[85vh] aspect-video rounded-2xl overflow-hidden border border-border-h bg-surface shadow-2xl shadow-black/40"
              onClick={(e) => e.stopPropagation()}
            >
              {playing ? (
                <video
                  className="h-full w-full"
                  src={VIDEO_SRC}
                  autoPlay
                  controls
                  playsInline
                  title={VIDEO_TITLE}
                />
              ) : (
                <PlayPoster onPlay={() => setPlaying(true)} />
              )}

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close and read instead"
                className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
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
