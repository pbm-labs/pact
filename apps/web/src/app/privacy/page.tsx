import { LegalDocument } from '@/components/legal-document';

export const metadata = {
  title: 'Privacy Policy — We build real',
  description: 'Privacy Policy for pact.pbm-labs.com and the PACT reference services.',
};

export default function PrivacyPage() {
  return <LegalDocument kind="privacy" />;
}
