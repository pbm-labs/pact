import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Record';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          gap: 28,
          padding: 64,
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
          Record
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'IBM Plex Mono',
            fontWeight: 700,
            fontSize: 56,
            color: '#e8e8f2',
            lineHeight: 1.1,
            textAlign: 'center',
          }}
        >
          {domain}
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
