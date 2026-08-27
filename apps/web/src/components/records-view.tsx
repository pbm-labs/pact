'use client';

import { EvidenceResult } from '@/components/live-proof';
import { StreamCard } from '@/components/stream-card';
import { PageShell } from '@/components/page-shell';
import { useLocale } from '@/components/locale-provider';
import type { EvidenceResponse } from '@/lib/evidence';
import type { CatalogKind } from '@/lib/kind-catalog';
import { routes } from '@/lib/routes';

export function RecordsView({
  domain,
  kinds,
  results,
}: {
  domain: string;
  kinds: CatalogKind[];
  results: EvidenceResponse[];
}) {
  const { t } = useLocale();
  const byKind = new Map(results.map((row) => [row.kind, row]));

  return (
    <PageShell backHref={routes.home} backLabel={t.common.home}>
      <header className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-2 mb-3">
          {t.home.recordsHeading}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-txt leading-tight m-0 break-all">
          {domain}
        </h1>
      </header>

      <ol className="m-0 p-0 list-none divide-y divide-border border-y border-border">
        {kinds.map((kind) => {
          const result = byKind.get(kind.id) ?? {
            kind: kind.id,
            identity: domain,
            count: 0,
            truncated: false,
            leaves: [],
          };
          return (
            <StreamCard key={kind.id} kind={kind}>
              <EvidenceResult result={result} />
            </StreamCard>
          );
        })}
      </ol>
    </PageShell>
  );
}
