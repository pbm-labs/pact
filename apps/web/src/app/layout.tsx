import './globals.css';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { COMPANY_SITE_URL } from '@/lib/site-urls';

export const metadata: Metadata = {
  title: 'PACT Protocol',
  description:
    'A public foundation for knowing who is real on the internet — verifiable domain provenance, one honest day at a time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <p>
            Phase 0a staging · Roots not yet on-chain ·{' '}
            <a href={COMPANY_SITE_URL}>PBM Labs</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
