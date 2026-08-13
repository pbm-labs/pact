'use client';

import { useLocale } from '@/components/locale-provider';
import { eyebrow } from '@/lib/ui';
import { pathToProven } from '@/lib/path-to-proven';
import type { PathToProvenStatus } from '@/lib/path-to-proven';

export function PathToProven({
  status,
  pactAgeDays,
  uniqueReporters,
  inset = false,
  showFoot = true,
  className = '',
}: {
  status: PathToProvenStatus;
  pactAgeDays: number;
  uniqueReporters: number;
  inset?: boolean;
  showFoot?: boolean;
  className?: string;
}) {
  const { t } = useLocale();
  const path = pathToProven({ status, pactAgeDays, uniqueReporters });
  if (path.hidden) return null;

  return (
    <div className={className}>
      <section
        className={`rounded-xl border border-border px-4 py-4 sm:px-5 sm:py-5 ${
          inset ? 'bg-bg' : 'bg-surface'
        }`}
      >
        <p className={eyebrow}>{t.domain.pathEyebrow}</p>
        <ul className="mt-3 space-y-2.5 text-sm m-0 p-0 list-none">
          <ChecklistItem
            done={path.daysMet}
            label={t.domain.pathDaysItem.replace('{n}', String(path.activationDays))}
            current={t.domain.pathDaysCurrent.replace('{n}', String(path.days))}
          />
          <ChecklistItem
            done={path.reportersMet}
            label={t.domain.pathReportersItem}
            current={t.domain.pathReportersCurrent.replace('{n}', String(path.reporters))}
          />
        </ul>
        <p className="mt-3 text-[0.7rem] text-muted-2 leading-relaxed m-0">
          {t.domain.pathExplainer}
        </p>
      </section>
      {showFoot && (
        <p className="mt-4 text-sm text-muted leading-relaxed m-0">{t.domain.pathFoot}</p>
      )}
    </div>
  );
}

function ChecklistItem({
  done,
  label,
  current,
}: {
  done: boolean;
  label: string;
  current: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        aria-hidden
        className={`mt-0.5 shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center ${
          done ? 'border-verified bg-verified/20' : 'border-muted-2'
        }`}
      >
        {done && (
          <svg viewBox="0 0 10 10" className="w-3 h-3 text-verified" fill="none">
            <path
              d="M 2 5 L 4 7 L 8 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={done ? 'text-muted-2 line-through' : 'text-txt'}>
        {label}
        <span className="ml-1.5 text-muted-2">— {current}</span>
      </span>
    </li>
  );
}
