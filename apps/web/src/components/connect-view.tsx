'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { DnsPathFlow } from '@/components/dns-path-flow';
import { useLocale } from '@/components/locale-provider';
import type { ConnectPath } from '@/lib/connect-path';
import type { Dictionary } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { alertError, bodyText, eyebrow, linkMuted, pageTitle } from '@/lib/ui';

type ConnectErrorKey = keyof Dictionary['connect']['errors'];

interface ConnectViewProps {
  errorKey?: string;
  detail?: string;
  domainPrefill: string;
  dmarcSnippet: string;
  ruaAddress: string;
  initialPath: ConnectPath | null;
}

export function ConnectView({
  errorKey,
  detail,
  domainPrefill,
  dmarcSnippet,
  ruaAddress,
  initialPath,
}: ConnectViewProps) {
  const { t } = useLocale();
  const errors = t.connect.errors;
  const errorMessage = errorKey
    ? errors[errorKey as ConnectErrorKey] ?? errors.somethingWrong
    : null;

  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <p className="mb-6">
            <Link href={routes.home} className={`${linkMuted} text-sm font-mono`}>
              {t.connect.backHome}
            </Link>
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

            <Suspense fallback={<p className="text-sm text-muted-2">{t.common.loading}</p>}>
              <DnsPathFlow
                domainPrefill={domainPrefill}
                dmarcSnippet={dmarcSnippet}
                ruaAddress={ruaAddress}
                initialPath={initialPath}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
