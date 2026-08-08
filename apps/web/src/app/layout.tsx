import './globals.css';
import type { Metadata } from 'next';
import { LocaleProvider } from '@/components/locale-provider';
import { LocaleScript } from '@/components/locale-script';
import { MovementFooter } from '@/components/movement-footer';
import { MovementHeader } from '@/components/movement-header';

export const metadata: Metadata = {
  title: 'We build real',
  description:
    'The foundation the internet never had can still be poured — one honest day at a time.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Unbounded:wght@700;800&display=swap"
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
