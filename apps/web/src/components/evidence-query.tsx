'use client';

import { FormEvent, useMemo, useState } from 'react';
import { EvidenceResult } from '@/components/live-proof';
import { streamCopy } from '@/components/stream-card';
import { useLocale } from '@/components/locale-provider';
import { fetchEvidence, type EvidenceResponse } from '@/lib/evidence';
import type { CatalogKind } from '@/lib/kind-catalog';
import { btnPrimary, input, label } from '@/lib/ui';

export function EvidenceQuery({ kinds }: { kinds: CatalogKind[] }) {
  const { t } = useLocale();
  const [kindId, setKindId] = useState(kinds[0]?.id ?? 'mail');
  const [identity, setIdentity] = useState('');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<EvidenceResponse | null>(null);
  const [failed, setFailed] = useState(false);

  const selected = useMemo(
    () => kinds.find((kind) => kind.id === kindId) ?? kinds[0],
    [kinds, kindId],
  );
  const placeholder = selected ? streamCopy(t, selected).identity : t.home.identityLabel;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = identity.trim();
    if (!trimmed || !kindId) return;
    setPending(true);
    setFailed(false);
    const row = await fetchEvidence(kindId, trimmed);
    setPending(false);
    if (!row) {
      setResult(null);
      setFailed(true);
      return;
    }
    setResult(row);
  }

  if (kinds.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-14">
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-[8.5rem_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="evidence-kind" className={label}>
            {t.home.streamLabel}
          </label>
          <select
            id="evidence-kind"
            value={kindId}
            onChange={(event) => {
              setKindId(event.target.value);
              setResult(null);
              setFailed(false);
            }}
            className={`${input} mt-1.5 appearance-none`}
          >
            {kinds.map((kind) => (
              <option key={kind.id} value={kind.id}>
                {streamCopy(t, kind).name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="evidence-identity" className={label}>
            {t.home.identityLabel}
          </label>
          <input
            id="evidence-identity"
            value={identity}
            onChange={(event) => setIdentity(event.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            className={`${input} mt-1.5`}
          />
        </div>
        <button type="submit" className={`${btnPrimary} w-full sm:w-auto`} disabled={pending || !identity.trim()}>
          {pending ? t.common.loading : t.home.querySubmit}
        </button>
      </form>
      <p className="mt-3 mb-0 text-xs text-muted-2">{t.home.queryHint}</p>
      {failed ? <p className="mt-4 mb-0 text-sm text-rose-500">{t.home.queryFailed}</p> : null}
      {result ? (
        <div className="mt-2 border-t border-border">
          <EvidenceResult result={result} />
        </div>
      ) : null}
    </section>
  );
}
