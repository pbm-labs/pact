'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { SharePublicRecord } from '@/components/share-public-record';
import { routes } from '@/lib/routes';
import {
  badgeVerified,
  btnGhost,
  btnPrimary,
  pageTitle,
  panel,
  panelBody,
  panelSectionTitle,
} from '@/lib/ui';

interface ConnectSuccessViewProps {
  domain: string;
}

export function ConnectSuccessView({ domain }: ConnectSuccessViewProps) {
  const { t } = useLocale();
  const [recordUrl, setRecordUrl] = useState(
    `https://pact.pbm-labs.com${routes.record(domain)}`,
  );

  useEffect(() => {
    if (domain) {
      setRecordUrl(`${window.location.origin}${routes.record(domain)}`);
    }
  }, [domain]);

  if (!domain) {
    return (
      <PageShell backHref={routes.connect} backLabel={t.domain.connectDomain} centered>
        <h1 className={pageTitle}>{t.domain.connected}</h1>
        <p className="text-sm text-muted mt-2 mb-6">{t.connectSuccess.missing}</p>
        <Link href={routes.connect} className={btnPrimary}>
          {t.connectSuccess.tryAgain}
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell backHref={routes.records} backLabel={t.domain.backRecords} centered>
      <div className="mb-8">
        <span className={`${badgeVerified} mb-4`}>{t.connectSuccess.added}</span>
        <h1 className={`${pageTitle} break-all`}>{domain}</h1>
        <p className="text-sm text-muted-2 font-mono mt-2">{t.connectSuccess.cloudflare}</p>
      </div>

      <section className={`${panel} w-full text-left mb-6`}>
        <div className={`${panelBody} space-y-5`}>
          <SharePublicRecord domain={domain} recordUrl={recordUrl} />
        </div>
      </section>

      <section className={`${panel} w-full text-left mb-8`}>
        <div className={panelBody}>
          <h2 className={panelSectionTitle}>{t.connectSuccess.whatNext}</h2>
          <ol className="text-sm text-muted space-y-2 pl-4 border-l border-border m-0">
            <li>{t.connectSuccess.next1}</li>
            <li>{t.connectSuccess.next2}</li>
            <li>{t.connectSuccess.next3}</li>
          </ol>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href={routes.record(domain)} className={btnPrimary}>
          {t.connectSuccess.viewDomain} {domain}
        </Link>
        <Link href={routes.records} className={btnGhost}>
          {t.connectSuccess.allRecords}
        </Link>
      </div>
    </PageShell>
  );
}
