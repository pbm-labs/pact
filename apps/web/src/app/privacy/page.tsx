import { PageShell } from '@/components/page-shell';
import { LegalDocument } from '@/components/legal-document';
import { PRIVACY_SECTIONS } from '@/lib/legal';

export const metadata = {
  title: 'Privacy Policy — We build real',
  description: 'Privacy Policy for pact.pbm-labs.com and the PACT reference services.',
};

export default function PrivacyPage() {
  return (
    <PageShell backHref="/" backLabel="Home" width="narrow">
      <LegalDocument title="Privacy Policy" sections={PRIVACY_SECTIONS} />
    </PageShell>
  );
}
