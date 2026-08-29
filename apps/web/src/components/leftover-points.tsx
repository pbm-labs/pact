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
    <div className="divide-y divide-border">
      {points.map((point, i) => (
        <section key={point.title} className={`${i === 0 ? 'pb-10' : 'py-10'}`}>
          <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-txt">
            {point.title}
          </h2>
          <p className="mt-4 mb-0 text-base text-muted leading-relaxed max-w-xl">
            {point.body}
          </p>
        </section>
      ))}
    </div>
  );
}
