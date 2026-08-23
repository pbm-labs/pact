import { LegalDocument } from '@/components/legal-document';

export const metadata = {
  title: 'Privacy Policy — We build real',
  description: 'How leftover traces are handled — DMARC aggregate reports and public Certificate Transparency metadata. No message content, no mailboxes.',
};

export default function PrivacyPage() {
  return <LegalDocument kind="privacy" />;
}
