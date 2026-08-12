import './globals.css';
import type { Metadata } from 'next';
import { LocaleProvider } from '@/components/locale-provider';
import { LocaleScript } from '@/components/locale-script';
import { MovementFooter } from '@/components/movement-footer';
import { MovementHeader } from '@/components/movement-header';

const siteUrl = 'https://webuildreal.dev';
const title = 'We build real';
const description =
  "History can't be faked. A movement for people who believe history shouldn't be rewriteable.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: 'we build real',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'we build real',
    title,
    description,
    locale: 'en_US',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'we build real — history can\'t be faked.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <LocaleProvider>
          <MovementHeader />
          {children}
          <MovementFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
