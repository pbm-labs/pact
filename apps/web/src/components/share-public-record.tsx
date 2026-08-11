'use client';

import { CopyableValue } from '@/components/copy-button';
import { useLocale } from '@/components/locale-provider';

interface SharePublicRecordProps {
  domain: string;
  /** Absolute or path URL to the public record. */
  recordUrl: string;
}

export function SharePublicRecord({ domain, recordUrl }: SharePublicRecordProps) {
  const { t } = useLocale();
  const shareText = t.connectSuccess.shareText.replace('{domain}', domain);
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(recordUrl);

  return (
    <div className="w-full space-y-4">
      <CopyableValue text={recordUrl} caption={t.connectSuccess.publicRecord} />

      <div>
        <p className="text-[0.65rem] font-mono uppercase tracking-widest text-muted-2 text-center mb-2 m-0">
          {t.connectSuccess.shareEyebrow}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-bg hover:border-muted-2 px-4 py-2.5 text-sm font-medium text-muted hover:text-txt no-underline transition-colors"
          >
            <LinkedInIcon />
            {t.connectSuccess.shareLinkedIn}
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-bg hover:border-muted-2 px-4 py-2.5 text-sm font-medium text-muted hover:text-txt no-underline transition-colors"
          >
            <XIcon />
            {t.connectSuccess.shareX}
          </a>
        </div>
      </div>
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
