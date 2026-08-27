import { LegalDocument } from '@/components/legal-document';

export const metadata = {
  title: 'Privacy Policy — We build real',
  description:
    'How mail reports, public Certificate Transparency metadata, and public Rekor identities are handled. No message content, no mailboxes.',
};

export default function PrivacyPage() {
  return <LegalDocument kind="privacy" />;
}
