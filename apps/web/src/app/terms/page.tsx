import { LegalDocument } from '@/components/legal-document';

export const metadata = {
  title: 'Terms of Service — Wake',
  description: 'Terms for Wake and the PACT evidence query. Separate uncommissioned streams on one tree.',
};

export default function TermsPage() {
  return <LegalDocument kind="terms" />;
}
