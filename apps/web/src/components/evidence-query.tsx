'use client';

import { useState, type FormEvent } from 'react';
import { CopyableValue } from '@/components/copy-button';
import { useLocale } from '@/components/locale-provider';
import {
  EVIDENCE_KINDS,
  type EvidenceKind,
  ledgerEvidenceUrl,
  ledgerLeafUrl,
} from '@/lib/routes';
import { btnPrimary, input, label } from '@/lib/ui';

const PLACEHOLDER: Record<EvidenceKind, string> = {
  mail: 'example.com',
  ct: 'example.com',
  rekor: 'https://github.com/org/repo',
};

type EvidenceLeaf = {
  leaf_hash: string;
  leaf_index: number;
  included: boolean;
};

type EvidenceOk = {
  kind: string;
  identity: string;
  count: number;
  truncated: boolean;
  leaves: EvidenceLeaf[];
};

type QueryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'invalid' }
  | { status: 'error' }
  | { status: 'ok'; url: string; body: EvidenceOk };

export function EvidenceQuery() {
  const { t } = useLocale();
  const [kind, setKind] = useState<EvidenceKind>('mail');
  const [identity, setIdentity] = useState('');
  const [query, setQuery] = useState<QueryState>({ status: 'idle' });

  const labels: Record<EvidenceKind, string> = {
    mail: t.home.kindMail,
    ct: t.home.kindCt,
    rekor: t.home.kindRekor,
  };
  const hints: Record<EvidenceKind, string> = {
    mail: t.home.hintMail,
    ct: t.home.hintCt,
    rekor: t.home.hintRekor,
  };

  async function lookup(event: FormEvent) {
    event.preventDefault();
    const trimmed = identity.trim();
    if (!trimmed) return;
    const url = ledgerEvidenceUrl(kind, trimmed);
    setQuery({ status: 'loading' });
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.status === 400) {
        setQuery({ status: 'invalid' });
        return;
      }
      if (!res.ok) {
        setQuery({ status: 'error' });
        return;
      }
      const body = (await res.json()) as EvidenceOk;
      if (typeof body.identity !== 'string' || !Array.isArray(body.leaves)) {
        setQuery({ status: 'error' });
        return;
      }
      setQuery({
        status: 'ok',
        url,
        body: {
          kind: body.kind,
          identity: body.identity,
          count: body.count ?? body.leaves.length,
          truncated: Boolean(body.truncated),
          leaves: body.leaves,
        },
      });
    } catch {
      setQuery({ status: 'error' });
    }
  }

  return (
    <form className="rounded-2xl border border-border bg-surface p-5 sm:p-6" onSubmit={lookup}>
      <div className="flex flex-wrap gap-2 mb-4">
        {EVIDENCE_KINDS.map((id) => {
          const active = kind === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setKind(id);
                setQuery({ status: 'idle' });
              }}
              className={`h-9 px-3 rounded-lg text-sm font-medium border transition-colors ${
                active
                  ? 'border-brand bg-brand/10 text-txt'
                  : 'border-border bg-bg text-muted hover:text-txt hover:border-border-h'
              }`}
            >
              {labels[id]}
            </button>
          );
        })}
      </div>

      <p className="text-sm text-muted m-0 mb-5">{hints[kind]}</p>

      <label htmlFor="evidence-identity" className={label}>
        {t.home.identityLabel}
      </label>
      <div className="mt-2 flex flex-col sm:flex-row items-stretch gap-2">
        <input
          id="evidence-identity"
          type="text"
          value={identity}
          onChange={(event) => setIdentity(event.target.value)}
          placeholder={PLACEHOLDER[kind]}
          required
          autoComplete="off"
          spellCheck={false}
          className={`${input} flex-1`}
        />
        <button type="submit" className={`${btnPrimary} shrink-0 px-4 sm:px-5`} disabled={query.status === 'loading'}>
          {query.status === 'loading' ? t.common.loading : t.home.lookup}
        </button>
      </div>

      {query.status === 'invalid' ? (
        <p className="mt-5 mb-0 text-sm text-rose-500">{t.home.invalid}</p>
      ) : null}
      {query.status === 'error' ? (
        <p className="mt-5 mb-0 text-sm text-rose-500">{t.home.failed}</p>
      ) : null}

      {query.status === 'ok' ? (
        <div className="mt-6 space-y-4">
          <p className="m-0 text-sm text-muted">
            {t.home.echo}{' '}
            <span className="font-mono text-txt">{query.body.identity}</span>
            <span className="text-muted-2"> · {query.body.count}</span>
          </p>
          {query.body.count === 0 ? (
            <p className="m-0 text-sm text-txt">{t.home.empty}</p>
          ) : (
            <ul className="m-0 p-0 list-none space-y-2">
              {query.body.leaves.map((leaf) => (
                <li key={leaf.leaf_hash} className="m-0">
                  <a
                    href={ledgerLeafUrl(leaf.leaf_hash)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-accent no-underline hover:underline break-all"
                  >
                    {leaf.leaf_hash}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <CopyableValue text={query.url} href={query.url} />
        </div>
      ) : null}
    </form>
  );
}
