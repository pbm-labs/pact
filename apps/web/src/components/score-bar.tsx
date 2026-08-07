interface ScoreBarProps {
  score: number;
  className?: string;
}

export function ScoreBar({ score, className = '' }: ScoreBarProps) {
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 60 ? 'bg-verified' : pct >= 25 ? 'bg-amber' : 'bg-muted-2';

  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-border/60 ${className}`}
      role="img"
      aria-label={`Trust score ${pct} out of 100`}
    >
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
