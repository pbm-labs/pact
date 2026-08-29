'use client';

import { useLocale } from '@/components/locale-provider';

export function LeftoverPoints() {
  const { t } = useLocale();
  const points = [
    { title: t.home.uncommissionedHeading, body: t.home.uncommissionedBody },
    { title: t.home.outlivesHeading, body: t.home.outlivesBody },
    { title: t.home.governedHeading, body: t.home.governedBody },
  ];

  return (
    <div className="mt-14 sm:mt-16 divide-y divide-border border-y border-border">
      {points.map((point) => (
        <section key={point.title} className="py-8 sm:py-10 first:pt-8">
          <h2 className="m-0 text-xl font-semibold tracking-tight text-txt">{point.title}</h2>
          <p className="mt-3 mb-0 text-sm sm:text-base text-muted leading-relaxed max-w-xl">
            {point.body}
          </p>
        </section>
      ))}
    </div>
  );
}
