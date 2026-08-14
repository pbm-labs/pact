import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import {
  BADGE_THEMES,
  GAP_ICON_TEXT,
  ICON_D,
  LEFT_W,
  PAD_L,
  STATE_PALETTES,
  STATE_WORDS,
  rightWidthFor,
  truncateDomain,
} from '@/lib/badge-dimensions';
import { resolveSnapshot } from '@/lib/badge-state';

export const alt = 'Public record';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SCALE = 3.5;

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

export default async function RecordOgImage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: raw } = await params;
  const domain = decodeURIComponent(raw).toLowerCase().trim();
  const snapshot = await resolveSnapshot(domain);
  const p = STATE_PALETTES[snapshot.state];
  const theme = BADGE_THEMES.dark;
  const stateWord = STATE_WORDS[snapshot.state];
  const domainText = truncateDomain(domain);
  const leftW = LEFT_W * SCALE;
  const rightW = rightWidthFor(domain) * SCALE;
  const badgeW = leftW + rightW;
  const badgeH = 32 * SCALE;
  const radius = badgeH / 2;
  const iconD = ICON_D * SCALE;
  const iconR = iconD / 2;
  const notch = iconR * 0.23;

  const icon =
    snapshot.state === 'verified' ? (
      <svg width={iconD} height={iconD} viewBox={`0 0 ${iconD} ${iconD}`}>
        <circle cx={iconR} cy={iconR} r={iconR} fill={p.fg} />
        <path
          d={`M ${iconR - iconR * 0.5} ${iconR} L ${iconR - iconR * 0.14} ${iconR + iconR * 0.36} L ${iconR + iconR * 0.5} ${iconR - iconR * 0.36}`}
          stroke={p.iconNotch}
          strokeWidth={iconD * 0.13}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg width={iconD} height={iconD} viewBox={`0 0 ${iconD} ${iconD}`}>
        <circle cx={iconR} cy={iconR} r={iconR} fill={p.fg} />
        <circle cx={iconR} cy={iconR} r={notch} fill={p.iconNotch} />
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
          backgroundColor: '#0c0c0f',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 36,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'IBM Plex Mono',
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#60607a',
          }}
        >
          Public record
        </div>
        <div
          style={{
            display: 'flex',
            width: badgeW,
            height: badgeH,
            borderRadius: radius,
            border: `3px solid ${theme.border}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: leftW,
              height: '100%',
              backgroundColor: p.bg,
              alignItems: 'center',
              paddingLeft: PAD_L * SCALE,
              gap: GAP_ICON_TEXT * SCALE,
            }}
          >
            {icon}
            <span
              style={{
                fontFamily: 'IBM Plex Mono',
                fontWeight: 700,
                fontSize: 42,
                color: p.fg,
                lineHeight: 1,
              }}
            >
              {stateWord}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              width: rightW,
              height: '100%',
              backgroundColor: theme.rightBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'IBM Plex Mono',
                fontWeight: 700,
                fontSize: 42,
                color: theme.rightFg,
                lineHeight: 1,
              }}
            >
              {domainText}
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'IBM Plex Mono',
            fontSize: 22,
            color: '#9090b0',
          }}
        >
          webuildreal.dev/records/{domain}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
