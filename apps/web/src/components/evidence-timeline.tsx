import type { EvidenceItemCopy } from '@/lib/i18n/types';

interface EvidenceTimelineProps {
  items: EvidenceItemCopy[];
  liveTag: string;
  plannedTag: string;
  marker: string;
  afterMarker: string;
}

/** Vertical timeline: evidence that keeps standing, then the point where a vendor disappears. */
export function EvidenceTimeline({
  items,
  liveTag,
  plannedTag,
  marker,
  afterMarker,
}: EvidenceTimelineProps) {
  return (
    <div className="mt-10 max-w-2xl">
      {items.map((item) => (
        <div key={item.label} className="flex gap-4 sm:gap-5">
          <div className="flex flex-col items-center w-3 shrink-0">
            <span
              className={`mt-1 h-3 w-3 rounded-full shrink-0 ${
                item.status === 'live' ? 'bg-verified' : 'bg-bg border-2 border-muted-2'
              }`}
              aria-hidden="true"
            />
            <span className="w-px flex-1 bg-border" />
          </div>
          <div className="pb-7 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="m-0 text-base font-bold tracking-tight text-txt">{item.label}</h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest shrink-0 ${
                  item.status === 'live'
                    ? 'text-verified border border-verified/40 bg-verified/10'
                    : 'text-muted-2 border border-border'
                }`}
              >
                {item.status === 'live' ? liveTag : plannedTag}
              </span>
            </div>
            <p className="mt-1.5 mb-0 text-sm text-muted leading-relaxed">{item.note}</p>
          </div>
        </div>
      ))}

      <div className="flex gap-4 sm:gap-5">
        <div className="flex flex-col items-center w-3 shrink-0">
          <span className="mt-1 h-3 w-3 rounded-full bg-danger shrink-0" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="m-0 text-xs font-mono uppercase tracking-widest text-danger">{marker}</p>
          <p className="mt-2 mb-0 text-sm text-muted leading-relaxed max-w-md">{afterMarker}</p>
        </div>
      </div>
    </div>
  );
}
