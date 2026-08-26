'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import type { CatalogKind } from '@/lib/kind-catalog';
import type { Dictionary, StreamCopy } from '@/lib/i18n/types';
import { routes } from '@/lib/routes';
import { container, linkMuted } from '@/lib/ui';

function streamCopy(t: Dictionary, kind: CatalogKind): StreamCopy {
  const known = t.home.streams[kind.id];
  if (known) return known;
  const identity = [kind.key.shape, ...(kind.key.forms ?? [])].filter(Boolean).join(' · ');
  return {
    name: kind.id,
    what: t.home.unknownWhat,
    identity: identity || kind.id,
    empty: t.home.unknownEmpty,
  };
}

function stakeCopy(t: Dictionary, stake: string): { label: string; hint: string } {
  if (stake === 'calendar') {
    return { label: t.home.stakeCalendar, hint: t.home.stakeCalendarHint };
  }
  if (stake === 'counterparty') {
    return { label: t.home.stakeCounterparty, hint: t.home.stakeCounterpartyHint };
  }
  return { label: stake, hint: '' };
}

export function HomeLanding({ kinds }: { kinds: CatalogKind[] }) {
  const { t, locale } = useLocale();

  return (
    <main className="flex-1" key={locale}>
      <div className={`${container} pt-16 sm:pt-24 pb-20 sm:pb-28`}>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-txt leading-tight m-0">
          {t.home.title}
        </h1>
        <p className="mt-4 mb-0 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
          {t.home.lede}
        </p>

        <ol className="mt-14 sm:mt-16 m-0 p-0 list-none divide-y divide-border border-y border-border">
          {kinds.map((kind) => {
            const copy = streamCopy(t, kind);
            const stake = stakeCopy(t, kind.stake);

            return (
              <li key={kind.id} className="py-8 sm:py-10">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <h2 className="m-0 text-xl font-semibold tracking-tight text-txt">{copy.name}</h2>
                  <p className="m-0 font-mono text-xs text-muted-2">{kind.id}</p>
                </div>
                <p className="mt-3 mb-0 text-sm sm:text-base text-muted leading-relaxed">
                  {copy.what}
                </p>

                <dl className="mt-6 grid gap-3 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-1 sm:gap-4">
                    <dt className="m-0 font-mono text-xs uppercase tracking-widest text-muted-2">
                      {t.home.identityLabel}
                    </dt>
                    <dd className="m-0 text-txt">{copy.identity}</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-1 sm:gap-4">
                    <dt className="m-0 font-mono text-xs uppercase tracking-widest text-muted-2">
                      {t.home.stakeLabel}
                    </dt>
                    <dd className="m-0 text-txt">
                      <span className="font-mono text-sm">{stake.label}</span>
                      {stake.hint ? (
                        <span className="block mt-1 text-muted leading-relaxed">{stake.hint}</span>
                      ) : null}
                    </dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-1 sm:gap-4">
                    <dt className="m-0 font-mono text-xs uppercase tracking-widest text-muted-2">
                      {t.home.emptyLabel}
                    </dt>
                    <dd className="m-0 text-txt">{copy.empty}</dd>
                  </div>
                </dl>

                {kind.id === 'mail' ? (
                  <p className="mt-6 mb-0">
                    <Link href={routes.connect} className="text-sm font-medium text-accent no-underline hover:underline">
                      {t.home.intakeCta}
                    </Link>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>

        <p className="mt-10 mb-0 text-sm text-muted-2">
          {t.home.agents}{' '}
          <a href={routes.ledgerKinds} className={`${linkMuted} font-mono`}>
            {t.home.catalog}
          </a>
        </p>
      </div>
    </main>
  );
}
