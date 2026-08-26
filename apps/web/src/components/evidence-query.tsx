'use client';

import { useMemo, useState } from 'react';
import { CopyableValue } from '@/components/copy-button';
import { useLocale } from '@/components/locale-provider';
import { EVIDENCE_KINDS, type EvidenceKind, ledgerEvidenceUrl } from '@/lib/routes';
import { input, label } from '@/lib/ui';

const PLACEHOLDER: Record<EvidenceKind, string> = {
  mail: 'example.com',
  ct: 'example.com',
  rekor: 'https://github.com/org/repo',
};

export function EvidenceQuery() {
  const { t } = useLocale();
  const [kind, setKind] = useState<EvidenceKind>('mail');
  const [identity, setIdentity] = useState('');

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

  const url = useMemo(() => ledgerEvidenceUrl(kind, identity), [kind, identity]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {EVIDENCE_KINDS.map((id) => {
          const active = kind === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setKind(id)}
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
      <input
        id="evidence-identity"
        type="text"
        value={identity}
        onChange={(event) => setIdentity(event.target.value)}
        placeholder={PLACEHOLDER[kind]}
        autoComplete="off"
        spellCheck={false}
        className={`${input} mt-2`}
      />

      <div className="mt-4">
        <CopyableValue text={url} href={url} />
      </div>
    </div>
  );
}
