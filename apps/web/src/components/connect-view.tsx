'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import { CopyableValue } from '@/components/copy-button';
import { useLocale } from '@/components/locale-provider';
import type { ConnectPath } from '@/lib/connect-path';
import type { Dictionary } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import {
  alertError,
  bodyText,
  btnPrimary,
  eyebrow,
  input,
  label,
  linkMuted,
  pageTitle,
  panel,
  panelBody,
  panelHeader,
  pathCard,
} from '@/lib/ui';

type ConnectErrorKey = keyof Dictionary['connect']['errors'];

interface ConnectViewProps {
  errorKey?: string;
  detail?: string;
  domainPrefill: string;
  dmarcSnippet: string;
  ruaAddress: string;
  initialPath: ConnectPath | null;
}

const PATHS: ConnectPath[] = ['cloudflare', 'manual', 'dmarc-tool'];

function PathIcon({ kind }: { kind: ConnectPath }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (kind === 'cloudflare') {
    return (
      <svg {...common}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    );
  }
  if (kind === 'dmarc-tool') {
    return (
      <svg {...common}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ConnectFlow({
  errorKey,
  detail,
  domainPrefill,
  dmarcSnippet,
  ruaAddress,
  initialPath,
}: ConnectViewProps) {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [path, setPath] = useState<ConnectPath | null>(initialPath);

  const errors = t.connect.errors;
  const errorMessage = errorKey
    ? errors[errorKey as ConnectErrorKey] ?? errors.somethingWrong
    : null;

  const pathCopy = {
    cloudflare: {
      title: t.connect.pathCloudflareTitle,
      description: t.connect.pathCloudflareDesc,
      badge: t.connect.pathCloudflareBadge,
    },
    manual: {
      title: t.connect.pathManualTitle,
      description: t.connect.pathManualDesc,
      badge: t.connect.pathManualBadge,
    },
    'dmarc-tool': {
      title: t.connect.pathToolTitle,
      description: t.connect.pathToolDesc,
      badge: t.connect.pathToolBadge,
    },
  } as const;

  const setPathWithUrl = useCallback(
    (next: ConnectPath | null) => {
      setPath(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set('path', next);
      else params.delete('path');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <p className="mb-6">
            {path ? (
              <button
                type="button"
                className={`${linkMuted} text-sm font-mono bg-transparent border-none p-0 cursor-pointer`}
                onClick={() => setPathWithUrl(null)}
              >
                ← {t.connect.title}
              </button>
            ) : (
              <Link href={routes.home} className={`${linkMuted} text-sm font-mono`}>
                {t.connect.backHome}
              </Link>
            )}
          </p>

          <header className="mb-8 sm:mb-10">
            <p className={`${eyebrow} mb-3`}>{t.connect.eyebrow}</p>
            <h1 className={`${pageTitle} mb-4`}>{t.connect.title}</h1>
            <p className={bodyText}>{t.connect.intro}</p>
          </header>

          <section>
            {errorMessage && (
              <div className={alertError}>
                <p className="m-0">{errorMessage}</p>
                {detail && (
                  <p className="m-0 mt-2 font-normal text-rose-400/80 text-xs">{detail}</p>
                )}
              </div>
            )}

            {!path ? (
              <>
                <div className="grid sm:grid-cols-3 gap-3 mb-8">
                  {t.connect.streamCards.map((card) => (
                    <div key={card.title} className={`${panel} p-4`}>
                      <p className={`${eyebrow} m-0`}>{card.title}</p>
                      <p className="text-sm text-muted mt-2 m-0 leading-snug">{card.body}</p>
                    </div>
                  ))}
                </div>
                <p className={`${eyebrow} mb-3`}>{t.connect.mailStreamHow}</p>
              <div className="grid sm:grid-cols-1 gap-3">
                {PATHS.map((key) => {
                  const item = pathCopy[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      className={pathCard}
                      onClick={() => setPathWithUrl(key)}
                    >
                      <span className="flex w-full items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg/80 text-muted group-hover:text-accent">
                          <PathIcon kind={key} />
                        </span>
                        <span className="text-xs font-mono uppercase tracking-widest text-muted-2 bg-bg/80 px-2 py-0.5 rounded-sm">
                          {item.badge}
                        </span>
                      </span>
                      <span className="text-base font-semibold text-txt">{item.title}</span>
                      <span className="text-sm text-muted leading-snug">{item.description}</span>
                    </button>
                  );
                })}
              </div>
              </>
            ) : (
              <section className={panel}>
                <div className={panelHeader}>
                  <h2 className="text-base font-semibold text-txt m-0">{pathCopy[path].title}</h2>
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-2">
                    {pathCopy[path].badge}
                  </span>
                </div>

                <div className={`${panelBody} space-y-5`}>
                  {path === 'cloudflare' ? (
                    <form className="space-y-5" action="/api/connect/cloudflare" method="GET">
                      <div>
                        <label htmlFor="connect-cf-domain" className={label}>
                          {t.connect.yourDomain}
                        </label>
                        <div className="flex items-stretch gap-2 mt-3">
                          <input
                            id="connect-cf-domain"
                            name="domain"
                            type="text"
                            placeholder="example.com"
                            defaultValue={domainPrefill}
                            required
                            autoComplete="off"
                            spellCheck={false}
                            autoFocus
                            className={`${input} flex-1`}
                          />
                          <button type="submit" className={`${btnPrimary} shrink-0 px-4 sm:px-5`}>
                            {t.common.continue}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-muted-2 mb-2">
                          {t.connect.whatDoesThisDo}
                        </p>
                        <p className="text-xs text-muted-2 leading-relaxed m-0">
                          {t.connect.cloudflareExplain}
                        </p>
                      </div>
                    </form>
                  ) : path === 'dmarc-tool' ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm text-muted leading-relaxed mb-4">{t.connect.toolIntro}</p>
                        <CopyableValue text={ruaAddress} />
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-muted-2 mb-2">
                          {t.connect.whatDoesThisDo}
                        </p>
                        <p className="text-xs text-muted-2 leading-relaxed m-0">
                          {t.connect.toolExplain}
                        </p>
                      </div>
                    </div>
                  ) : (
                    dmarcSnippet && (
                      <div className="space-y-5">
                        <div>
                          <p className="text-sm text-muted leading-relaxed mb-4">
                            {t.connect.manualIntro}
                          </p>
                          <CopyableValue text={dmarcSnippet} />
                        </div>
                        <div>
                          <p className="text-xs font-mono uppercase tracking-widest text-muted-2 mb-2">
                            {t.connect.whatDoesThisDo}
                          </p>
                          <p className="text-xs text-muted-2 leading-relaxed m-0">
                            {t.connect.manualExplain}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export function ConnectView(props: ConnectViewProps) {
  const { t } = useLocale();
  return (
    <Suspense fallback={<p className="text-sm text-muted-2 p-12 text-center">{t.common.loading}</p>}>
      <ConnectFlow {...props} />
    </Suspense>
  );
}
