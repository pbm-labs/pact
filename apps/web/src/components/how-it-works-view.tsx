'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { DnsPathFlow } from '@/components/dns-path-flow';
import { useLocale } from '@/components/locale-provider';
import type { ConnectPath } from '@/lib/connect-path';
import type { Dictionary } from '@/lib/i18n';
import { alertError, eyebrow, linkMuted, pageTitle } from '@/lib/ui';

type HowItWorksErrorKey = keyof Dictionary['howItWorks']['errors'];

interface HowItWorksViewProps {
  errorKey?: string;
  detail?: string;
  domainPrefill: string;
  dmarcSnippet: string;
  ruaAddress: string;
  initialPath: ConnectPath | null;
}

export function HowItWorksView({
  errorKey,
  detail,
  domainPrefill,
  dmarcSnippet,
  ruaAddress,
  initialPath,
}: HowItWorksViewProps) {
  const { t } = useLocale();
  const errors = t.howItWorks.errors;
  const errorMessage = errorKey
    ? errors[errorKey as HowItWorksErrorKey] ?? errors.somethingWrong
    : null;

  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <p className="mb-6">
            <Link href="/" className={`${linkMuted} text-sm font-mono`}>
              {t.howItWorks.backHome}
            </Link>
          </p>

          <header id="add-your-domain" className="mb-8 sm:mb-10 scroll-mt-8">
            <p className={`${eyebrow} mb-3`}>{t.howItWorks.eyebrow}</p>
            <h1 className={`${pageTitle} text-2xl sm:text-3xl mb-4`}>{t.howItWorks.title}</h1>
            <p className="text-base text-muted leading-relaxed">{t.howItWorks.intro}</p>
            <p className="mt-4 text-sm m-0">
              <Link
                href="/domain/pbm-labs.com"
                className="text-accent font-semibold no-underline hover:opacity-90"
              >
                {t.howItWorks.seeLiveDomain}
              </Link>
            </p>
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
