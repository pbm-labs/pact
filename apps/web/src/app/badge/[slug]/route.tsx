import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import {
  BADGE_HEIGHT,
  BADGE_THEMES,
  DEFAULT_BADGE_THEME,
  GAP_ICON_TEXT,
  ICON_D,
  LEFT_W,
  PAD_L,
  PAD_R,
  STATE_PALETTES,
  STATE_WORDS,
  isBadgeTheme,
  rightWidthFor,
  truncateDomain,
  type BadgeTheme,
} from '@/lib/badge-dimensions';
import {
  parsePreviewState,
  resolveSnapshot,
  type BadgeSnapshot,
  type BadgeState,
} from '@/lib/badge-state';

// Split Pill (ETag: v4).
//
//   ┌──────────────────┬──────────────────┐
//   │  ✓  Proven       │     acme.com     │
//   └──────────────────┴──────────────────┘
//
// LEFT half  — state-tinted bg (green for Proven, amber for Building)
//              + white icon + white state word. Constant 104px.
// RIGHT half — theme-aware site surface + monospace domain text.
//              Width adapts to the domain. Brand attribution lives
//              in the click target (`webuildreal.dev/records/<domain>`).
//
// `?theme=light|dark` flips the RIGHT half palette. Default is `dark`.
// LEFT half does NOT theme — the saturated state color IS the identity.

const H = BADGE_HEIGHT;
const R = BADGE_HEIGHT / 2;

function loadMonoBold(): Buffer | null {
  const candidates = [
    join(process.cwd(), 'src/app/badge/fonts/IBMPlexMono-Bold.ttf'),
    join(process.cwd(), 'apps/web/src/app/badge/fonts/IBMPlexMono-Bold.ttf'),
  ];
  for (const path of candidates) {
    try {
      return readFileSync(path);
    } catch {
      /* try next */
    }
  }
  return null;
}

const IBM_PLEX_MONO_BOLD = loadMonoBold();

function parseSlug(slug: string): { domain: string; format: 'svg' | 'png' } {
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  if (decoded.endsWith('.png')) {
    return { domain: decoded.slice(0, -4), format: 'png' };
  }
  if (decoded.endsWith('.svg')) {
    return { domain: decoded.slice(0, -4), format: 'svg' };
  }
  return { domain: decoded, format: 'svg' };
}

function esc(s: string): string {
  return s.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return c;
    }
  });
}

function stateAria(state: BadgeState): string {
  return STATE_WORDS[state].toLowerCase();
}

