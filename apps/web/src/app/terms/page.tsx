import { LegalDocument } from '@/components/legal-document';

export const metadata = {
  title: 'Terms of Service — We build real',
  description: 'Terms of Service for pact.pbm-labs.com and the PACT reference services.',
};

export default function TermsPage() {
  return <LegalDocument kind="terms" />;
}
