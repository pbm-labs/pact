import './globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { LocaleProvider } from '@/components/locale-provider';
import { LocaleScript } from '@/components/locale-script';
import { MovementFooter } from '@/components/movement-footer';
import { MovementHeader } from '@/components/movement-header';
import { LEGAL_ENTITY } from '@/lib/legal';
import { parseLocale, STORAGE_KEYS } from '@/lib/preferences';

const siteUrl = `https://${LEGAL_ENTITY.site}`;
const title = 'leftover — evidence that outlives the vendor';
const description =
  'You kept the liability. They kept the evidence. leftover holds uncommissioned traces — queryable after the vendor is gone. Not a score.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: LEGAL_ENTITY.brand,
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: LEGAL_ENTITY.brand,
    title,
    description,
    locale: 'en_US',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'leftover — evidence that outlives the vendor.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.png'],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const initialLocale = parseLocale(jar.get(STORAGE_KEYS.locale)?.value);

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.classList.add("light")}catch(e){}`,
          }}
        />
        <LocaleScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600;700&family=Unbounded:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="marketing flex flex-col min-h-screen bg-bg text-txt antialiased">
        <LocaleProvider initialLocale={initialLocale}>
          <MovementHeader />
          {children}
          <MovementFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
