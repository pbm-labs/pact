import { sizeBadge } from '@/lib/badge-dimensions';
import { routes } from '@/lib/routes';

// Marketing-only badge image. Renders BOTH theme variants stacked,
// then lets CSS pick the active one via the `light:` Tailwind variant
// (keyed to `html.light`). Both `<img>` tags stay in the DOM so the
// right variant is visible from frame zero — no hydration flicker.
export function DemoBadge({
  domain,
  alt,
}: {
  domain: string;
  alt?: string;
}) {
  const { width, height } = sizeBadge(domain);
  const darkSrc = `${routes.badge(domain)}.svg?theme=dark`;
  const lightSrc = `${routes.badge(domain)}.svg?theme=light`;
  const imageAlt = alt ?? `we build real · ${domain}`;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={darkSrc}
        alt={imageAlt}
        width={width}
        height={height}
        className="inline-block light:hidden border-0 align-middle select-none"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lightSrc}
        alt={imageAlt}
        width={width}
        height={height}
        className="hidden light:inline-block border-0 align-middle select-none"
        draggable={false}
      />
    </>
  );
}
