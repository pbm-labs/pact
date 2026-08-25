import { LegalDocument } from '@/components/legal-document';

export const metadata = {
  title: 'Privacy Policy — We build real',
  description: 'How leftover traces are handled — DMARC aggregate reports, public Certificate Transparency metadata, and public Rekor identities. No message content, no mailboxes.',
};

export default function PrivacyPage() {
  return <LegalDocument kind="privacy" />;
}
