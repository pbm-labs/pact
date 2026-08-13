'use client';

import { useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { useSiteTheme } from '@/components/use-site-theme';
import { sizeBadge, type BadgeTheme } from '@/lib/badge-dimensions';
import { routes } from '@/lib/routes';

// Owner-facing badge surface. One job: get a *clickable* badge onto
// the clipboard so the owner can paste it into their email signature
// (Gmail, Apple Mail, Outlook).
//
// Theme handling is split between the preview and the clipboard:
//
//   Preview — both variants are stacked <img> tags. When the user
//             hasn't touched the picker, CSS via `html.light` picks
//             the active one (no hydration flicker). An explicit
//             picker choice decouples the badge from the navbar.
//   Copy    — the clipboard payload is a single <img src=…> URL, so
//             it commits to the effective theme at click time.
export function BadgeEmbed({ domain }: { domain: string }) {
  const { t } = useLocale();
  const siteTheme = useSiteTheme();
  const [override, setOverride] = useState<BadgeTheme | null>(null);
  const effectiveTheme: BadgeTheme = override ?? siteTheme;
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const recordPath = routes.record(domain);
  const darkPreviewSrc = `${routes.badge(domain)}.png?theme=dark`;
  const lightPreviewSrc = `${routes.badge(domain)}.png?theme=light`;
  const { width: badgeW, height: badgeH } = sizeBadge(domain);

  async function handleCopy() {
    const origin = window.location.origin;
    const recordUrl = `${origin}${recordPath}`;
    const imageUrl = `${origin}${routes.badge(domain)}.png?theme=${effectiveTheme}`;
    const imgStyle = `border:0;display:inline-block;vertical-align:middle;width:${badgeW}px;height:${badgeH}px;max-width:${badgeW}px`;
    const html = `<a href="${recordUrl}"><img src="${imageUrl}" alt="we build real · ${domain}" width="${badgeW}" height="${badgeH}" style="${imgStyle}" /></a>`;
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([recordUrl], { type: 'text/plain' }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(html);
      }
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2200);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2200);
    }
  }

  const previewAlt = t.badge.alt.replace('{domain}', domain);

  const darkClass =
    override === null
      ? 'block max-w-full h-auto light:hidden'
      : effectiveTheme === 'dark'
        ? 'block max-w-full h-auto'
        : 'hidden';
  const lightClass =
    override === null
      ? 'hidden max-w-full h-auto light:block'
      : effectiveTheme === 'light'
        ? 'block max-w-full h-auto'
        : 'hidden';

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-2.5 border-b border-border flex items-center justify-between gap-3">
          <span className="text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
            {t.badge.mockLabel}
          </span>
          <BadgeThemePicker
            value={effectiveTheme}
            onChange={setOverride}
            ariaLabel={t.badge.themeAria}
            labels={{ dark: t.badge.themeDark, light: t.badge.themeLight }}
          />
        </div>
        <div className="px-5 py-5">
          <p className="text-sm font-semibold leading-tight text-txt">
            {t.badge.signatureName}
          </p>
          <p className="text-xs mt-0.5 text-muted">{t.badge.signatureRole}</p>
          <p className="text-[0.7rem] mt-1 font-mono text-muted-2">
            {t.badge.signatureContact.replace('{domain}', domain)}
          </p>
          <div className="mt-4">
            <a
              href={recordPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={darkPreviewSrc}
                alt={previewAlt}
                width={badgeW}
                height={badgeH}
                className={darkClass}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightPreviewSrc}
                alt={previewAlt}
                width={badgeW}
                height={badgeH}
                className={lightClass}
              />
            </a>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className={`w-full h-11 rounded-lg text-sm font-semibold tracking-wide transition-opacity border ${
          status === 'copied'
            ? 'bg-verified/15 text-verified border-verified/30'
            : status === 'error'
              ? 'bg-red-500/15 text-red-400 border-red-500/30'
              : 'bg-accent text-white border-accent hover:opacity-90'
        }`}
      >
        {status === 'copied'
          ? t.badge.copyDone
          : status === 'error'
            ? t.badge.copyError
            : t.badge.copyBadge}
      </button>

      <p className="text-[0.7rem] text-muted-2 leading-relaxed m-0">
        {t.badge.howTo}
      </p>
    </div>
  );
}

function BadgeThemePicker({
  value,
  onChange,
  ariaLabel,
  labels,
}: {
  value: BadgeTheme;
  onChange: (next: BadgeTheme) => void;
  ariaLabel: string;
  labels: { dark: string; light: string };
}) {
  const opts: Array<{ key: BadgeTheme; label: string }> = [
    { key: 'dark', label: labels.dark },
    { key: 'light', label: labels.light },
  ];
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-md border border-border bg-bg/50 p-0.5 text-[0.6rem] font-mono uppercase tracking-widest"
    >
      {opts.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            aria-pressed={active}
            className={`px-2 py-0.5 rounded-sm transition-colors ${
              active ? 'bg-surface text-txt' : 'text-muted-2 hover:text-txt'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
