'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from '@/components/locale-provider';

const VIDEO_SRC = encodeURI("/The-Internet's-Identity-Problem.mp4");

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
  watchLabel,
  title,
  size = 'default',
}: {
  onPlay: () => void;
  watchLabel: string;
  title: string;
  size?: 'default' | 'compact';
}) {
  const compact = size === 'compact';
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`${watchLabel}: ${title}`}
      className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_30%_25%,rgba(124,106,247,0.12),transparent_55%)] cursor-pointer"
    >
      <span
        className={`flex items-center justify-center rounded-full bg-txt text-bg ${
          compact ? 'h-14 w-14 sm:h-16 sm:w-16' : 'h-16 w-16 sm:h-20 sm:w-20'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={compact ? 'h-6 w-6 sm:h-7 sm:w-7 ml-0.5' : 'h-7 w-7 sm:h-8 sm:w-8 ml-0.5'}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span
        className={`px-4 text-center font-semibold text-txt ${compact ? 'text-sm' : 'text-base'}`}
      >
        {title}
      </span>
      <span className="text-xs text-muted">{watchLabel}</span>
    </button>
  );
}

export function VideoManifesto() {
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
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
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-h bg-surface">
        <PlayPoster
          title={t.home.manifestoTitle}
          watchLabel={t.home.watchManifesto}
          onPlay={() => {
            setOpen(true);
            setPlaying(true);
          }}
        />
      </div>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/75 backdrop-blur-[3px] p-4 sm:p-8"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={t.home.manifestoTitle}
          >
            <div
              className="relative w-full max-w-[94vw] sm:max-w-4xl lg:max-w-6xl max-h-[88vh] sm:max-h-[85vh] aspect-video rounded-2xl overflow-hidden border border-border-h bg-surface shadow-2xl shadow-black/40"
              onClick={(e) => e.stopPropagation()}
            >
              {playing ? (
                <video
                  className="h-full w-full"
                  src={VIDEO_SRC}
                  autoPlay
                  controls
                  playsInline
                  title={t.home.manifestoTitle}
                />
              ) : (
                <PlayPoster
                  title={t.home.manifestoTitle}
                  watchLabel={t.home.watchManifesto}
                  onPlay={() => setPlaying(true)}
                />
              )}

              <button
                type="button"
                onClick={closeModal}
                aria-label={t.home.closeVideo}
                className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/70"
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
