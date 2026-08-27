'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';
import type { Dictionary } from '@/lib/i18n/types';
import type { EvidenceResponse } from '@/lib/evidence';
import { ledgerLeafUrl } from '@/lib/evidence';
import { recordsPath } from '@/lib/routes';
import { linkMuted } from '@/lib/ui';

const MAX_LEAVES = 8;

function chainLabel(t: Dictionary, chain: string | undefined): string {
  if (!chain) return '';
  if (chain === 'base-sepolia') return t.home.chainBaseSepolia;
  return chain;
}

export function EvidenceResult({ result }: { result: EvidenceResponse }) {
  const { t } = useLocale();
  const echo = result.echo?.identity ?? result.identity;
  const shown = result.leaves.slice(0, MAX_LEAVES);
  const chain = chainLabel(t, result.root?.chain);

  return (
    <section className="mt-6">
      <p className="m-0 font-mono text-xs text-muted-2">
        {result.kind}
        <span className="text-muted"> · {echo}</span>
        <span className="text-muted-2"> · {result.count}</span>
      </p>
      {result.root?.hash ? (
        <p className="mt-2 mb-0 text-sm text-muted leading-relaxed break-all">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-2">
            {t.home.proofRoot}
          </span>{' '}
          <span className="font-mono text-xs text-txt">{result.root.hash}</span>
          {chain ? (
            <>
              {' '}
              <span className="text-muted-2">· {chain}</span>
            </>
          ) : null}
        </p>
      ) : null}
      {result.count === 0 ? (
        <p className="mt-3 mb-0 text-sm text-txt">{t.home.proofEmpty}</p>
      ) : (
        <ul className="mt-3 mb-0 p-0 list-none space-y-1.5">
          {shown.map((leaf) => (
            <li key={leaf.leaf_hash} className="m-0">
              <a
                href={ledgerLeafUrl(leaf.leaf_hash)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-accent no-underline hover:underline break-all"
              >
                {leaf.leaf_hash}
              </a>
              {leaf.included ? (
                <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-2">
                  {t.home.proofIncluded}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function LiveProof({
  domain,
  results,
}: {
  domain: string;
  results: EvidenceResponse[];
}) {
  const { t } = useLocale();

  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="m-0 text-xl font-semibold tracking-tight text-txt">{t.home.liveHeading}</h2>
      <p className="mt-2 mb-0 font-mono text-sm text-txt">{domain}</p>
      <div className="mt-2 divide-y divide-border border-y border-border">
        {results.map((result) => (
          <div key={result.kind} className="py-5">
            <EvidenceResult result={result} />
          </div>
        ))}
      </div>
      <p className="mt-4 mb-0">
        <Link href={recordsPath(domain)} className={`${linkMuted} text-sm`}>
          {t.home.liveViewRecord}
        </Link>
      </p>
    </section>
  );
}
