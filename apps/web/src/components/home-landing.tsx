'use client';

import Link from 'next/link';
import { CopyableValue } from '@/components/copy-button';
import { useLocale } from '@/components/locale-provider';
import { routes } from '@/lib/routes';
import { bodyText, btnPrimary, btnSecondary, container, eyebrow, pageIntro, pageTitle } from '@/lib/ui';

export function HomeLanding() {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <section>
        <div className={`${container} pt-20 sm:pt-24 pb-16 sm:pb-20`}>
          <p className={`${eyebrow} text-center mb-4`}>we build real</p>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-txt leading-[1.1] mb-5">
              {t.home.heroTitle}
              <br />
              <span className="text-accent">{t.home.heroAccent}</span>
            </h1>
            <p className={`${pageIntro} max-w-xl mx-auto mb-4`}>{t.home.heroSub}</p>
            <p className={`${bodyText} max-w-xl mx-auto mb-10`}>{t.home.heroLead}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={routes.ledgerKinds} className={btnPrimary}>
                {t.home.primaryCta}
              </a>
              <a href={routes.ledgerEvidence} className={btnSecondary}>
                {t.home.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-20`}>
          <p className={`${eyebrow} mb-3`}>{t.home.brokeEyebrow}</p>
          <h2 className={`${pageTitle} mb-3`}>{t.home.brokeTitle}</h2>
          <p className={`${pageIntro} mb-8`}>{t.home.brokeLead}</p>
          <div className="grid grid-cols-1 gap-3">
            {t.home.identities.map((row) => (
              <div key={row.kind} className="rounded-xl border border-border bg-bg px-5 py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-txt m-0">{row.kind}</h3>
                  <p className={`${eyebrow} m-0`}>{row.tag}</p>
                </div>
                <p className={`${pageIntro} mt-2 m-0`}>{row.identity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className={`${container} py-16 sm:py-20`}>
          <div className="text-center mb-10">
            <p className={`${eyebrow} mb-3`}>{t.home.splitEyebrow}</p>
            <h2 className={`${pageTitle} mb-3`}>{t.home.splitTitle}</h2>
            <p className={`${pageIntro} max-w-2xl mx-auto`}>{t.home.splitLead}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {t.home.splitCards.map((card, index) => (
              <div key={`${card.title}-${index}`} className="rounded-xl border border-border bg-surface px-5 py-5">
                <h3 className="text-base font-semibold text-txt m-0 leading-snug">{card.title}</h3>
                <p className={`${pageIntro} mt-2 m-0`}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-20`}>
          <p className={`${eyebrow} mb-3`}>{t.home.queryEyebrow}</p>
          <h2 className={`${pageTitle} mb-3`}>{t.home.queryTitle}</h2>
          <p className={`${pageIntro} mb-8`}>{t.home.queryLead}</p>
          <div className="space-y-3 mb-10">
            <div>
              <p className={`${eyebrow} mb-2`}>{t.home.endpointKinds}</p>
              <CopyableValue text={routes.ledgerKinds} />
            </div>
            <div>
              <p className={`${eyebrow} mb-2`}>{t.home.endpointEvidence}</p>
              <CopyableValue text={`${routes.ledgerEvidence}?kind=rekor&identity=`} />
            </div>
            <div>
              <p className={`${eyebrow} mb-2`}>{t.home.endpointLeaf}</p>
              <CopyableValue text={`${routes.ledger}/v1/leaves/:hash`} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-xl border border-border bg-bg px-5 py-5">
              <h3 className="text-base font-semibold text-txt m-0">{t.home.echoTitle}</h3>
              <p className={`${pageIntro} mt-2 m-0`}>{t.home.echoBody}</p>
            </div>
            <div className="rounded-xl border border-border bg-bg px-5 py-5">
              <h3 className="text-base font-semibold text-txt m-0">{t.home.emptyTitle}</h3>
              <p className={`${pageIntro} mt-2 m-0`}>{t.home.emptyBody}</p>
            </div>
            <div className="rounded-xl border border-border bg-bg px-5 py-5">
              <h3 className="text-base font-semibold text-txt m-0">{t.home.proofTitle}</h3>
              <p className={`${pageIntro} mt-2 m-0`}>{t.home.proofBody}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className={`${container} py-16 sm:py-20`}>
          <h2 className={`${pageTitle} mb-3`}>{t.home.kindsTitle}</h2>
          <p className={`${pageIntro} mb-8`}>{t.home.kindsLead}</p>
          <div className="grid grid-cols-1 gap-3 mb-10">
            {t.home.kinds.map((kind) => (
              <div key={kind.title} className="rounded-xl border border-border bg-surface px-5 py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-txt m-0">{kind.title}</h3>
                  <p className={`${eyebrow} m-0`}>
                    {kind.key} · {kind.stake}
                  </p>
                </div>
                <p className={`${pageIntro} mt-2 m-0`}>{kind.body}</p>
              </div>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-txt mb-3">{t.home.stakeTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface px-5 py-5">
              <p className={`${eyebrow} m-0`}>accumulated</p>
              <p className={`${pageIntro} mt-2 m-0`}>{t.home.stakeAccumulated}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-5 py-5">
              <p className={`${eyebrow} m-0`}>calendar</p>
              <p className={`${pageIntro} mt-2 m-0`}>{t.home.stakeCalendar}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-20`}>
          <h2 className={`${pageTitle} mb-3`}>{t.home.treeTitle}</h2>
          <p className={`${pageIntro} m-0`}>{t.home.treeBody}</p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className={`${container} py-16 sm:py-20`}>
          <h2 className={`${pageTitle} mb-6`}>{t.home.willNotTitle}</h2>
          <ul className="m-0 p-0 list-none space-y-3">
            {t.home.willNot.map((item) => (
              <li key={item} className={`${pageIntro} rounded-xl border border-border bg-surface px-5 py-4 m-0`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className={`${container} py-16 sm:py-20`}>
          <h2 className={`${pageTitle} mb-6`}>{t.home.pressuresTitle}</h2>
          <ul className="m-0 p-0 list-none space-y-3">
            {t.home.pressures.map((item) => (
              <li key={item} className={`${pageIntro} rounded-xl border border-border bg-bg px-5 py-4 m-0`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border">
        <div className={`${container} py-16 sm:py-20`}>
          <div className="max-w-xl mx-auto text-center">
            <h2 className={`${pageTitle} mb-4`}>{t.home.intakeTitle}</h2>
            <p className={`${pageIntro} mb-8`}>{t.home.intakeBody}</p>
            <Link href={routes.connect} className={btnSecondary}>
              {t.home.intakeCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
