'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import { PageShell } from '@/components/page-shell';
import { eyebrow, pageIntro, pageTitle } from '@/lib/ui';

export function RoadmapView() {
  const { t } = useLocale();

  return (
    <PageShell backHref="/docs" backLabel={t.docs.title}>
      <header className="mb-12">
        <p className={`${eyebrow} mb-3`}>{t.roadmap.eyebrow}</p>
        <h1 className={`${pageTitle} text-2xl sm:text-3xl mb-4`}>{t.roadmap.title}</h1>
        <p className={`${pageIntro} max-w-xl`}>{t.roadmap.intro}</p>
      </header>

      <div className="space-y-12">
        <section>
          <h2 className="text-base font-semibold text-txt m-0 mb-4">{t.roadmap.nowTitle}</h2>
          <ul className="m-0 pl-5 list-disc space-y-2 text-sm sm:text-[15px] text-muted leading-relaxed">
            {t.roadmap.nowItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-txt m-0 mb-4">{t.roadmap.nextTitle}</h2>
          <ul className="m-0 pl-5 list-disc space-y-2 text-sm sm:text-[15px] text-muted leading-relaxed">
            {t.roadmap.nextItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-2 leading-relaxed mt-4 m-0 max-w-xl">{t.roadmap.nextNote}</p>
        </section>
      </div>

      <aside className="mt-12 pt-8 border-t border-border">
        <p className="text-sm m-0">
          <Link href="/whitepaper" className="text-accent font-semibold no-underline hover:opacity-90">
            {t.roadmap.whitepaperLink}
          </Link>
        </p>
      </aside>
    </PageShell>
  );
}
