/** Foundation mark — bars only (no tile) for light/dark UI. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="128 168 256 140"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect x="184" y="168" width="144" height="36" rx="6" fill="var(--brand-2)" opacity="0.85" />
      <rect x="156" y="220" width="200" height="36" rx="6" fill="var(--brand-2)" />
      <rect x="128" y="272" width="256" height="36" rx="6" fill="var(--brand)" />
    </svg>
  );
}
