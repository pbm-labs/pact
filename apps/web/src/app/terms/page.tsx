import { LegalDocument } from '@/components/legal-document';

export const metadata = {
  title: 'Terms of Service — We build real',
  description: 'Terms for webuildreal.dev and the PACT reference services. Leftover traces: mail reports and certificate logs as separate kinds.',
};

export default function TermsPage() {
  return <LegalDocument kind="terms" />;
}
