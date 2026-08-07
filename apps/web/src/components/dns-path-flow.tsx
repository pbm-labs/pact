'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CopyableValue } from '@/components/copy-button';
import type { ConnectPath } from '@/lib/connect-path';
import {
  btnPrimary,
  input,
  label,
  panel,
  panelBody,
  panelHeader,
  pathCard,
} from '@/lib/ui';

export type { ConnectPath, DnsPath } from '@/lib/connect-path';

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

interface DnsPathFlowProps {
  variant?: 'default' | 'movement';
  domainPrefill?: string;
  dmarcSnippet?: string;
  ruaAddress?: string;
  initialPath?: ConnectPath | null;
}

const PATH_COPY = {
  cloudflare: {
    title: 'I use Cloudflare',
    description: 'One click — we handle the rest.',
    badge: 'Fastest',
  },
  manual: {
    title: 'Add it manually',
    description: 'One line to paste wherever you manage your website — GoDaddy, Namecheap, or any other host.',
    badge: 'Universal',
  },
  'dmarc-tool': {
    title: 'I use an email security tool',
    description: 'Postmark, EasyDMARC, or similar — point it to us.',
    badge: 'Existing tool',
  },
} as const;

export function DnsPathFlow({
  variant = 'default',
  domainPrefill = '',
  dmarcSnippet,
  ruaAddress = 'rua@pact.pbm-labs.com',
  initialPath = null,
}: DnsPathFlowProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [path, setPath] = useState<ConnectPath | null>(initialPath);

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

  const paths: ConnectPath[] =
    variant === 'movement' ? ['cloudflare', 'manual', 'dmarc-tool'] : ['cloudflare', 'manual'];

  if (!path) {
    return (
      <div
        className={
          paths.length === 3 ? 'grid sm:grid-cols-1 gap-3' : 'grid sm:grid-cols-2 gap-3'
        }
      >
        {paths.map((key) => {
          const item = PATH_COPY[key];
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
                <span className="text-[0.6rem] font-mono uppercase tracking-widest text-muted-2 bg-bg/80 px-2 py-0.5 rounded-sm">
                  {item.badge}
                </span>
              </span>
              <span className="text-base font-semibold text-txt">{item.title}</span>
              <span className="text-sm text-muted leading-snug">{item.description}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const pathCopy = PATH_COPY[path];

  return (
    <div>
      <button
        type="button"
        className="mb-6 text-sm text-muted-2 hover:text-txt transition-colors bg-transparent border-none p-0 cursor-pointer font-mono"
        onClick={() => setPathWithUrl(null)}
      >
        ← Choose a different way
      </button>

      <section className={panel}>
        <div className={panelHeader}>
          <h2 className="text-base font-semibold text-txt m-0">{pathCopy.title}</h2>
          <span className="text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
            {pathCopy.badge}
          </span>
        </div>

        <div className={`${panelBody} space-y-5`}>
          {path === 'cloudflare' ? (
            <form className="space-y-5" action="/api/connect/cloudflare" method="GET">
              <div>
                <label htmlFor="connect-cf-domain" className={label}>
                  Your domain
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
                    Continue
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-2 mb-2">
                  What does this do?
                </p>
                <p className="text-xs text-muted-2 leading-relaxed m-0">
                  You&apos;ll sign in to Cloudflare and we&apos;ll add the verification record for
                  you. Nothing about how you send email changes.
                </p>
              </div>
            </form>
          ) : path === 'dmarc-tool' ? (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  In your tool&apos;s settings, add this as a report destination:
                </p>
                <CopyableValue text={ruaAddress} />
                <p className="text-xs text-muted-2 leading-relaxed mt-4">
                  Save it, and you&apos;re set.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-2 mb-2">
                  What does this do?
                </p>
                <p className="text-xs text-muted-2 leading-relaxed m-0">
                  Your tool already handles email authentication. Pointing it here just tells it
                  to also send us a copy of the verification result. Nothing about how you send
                  email changes.
                </p>
              </div>
            </div>
          ) : (
            dmarcSnippet && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    Paste this wherever you manage your website&apos;s settings (ask your host if
                    you&apos;re not sure where):
                  </p>
                  <CopyableValue text={dmarcSnippet} />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-2 mb-2">
                    What does this do?
                  </p>
                  <p className="text-xs text-muted-2 leading-relaxed m-0">
                    This is a DMARC record — an email security standard mail providers already
                    use. Adding it doesn&apos;t change how you send email; it just tells
                    providers to also send us a copy of the verification result. If you already
                    have one of these, just add our address to it instead of replacing it.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
