import { PageShell } from '@/components/page-shell';
import { LegalDocument } from '@/components/legal-document';
import { TERMS_SECTIONS } from '@/lib/legal';

export const metadata = {
  title: 'Terms of Service — We build real',
  description: 'Terms of Service for pact.pbm-labs.com and the PACT reference services.',
};

export default function TermsPage() {
  return (
    <PageShell backHref="/" backLabel="Home" width="narrow">
      <LegalDocument title="Terms of Service" sections={TERMS_SECTIONS} />
    </PageShell>
  );
}
