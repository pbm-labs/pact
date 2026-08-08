export const LEGAL_ENTITY = {
  name: 'PBM Labs LLC',
  brand: 'we build real',
  site: 'pact.pbm-labs.com',
  email: 'hello@pbm-labs.com',
  address: {
    line: '30 North Gould Street, Suite N',
    cityStateZip: 'Sheridan, WY 82801',
    country: 'United States',
  },
  lastUpdated: 'August 8, 2026',
} as const;

export type LegalSection = { title: string; body: string };

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using this website (pact.pbm-labs.com) and related services operated under the “we build real” brand, you agree to these Terms of Service. If you do not agree, do not use the site or connect a domain.',
  },
  {
    title: '2. Who We Are',
    body: 'This site is operated by PBM Labs LLC (“PBM Labs”, “we”, “us”), a Wyoming limited liability company. It provides public access to the PACT Protocol reference implementation: domain connection, a public record of independently verified domain history, and related documentation.',
  },
  {
    title: '3. The Service',
    body: 'PACT captures DMARC aggregate authentication reports that receiving mail systems already generate, commits extracted metadata to an append-only Merkle tree, and publishes a public record and organic trust signal for connected domains. Connecting a domain requires adding PACT as a report destination in DNS (directly or via a supported provider). We do not read message content, recipient identities, or mailbox data.',
  },
  {
    title: '4. Public Records',
    body: 'Information published in the public record — including domain names, verified-history summaries, trust signals, and cryptographic proofs — is intended to be publicly viewable. Do not connect a domain if you are not authorized to make that domain’s authentication metadata part of a public ledger.',
  },
  {
    title: '5. Your Responsibilities',
    body: 'You must only connect domains you control or are authorized to manage. You are responsible for the accuracy of DNS changes you make, for complying with your own policies and applicable law, and for not using the service to harass, defraud, or misrepresent others. You may not attempt unauthorized access, interfere with the service, scrape in a way that degrades it, introduce malware, or otherwise misuse the site.',
  },
  {
    title: '6. No Advice; No Guarantee of Legitimacy',
    body: 'Trust scores, history summaries, and proofs are informational measurements derived from available reports. They are not legal, financial, compliance, or business advice, and they do not guarantee that a domain, organization, or person is legitimate, safe to transact with, or free of risk. You remain solely responsible for your own decisions.',
  },
  {
    title: '7. No Financial Services',
    body: 'We are not a bank, broker, money services business, or financial institution. We do not process, hold, custody, or transfer currency, securities, or financial assets.',
  },
  {
    title: '8. Intellectual Property',
    body: 'Site content, branding, and design are owned by PBM Labs LLC or its licensors unless otherwise stated. The PACT Protocol specification and whitepaper are published openly for review and implementation; third-party protocol implementations are encouraged subject to their own license terms where applicable. No rights are granted except the limited right to use this site as intended.',
  },
  {
    title: '9. Third-Party Services',
    body: 'The site may rely on or link to third parties (for example DNS providers such as Cloudflare, hosting and edge infrastructure, and database providers). We do not control third-party services and are not responsible for their content, availability, or policies. Your use of those services is subject to their terms.',
  },
  {
    title: '10. Disclaimer of Warranties',
    body: 'The site and service are provided “as is” and “as available” without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted, error-free, complete, or secure, or that published roots, proofs, or scores will meet your requirements.',
  },
  {
    title: '11. Limitation of Liability',
    body: 'To the maximum extent permitted by law, PBM Labs LLC and its members, officers, and contractors are not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the site or service, including reliance on public records or trust signals, even if advised of the possibility of such damages.',
  },
  {
    title: '12. Changes',
    body: 'We may update these Terms from time to time. The revised version will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the revised Terms.',
  },
  {
    title: '13. Governing Law',
    body: 'These Terms are governed by the laws of the State of Wyoming, United States, without regard to conflict-of-law principles.',
  },
  {
    title: '14. Contact',
    body: 'Legal notices and questions about these Terms: hello@pbm-labs.com.',
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: '1. Overview',
    body: 'This Privacy Policy explains how PBM Labs LLC handles information when you use pact.pbm-labs.com and the PACT reference services. PACT is designed so its primary data source — DMARC aggregate reports — contains no message content and no personal identities.',
  },
  {
    title: '2. Information We Process',
    body: 'Domain and protocol data: domain names you connect; DMARC aggregate report metadata (reporting organization, period, authentication pass/fail counts, selector and infrastructure identifiers in hashed or summarized form); Merkle leaves, roots, and public verification data. Connection flow data: domain strings you submit; if you use Cloudflare OAuth, tokens and zone information needed to update DNS on your behalf during that session. Browser preferences: theme choice stored in local storage on your device. We do not operate consumer user accounts or marketing profiles on this site.',
  },
  {
    title: '3. What We Do Not Collect',
    body: 'We do not access, read, or store email message bodies, subject lines, recipient identities, or mailbox contents through the PACT Protocol. Aggregate reports used by the protocol are not personal data by design.',
  },
  {
    title: '4. How We Use Information',
    body: 'We use the information above to operate domain connection, ingest and publish verified history, compute and display trust signals, maintain cryptographic proofs, prevent abuse, and improve reliability of the service. Public record fields are published so anyone can verify history independently.',
  },
  {
    title: '5. Public Records',
    body: 'Connected domains and their verified-history summaries, scores (when shown), and proofs are intended to be public. Do not connect a domain unless you understand that related authentication metadata will appear in a public ledger.',
  },
  {
    title: '6. Service Providers',
    body: 'We use infrastructure providers to host the site and store protocol data (including edge hosting and database services). If you connect via Cloudflare OAuth, Cloudflare processes authentication and DNS updates under its terms. Providers may process data in the United States or other jurisdictions where they operate.',
  },
  {
    title: '7. Cookies and Local Storage',
    body: 'We do not use advertising or analytics tracking pixels on this site. We store essential preferences (such as theme) in your browser’s local storage. You can clear these in your browser settings.',
  },
  {
    title: '8. Retention',
    body: 'Public ledger data is retained to preserve the integrity of the append-only record. Operational logs and connection-session data are retained only as needed to run, secure, and debug the service, and to meet legal obligations.',
  },
  {
    title: '9. Security',
    body: 'We implement reasonable technical and organizational measures appropriate to a public verification service. No method of transmission or storage is completely secure.',
  },
  {
    title: '10. Your Rights',
    body: 'Depending on your location, you may have rights to access, correct, or delete personal data we hold about you. Domain names and public ledger entries are not treated as personal data under this policy’s primary model; contact us if you believe we hold personal data about you in another form. We do not sell personal data.',
  },
  {
    title: '11. Changes',
    body: 'We may update this Privacy Policy from time to time. The revised version will be posted on this page with an updated date.',
  },
  {
    title: '12. Contact',
    body: 'Privacy questions: hello@pbm-labs.com.',
  },
];
