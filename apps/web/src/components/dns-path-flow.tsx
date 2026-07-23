'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CopyButton } from '@/components/copy-button';
import type { ConnectPath, DnsPath } from '@/lib/connect-path';
import {
  btnPrimaryBlock,
  btnSecondaryBlock,
  input,
  label,
  linkAccent,
  panel,
  panelBody,
  pathCard,
  snippetPre,
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
  mode: 'connect' | 'disconnect';
  variant?: 'default' | 'movement';
  domainPrefill?: string;
  dmarcSnippet?: string;
  ruaAddress?: string;
  initialPath?: ConnectPath | DnsPath | null;
}

const DEFAULT_PATH_COPY = {
  connect: {
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
  },
  disconnect: {
    cloudflare: {
      title: 'I use Cloudflare',
      description: 'One click and we remove ourselves, no trace left behind.',
      badge: 'Fastest',
    },
    manual: {
      title: 'Remove it manually',
      description: 'Remove one line from wherever you manage your website, then confirm here.',
      badge: 'Universal',
    },
  },
} as const;

const MOVEMENT_PATH_COPY = {
  connect: DEFAULT_PATH_COPY.connect,
  disconnect: DEFAULT_PATH_COPY.disconnect,
} as const;

export function DnsPathFlow({
  mode,
  variant = 'default',
  domainPrefill = '',
  dmarcSnippet,
  ruaAddress = 'rua@pact.pbm-labs.com',
  initialPath = null,
}: DnsPathFlowProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [path, setPath] = useState<ConnectPath | DnsPath | null>(initialPath);

  const setPathWithUrl = useCallback(
    (next: ConnectPath | DnsPath | null) => {
      setPath(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set('path', next);
      else params.delete('path');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const apiBase = mode === 'connect' ? '/api/connect' : '/api/disconnect';
  const copy =
    variant === 'movement' && mode === 'connect'
      ? MOVEMENT_PATH_COPY.connect
      : DEFAULT_PATH_COPY[mode];

  const connectPaths: ConnectPath[] =
    mode === 'connect' && variant === 'movement'
      ? ['cloudflare', 'manual', 'dmarc-tool']
      : mode === 'connect'
        ? ['cloudflare', 'manual']
        : [];

  const disconnectPaths: DnsPath[] = ['cloudflare', 'manual'];

  if (!path) {
    const paths = mode === 'connect' ? connectPaths : disconnectPaths;
    return (
      <div
        className={
          paths.length === 3 ? 'grid sm:grid-cols-1 gap-3' : 'grid sm:grid-cols-2 gap-3'
        }
      >
        {paths.map((key) => {
          const item = copy[key as keyof typeof copy];
          return (
            <button
              key={key}
              type="button"
              className={pathCard}
              onClick={() => setPathWithUrl(key)}
            >
              <span className="flex w-full items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg/80 text-muted group-hover:text-accent">
                  <PathIcon kind={key as ConnectPath} />
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

  const pathCopy = copy[path as keyof typeof copy];

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
        <div
          className={`${panelBody} border-b border-border flex items-center justify-between gap-3`}
        >
          <h2 className="text-base font-semibold text-txt m-0">{pathCopy.title}</h2>
          <span className="text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
            {pathCopy.badge}
          </span>
        </div>

        <div className={panelBody}>
          {path === 'cloudflare' ? (
            <form className="flex flex-col gap-2" action={`${apiBase}/cloudflare`} method="GET">
              <label htmlFor={`${mode}-cf-domain`} className={label}>
                Your name
              </label>
              <input
                id={`${mode}-cf-domain`}
                name="domain"
                type="text"
                placeholder="example.com"
                defaultValue={domainPrefill}
                required
                autoComplete="off"
                spellCheck={false}
                autoFocus
                className={input}
              />
              <button type="submit" className={btnPrimaryBlock}>
                {mode === 'connect' ? 'Continue with Cloudflare' : 'Disconnect with Cloudflare'}
              </button>
            </form>
          ) : path === 'dmarc-tool' && mode === 'connect' ? (
            <>
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-sm text-muted mb-3 leading-relaxed">
                  In your tool&apos;s settings, add this as a report destination:
                </p>
                {dmarcSnippet && (
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <pre className={`${snippetPre} flex-1`}>{ruaAddress}</pre>
                    <CopyButton text={ruaAddress} label="Copy" />
                  </div>
                )}
                <p className="text-xs text-muted-2 leading-relaxed">
                  Save it, wait a moment for it to take effect, then enter your name below.
                </p>
              </div>
              <form className="flex flex-col gap-2" action={`${apiBase}/manual`} method="POST">
                <label htmlFor={`${mode}-tool-domain`} className={label}>
                  Your name
                </label>
                <input
                  id={`${mode}-tool-domain`}
                  name="domain"
                  type="text"
                  placeholder="example.com"
                  defaultValue={domainPrefill}
                  required
                  autoComplete="off"
                  spellCheck={false}
                  className={input}
                />
                <button type="submit" className={btnPrimaryBlock}>
                  Add my name
                </button>
              </form>
            </>
          ) : mode === 'connect' ? (
            <>
              {dmarcSnippet && (
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-sm text-muted mb-3">
                    Paste this wherever you manage your website&apos;s settings (ask your host if
                    you&apos;re not sure where):
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <pre className={`${snippetPre} flex-1`}>{dmarcSnippet}</pre>
                    <CopyButton text={dmarcSnippet} label="Copy" />
                  </div>
                  <details className="mt-3">
                    <summary className="text-xs text-muted-2 cursor-pointer hover:text-muted transition-colors">
                      What does this do?
                    </summary>
                    <p className="text-xs text-muted-2 mt-2 leading-relaxed">
                      This is a DMARC record — an email security standard mail providers already
                      use. Adding it doesn&apos;t change how you send email; it just tells
                      providers to also send us a copy of the verification result. If you already
                      have one of these, just add our address to it instead of replacing it.
                    </p>
                  </details>
                </div>
              )}
              <form className="flex flex-col gap-2" action={`${apiBase}/manual`} method="POST">
                <label htmlFor={`${mode}-manual-domain`} className={label}>
                  Your name
                </label>
                <input
                  id={`${mode}-manual-domain`}
                  name="domain"
                  type="text"
                  placeholder="example.com"
                  defaultValue={domainPrefill}
                  required
                  autoComplete="off"
                  spellCheck={false}
                  className={input}
                />
                <button type="submit" className={btnPrimaryBlock}>
                  Add my name
                </button>
                <p className="text-xs text-muted-2 mt-1">Only click after you&apos;ve pasted it.</p>
              </form>
            </>
          ) : (
            <form className="flex flex-col gap-2" action={`${apiBase}/manual`} method="POST">
              <p className="text-sm text-muted mb-2">
                First remove the line we gave you from wherever you manage your website.
              </p>
              <label htmlFor={`${mode}-manual-domain`} className={label}>
                Your name
              </label>
              <input
                id={`${mode}-manual-domain`}
                name="domain"
                type="text"
                placeholder="example.com"
                defaultValue={domainPrefill}
                required
                autoComplete="off"
                spellCheck={false}
                className={input}
              />
              <button type="submit" className={btnSecondaryBlock}>
                Remove my name
              </button>
            </form>
          )}
        </div>
      </section>

      <p className="mt-6 text-center text-sm text-muted-2">
        {mode === 'connect' ? (
          <>
            Need to leave?{' '}
            <Link
              href={`/disconnect${domainPrefill ? `?domain=${encodeURIComponent(domainPrefill)}` : ''}`}
              className={linkAccent}
            >
              Disconnect
            </Link>
          </>
        ) : (
          <>
            Changed your mind?{' '}
            <Link href="/how-it-works#add-your-name" className={linkAccent}>
              Add your name
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