function renderSvg(domain: string, state: BadgeState, theme: BadgeTheme): string {
  const p = STATE_PALETTES[state];
  const t = BADGE_THEMES[theme];
  const stateWord = STATE_WORDS[state];
  const domainText = truncateDomain(domain);
  const rightW = rightWidthFor(domain);
  const W = LEFT_W + rightW;

  const iconCX = PAD_L + ICON_D / 2;
  const iconCY = H / 2;
  const iconR = ICON_D / 2;
  const stateX = PAD_L + ICON_D + GAP_ICON_TEXT;
  const rightCenterX = LEFT_W + rightW / 2;
  const baselineY = H / 2 + 4.5;
  const textFont = `font-family="ui-monospace, 'SF Mono', 'IBM Plex Mono', 'JetBrains Mono', 'Cascadia Code', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace" font-size="13" letter-spacing="-0.01em"`;

  let iconEl: string;
  if (state === 'verified') {
    const check = `M ${iconCX - 3.5} ${iconCY} L ${iconCX - 1} ${iconCY + 2.5} L ${iconCX + 3.5} ${iconCY - 2.5}`;
    iconEl = `
    <circle cx="${iconCX}" cy="${iconCY}" r="${iconR}" fill="${p.fg}"/>
    <path d="${check}" stroke="${p.iconNotch}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else {
    iconEl = `
    <circle cx="${iconCX}" cy="${iconCY}" r="${iconR}" fill="${p.fg}"/>
    <circle cx="${iconCX}" cy="${iconCY}" r="1.6" fill="${p.iconNotch}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="we build real badge: ${esc(domain)} (${stateAria(state)})">
  <defs>
    <clipPath id="pill">
      <rect x="0" y="0" width="${W}" height="${H}" rx="${R}" ry="${R}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#pill)">
    <rect x="0" y="0" width="${LEFT_W}" height="${H}" fill="${p.bg}"/>
    <rect x="${LEFT_W}" y="0" width="${rightW}" height="${H}" fill="${t.rightBg}"/>
    <line x1="${LEFT_W}" y1="0" x2="${LEFT_W}" y2="${H}" stroke="${t.border}" stroke-width="1"/>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${R - 0.5}" fill="none" stroke="${t.border}" stroke-width="1"/>${iconEl}
  <text x="${stateX}" y="${baselineY}" ${textFont} font-weight="800" fill="${p.fg}">${esc(stateWord)}</text>
  <text x="${rightCenterX}" y="${baselineY}" ${textFont} font-weight="700" fill="${t.rightFg}" text-anchor="middle">${esc(domainText)}</text>
</svg>`;
}

function renderPng(
  domain: string,
  state: BadgeState,
  theme: BadgeTheme,
  cacheHeaders: Record<string, string>,
) {
  const p = STATE_PALETTES[state];
  const t = BADGE_THEMES[theme];
  const stateWord = STATE_WORDS[state];
  const domainText = truncateDomain(domain);
  const rightW = rightWidthFor(domain);
  const W = LEFT_W + rightW;

  const PNG_W = W * 2;
  const PNG_H = H * 2;
  const iconD2x = ICON_D * 2;
  const iconR2x = iconD2x / 2;

  const iconNode =
    state === 'verified' ? (
      <svg width={iconD2x} height={iconD2x} viewBox={`0 0 ${iconD2x} ${iconD2x}`}>
        <circle cx={iconR2x} cy={iconR2x} r={iconR2x} fill={p.fg} />
        <path
          d={`M ${iconR2x - 7} ${iconR2x} L ${iconR2x - 2} ${iconR2x + 5} L ${iconR2x + 7} ${iconR2x - 5}`}
          stroke={p.iconNotch}
          strokeWidth="3.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg width={iconD2x} height={iconD2x} viewBox={`0 0 ${iconD2x} ${iconD2x}`}>
        <circle cx={iconR2x} cy={iconR2x} r={iconR2x} fill={p.fg} />
        <circle cx={iconR2x} cy={iconR2x} r="3.2" fill={p.iconNotch} />
      </svg>
    );

  const fonts = IBM_PLEX_MONO_BOLD
    ? [
        {
          name: 'IBM Plex Mono',
          data: IBM_PLEX_MONO_BOLD,
          weight: 700 as const,
          style: 'normal' as const,
        },
      ]
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          borderRadius: R * 2,
          border: `2px solid ${t.border}`,
          overflow: 'hidden',
          fontFamily: 'monospace',
          boxSizing: 'border-box',
        }}
        aria-label={`we build real badge: ${domain} (${stateAria(state)})`}
      >
        <div
          style={{
            display: 'flex',
            width: LEFT_W * 2,
            height: '100%',
            backgroundColor: p.bg,
            alignItems: 'center',
            paddingLeft: PAD_L * 2,
            gap: GAP_ICON_TEXT * 2,
          }}
        >
          {iconNode}
          <span
            style={{
              fontFamily: 'IBM Plex Mono',
              fontWeight: 700,
              fontSize: 26,
              color: p.fg,
              lineHeight: 1,
              letterSpacing: -0.2,
            }}
          >
            {stateWord}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            width: rightW * 2,
            height: '100%',
            backgroundColor: t.rightBg,
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: PAD_R * 2,
            paddingLeft: PAD_R * 2,
          }}
        >
          <span
            style={{
              fontFamily: 'IBM Plex Mono',
              fontWeight: 700,
              fontSize: 26,
              color: t.rightFg,
              lineHeight: 1,
              letterSpacing: -0.2,
            }}
          >
            {domainText}
          </span>
        </div>
      </div>
    ),
    {
      width: PNG_W,
      height: PNG_H,
      headers: cacheHeaders,
      fonts,
    },
  );
}

function cacheHeaders(
  snapshot: BadgeSnapshot,
  format: 'svg' | 'png',
  theme: BadgeTheme,
): Record<string, string> {
  const etag = `W/"${snapshot.state}-${theme}-${format}-v4"`;
  return {
    'Cache-Control':
      'public, max-age=60, s-maxage=120, stale-while-revalidate=3600',
    ETag: etag,
    'Access-Control-Allow-Origin': '*',
    ...(format === 'svg' ? { 'Content-Type': 'image/svg+xml; charset=utf-8' } : {}),
  };
}

export const revalidate = 0;

export async function GET(
  request: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const { domain, format } = parseSlug(slug);

  if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
    return new Response('invalid domain', { status: 400 });
  }

  const url = new URL(request.url);
  const previewState = parsePreviewState(url.searchParams.get('preview'));
  const themeParam = url.searchParams.get('theme');
  const theme: BadgeTheme = isBadgeTheme(themeParam)
    ? themeParam
    : DEFAULT_BADGE_THEME;

  const snapshot: BadgeSnapshot = previewState
    ? { state: previewState, count: 0 }
    : await resolveSnapshot(domain);
  const headers = cacheHeaders(snapshot, format, theme);

  const ifNoneMatch = request.headers.get('if-none-match');
  if (ifNoneMatch && ifNoneMatch === headers.ETag) {
    return new Response(null, { status: 304, headers });
  }

  if (format === 'png') {
    return renderPng(domain, snapshot.state, theme, headers);
  }

  const svg = renderSvg(domain, snapshot.state, theme);
  return new Response(svg, { headers });
}
