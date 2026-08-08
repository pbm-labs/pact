interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreGauge({ score, size = 120, strokeWidth = 10, className = '' }: ScoreGaugeProps) {
  const target = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (target / 100) * circumference;
  const color =
    target >= 60 ? 'var(--verified)' : target >= 25 ? 'var(--amber)' : 'var(--muted-2)';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`-rotate-90 ${className}`}
      role="img"
      aria-label={`Trust score ${target} out of 100`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
