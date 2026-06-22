'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CopyButton } from '@/components/copy-button';
import {
  btnPrimaryBlock,
  btnSecondaryBlock,
  eyebrow,
  inlineCode,
  input,
  label,
  linkAccent,
  panel,
  panelBody,
  pathCard,
  snippetPre,
} from '@/lib/ui';

export type DnsPath = 'cloudflare' | 'manual';

interface DnsPathFlowProps {
  mode: 'connect' | 'disconnect';
  domainPrefill?: string;
  dmarcSnippet?: string;
  initialPath?: DnsPath | null;
}

const PATH_COPY = {
  connect: {
    cloudflare: {
      title: 'Cloudflare',
      description: 'DNS on Cloudflare. Authorize once — PACT updates your _dmarc record.',
      badge: 'Fastest',
    },
    manual: {
      title: 'Manual DNS',
      description: 'GoDaddy, Namecheap, Route 53 console, or any other host. Copy a snippet, then register.',
      badge: 'Universal',
    },
  },
  disconnect: {
    cloudflare: {
      title: 'Cloudflare',
      description: 'Authorize once — PACT removes itself from _dmarc and unregisters the domain.',
      badge: 'Fastest',
    },
    manual: {
      title: 'Manual DNS',
      description: 'Remove PACT from _dmarc at your DNS provider, then unregister here.',
      badge: 'Universal',
    },
  },
} as const;

export function DnsPathFlow({
  mode,
  domainPrefill = '',
  dmarcSnippet,
  initialPath = null,
}: DnsPathFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [path, setPath] = useState<DnsPath | null>(initialPath);

  const setPathWithUrl = useCallback(
    (next: DnsPath | null) => {
      setPath(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set('path', next);
      else params.delete('path');
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    },
    [router, searchParams],
  );

  const apiBase = mode === 'connect' ? '/api/connect' : '/api/disconnect';
  const copy = PATH_COPY[mode];

  if (!path) {
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        {(['cloudflare', 'manual'] as const).map((key) => (
          <button key={key} type="button" className={pathCard} onClick={() => setPathWithUrl(key)}>
            <span className="text-[0.6rem] font-mono uppercase tracking-widest text-muted-2 bg-bg/80 px-2 py-0.5 rounded-sm">
              {copy[key].badge}
            </span>
            <span className="text-base font-semibold text-txt">{copy[key].title}</span>
            <span className="text-sm text-muted leading-snug">{copy[key].description}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="mb-6 text-sm text-muted-2 hover:text-txt transition-colors bg-transparent border-none p-0 cursor-pointer font-mono"
        onClick={() => setPathWithUrl(null)}
      >
        ← Choose a different method
      </button>

      <section className={panel}>
        <div className={`${panelBody} border-b border-border flex items-center justify-between gap-3`}>
          <h2 className="text-base font-semibold text-txt m-0">{copy[path].title}</h2>
          <span className="text-[0.6rem] font-mono uppercase tracking-widest text-muted-2">
            {copy[path].badge}
          </span>
        </div>

        <div className={panelBody}>
          {path === 'cloudflare' ? (
            <form className="flex flex-col gap-2" action={`${apiBase}/cloudflare`} method="GET">
              <label htmlFor={`${mode}-cf-domain`} className={label}>
                Domain name
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
          ) : mode === 'connect' ? (
            <>
              {dmarcSnippet && (
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-sm text-muted mb-3">
                    Add to <code className={inlineCode}>_dmarc.yourdomain.com</code> (TXT)
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <pre className={`${snippetPre} flex-1`}>{dmarcSnippet}</pre>
                    <CopyButton text={dmarcSnippet} label="Copy record" />
                  </div>
                  <p className="text-xs text-muted-2 mt-3">
                    Already have <code className={inlineCode}>_dmarc</code>? Append the{' '}
                    <code className={inlineCode}>rua=</code> address to your existing record.
                  </p>
                </div>
              )}
              <form className="flex flex-col gap-2" action={`${apiBase}/manual`} method="POST">
                <label htmlFor={`${mode}-manual-domain`} className={label}>
                  Domain name
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
                  Register domain
                </button>
                <p className="text-xs text-muted-2 mt-1">
                  Only click after your DNS record is updated.
                </p>
              </form>
            </>
          ) : (
            <form className="flex flex-col gap-2" action={`${apiBase}/manual`} method="POST">
              <p className="text-sm text-muted mb-2">
                Remove PACT from your <code className={inlineCode}>_dmarc</code> record at your DNS
                provider first.
              </p>
              <label htmlFor={`${mode}-manual-domain`} className={label}>
                Domain name
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
                Unregister domain
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
              Disconnect a domain
            </Link>
          </>
        ) : (
          <>
            Changed your mind?{' '}
            <Link
              href={`/connect${domainPrefill ? `?domain=${encodeURIComponent(domainPrefill)}` : ''}`}
              className={linkAccent}
            >
              Connect a domain
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
