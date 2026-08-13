import { sizeBadge } from '@/lib/badge-dimensions';
import type { BadgeState } from '@/lib/badge-state';
import { routes } from '@/lib/routes';

// Marketing-only badge image. Renders BOTH theme variants stacked,
// then lets CSS pick the active one via the `light:` Tailwind variant
// (keyed to `html.light`). Both `<img>` tags stay in the DOM so the
// right variant is visible from frame zero — no hydration flicker.
export function DemoBadge({
  domain,
  state,
}: {
  domain: string;
  state: BadgeState;
}) {
  const { width, height } = sizeBadge(domain);
  const darkSrc = `${routes.badge(domain)}.svg?preview=${state}&theme=dark`;
  const lightSrc = `${routes.badge(domain)}.svg?preview=${state}&theme=light`;
  const alt = `we build real · ${domain}`;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        className="inline-block light:hidden border-0 align-middle select-none"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
        className="hidden light:inline-block border-0 align-middle select-none"
        draggable={false}
      />
    </>
  );
}
