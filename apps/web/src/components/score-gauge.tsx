'use client';

import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreGauge({ score, size = 120, strokeWidth = 10, className = '' }: ScoreGaugeProps) {
  const target = Math.max(0, Math.min(100, score));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(target));
    return () => cancelAnimationFrame(id);
  }, [target]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const color =
    progress >= 60 ? 'var(--verified)' : progress >= 25 ? 'var(--amber)' : 'var(--muted-2)';

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
        style={{
          transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease',
        }}
      />
    </svg>
  );
}
