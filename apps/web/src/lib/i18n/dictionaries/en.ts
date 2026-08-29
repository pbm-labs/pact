import type { Dictionary } from '../types';

export const en: Dictionary = {
  nav: {
    language: 'Language',
    intake: 'Keep mail reports',
    whitepaper: 'Whitepaper',
    howItWorks: 'How it works',
  },
  footer: {
    terms: 'Terms',
    privacy: 'Privacy',
    ledger: 'Ledger',
    contact: 'Contact',
    operator: 'PBM Labs LLC',
  },
  common: {
    home: 'Home',
    continue: 'Continue',
    copy: 'Copy',
    copied: 'Copied',
    loading: 'Loading…',
    toggleTheme: 'Toggle theme',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  home: {
    title: 'Evidence that outlives the vendor',
    lede: 'Evidence that outlives the vendor. Uncommissioned traces from independent systems — before anyone asked them to look.',
    identityLabel: 'Identity',
    stakeLabel: 'Stake',
    emptyLabel: 'Empty',
    agents: 'A governed layer queries kind plus identity.',
    catalog: 'Live catalog',
    intakeCta: 'Keep mail reports',
    stakeCalendar: 'calendar',
    stakeCounterparty: 'counterparty',
    stakeCalendarHint: 'One actor can extend the series. Weight is in dates, not one fact.',
    stakeCounterpartyHint: 'Grows only when independent third parties keep acting.',
    unknownWhat: 'A stream in the live catalog.',
    unknownEmpty: 'Empty is an answer. No public record under that identity yet.',
    heroLine1: 'You kept the liability.',
    heroLine2: 'They kept the evidence.',
    turnLine:
      'Institutions outsource execution and retain legal accountability. When the relationship ends, the supplier takes the record with them. Wake holds uncommissioned evidence — traces independent systems produced before anyone had a reason to look — and makes them queryable after the vendor is gone.',
    howItWorksHeading: 'How it works',
    seeHowItWorks: 'How it works',
    liveHeading: 'A live record',
    liveViewRecord: 'See the record',
    proofRoot: 'Root',
    proofEmpty: 'Zero rows.',
    proofIncluded: 'included',
    chainBaseSepolia: 'Base Sepolia (testnet)',
    recordsHeading: 'Record',
    streamLabel: 'Stream',
    querySubmit: 'Query',
    queryFailed: 'The ledger did not answer.',
    queryHint: 'Zero rows is an answer.',
    uncommissionedHeading: 'Uncommissioned',
    uncommissionedBody:
      'Mail reports, certificate logs, software signatures. Independent systems produced these while doing their own unrelated job — delivering mail, recording public certificates, signing releases. The witness had no reason to produce this for you. It existed before the relationship started.',
    outlivesHeading: 'It outlives the vendor',
    outlivesBody:
      'When the relationship ends, the supplier takes the operational record. Wake is different. Inclusion is checked against a named root published outside this operator. If we disappear, the proofs still check. If the supplier disappears, the history is still there.',
    governedHeading: 'Not a score',
    governedBody:
      'Every questionnaire and every scanner compresses the vendor down to one number. Wake refuses that. Each stream keeps its own identity and a stake label a policy engine can read. Empty is honest. What may happen next is not decided here.',
    problemHeading: 'Accountability without a record.',
    problemBody:
      'You hand off execution. You keep the legal exposure. A regulator asks for the evidence. The supplier has it. Every tool built for third-party risk is designed for the active relationship — and stops the moment the vendor is gone.',
    gapHeading: 'Every current tool was built for the active relationship.',
    gapSelfAttestHeading: 'Self-attestation',
    gapSelfAttestBody:
      'Questionnaires, compliance documents, vendor-submitted assessments. AI reviews them faster now. The documents are still written by the party being assessed.',
    gapScannerHeading: 'External scanning',
    gapScannerBody:
      'Security rating services scan a vendor\'s public footprint without their cooperation. Better — but the scan stops when you stop paying. The methodology is proprietary. If the rating company disappears, the score disappears with it.',
    gapConclusion: 'Both compress everything into one grade. Neither exists after the contract ends.',
    receiptHeading: 'An accountability receipt.',
    receiptBody:
      'One query returns a verifiable history — built from uncommissioned traces, checked against a named root published outside this operator. Something you can hand a regulator regardless of what the supplier does next. It exists because independent systems were already doing their own job. Not because the supplier cooperated.',
    queryHeading: 'Query the evidence.',
    bottomLine: 'Governance designed into execution, not documentation.',
    streams: {
      mail: {
        name: 'Mail',
        what: 'Independent DMARC aggregate reports. No message content.',
        identity: 'Sending domain',
        empty: 'No reports under that sending domain.',
      },
      ct: {
        name: 'Certificates',
        what: 'Public Certificate Transparency logs.',
        identity: 'Hostname in SAN/CN',
        empty: 'No certificates under that hostname.',
      },
      rekor: {
        name: 'Signatures',
        what: 'Public Rekor and Sigstore records, keyed by subject — not a website you connected.',
        identity: 'Subject — GitHub URI, email, or host',
        empty: 'No signatures under that subject. Empty for a hostname is the honest record.',
      },
    },
  },
  connect: {
    backHome: '← Home',
    eyebrow: 'Mail reports',
    title: 'Connect your mail reports',
    intro:
      'Two minutes. Mostly automatic. Independent receiving systems already send aggregate reports. Add a destination so a copy is kept.',
    yourDomain: 'Sending domain',
    pathCloudflareTitle: 'I use Cloudflare',
    pathCloudflareDesc: 'One click — we add the DNS line.',
    pathManualTitle: 'Add it manually',
    pathManualDesc:
      'One line to paste wherever you manage DNS — GoDaddy, Namecheap, or any other host.',
    pathToolTitle: 'I already use a tool',
    pathToolDesc: 'Postmark or similar — add this address as a report destination.',
    pathCloudflareEffort: 'Fastest',
    pathManualEffort: 'A few minutes',
    pathToolEffort: 'If you already collect reports',
    afterOptions:
      'Reports start arriving after the destination is in place. History begins from that point. It cannot be backdated. When the first independent report lands — usually within 24–48 hours — it shows on the record for that sending domain.',
    putOnLedger: 'Register this domain',
    ledgerExplain: 'Registers the sending domain so incoming reports are not dropped.',
    backToPaths: 'Choose a method',
    whatDoesThisDo: 'What does this do?',
    cloudflareExplain:
      "You'll sign in to Cloudflare and we'll add a report destination in DNS. History starts when the first independent report arrives.",
    toolIntro: "In your tool's settings, add this:",
    toolExplain:
      'Your tool already collects reports for this domain. Adding this address includes us as a destination. Register the sending domain first so reports are kept. History starts when the first independent report arrives (usually within 24–48 hours).',
    manualIntro:
      "Paste this wherever you manage your website's DNS (ask your host if you're not sure where):",
    manualExplain:
      'One line that lets independent receiving systems send aggregate reports here. If you already have a similar line, add our address to it instead of replacing it. Register the sending domain first. History starts when the first independent report arrives (usually within 24–48 hours).',
    doneTitle: 'Mail reports are pointed here.',
    doneBody:
      'The sending domain is registered. Keep the DNS line. Reports appear when the first independent report arrives — not when this form is submitted.',
    doneNext: 'See the record',
    errors: {
      invalid_domain: 'Enter a valid domain (e.g. example.com).',
      server_config: 'Server is missing CONNECT_STATE_SECRET or ledger write credentials.',
      oauth_not_configured: 'Cloudflare sign-in is not configured on this server.',
      missing_code: 'Sign-in was cancelled or incomplete.',
      invalid_state: 'Session expired — try connecting again.',
      token_exchange: 'Could not finish connecting to Cloudflare.',
      zone_not_found:
        "This domain wasn't found in the Cloudflare account you picked. Try a different account.",
      dmarc_update:
        'Could not finish setting this up automatically. Try the manual option instead.',
      register: 'Almost there — the last step failed. Try again.',
      somethingWrong: 'Something went wrong.',
    },
  },
  whitepaper: {
    eyebrow: 'PACT',
    title: 'Whitepaper',
    subtitle: 'Provenance of Accumulated Checkable Traces',
    updated: 'August 2026',
  },
  legal: {
    eyebrow: 'Legal',
    lastUpdated: 'Last updated August 29, 2026',
    termsTitle: 'Terms of Service',
    privacyTitle: 'Privacy Policy',
    emailLabel: 'Email',
    terms: [
      {
        title: '1. Acceptance of Terms',
        body: 'By accessing or using this website (leftover.webuildreal.dev) and Wake, you agree to these Terms of Service. If you do not agree, do not use the site or submit a sending domain for mail intake.',
      },
      {
        title: '2. Who We Are',
        body: 'Wake is uncommissioned evidence: traces independent systems already emit, that nobody asked them to produce for us. PACT is an open protocol. PBM Labs LLC (“we”, “us”), a Wyoming limited liability company, operates this site and the first PACT reference ledger. Wake evidence is on the public ledger API. This is a query, not a claim, and not a human domain profile.',
      },
      {
        title: '3. The Service',
        body: 'PACT captures uncommissioned traces already emitted by independent systems and commits them to an append-only Merkle tree. Each trace source is a separate kind on that tree. Mail traces come from DMARC aggregate authentication reports. Certificate traces come from public Certificate Transparency logs. Signature traces come from the public Rekor log, keyed by subject (GitHub URI, email, or host) — not a connected website. Kinds are not blended into a score. Mail intake puts a sending domain on the ledger and requires adding PACT as a report destination in DNS so reports are kept. We do not read message content, recipient identities, or mailbox data.',
      },
      {
        title: '4. Public Ledger',
        body: 'Information published on the ledger — including trace identities, independently confirmed history, and cryptographic proofs — is intended to be publicly viewable and queryable by agents. Do not submit a sending domain if you are not authorized to make that domain’s authentication metadata part of a public ledger.',
      },
      {
        title: '5. Your Responsibilities',
        body: 'You must only submit sending domains you control or are authorized to manage. You are responsible for the accuracy of DNS changes you make, for complying with your own policies and applicable law, and for not using the service to harass, defraud, or misrepresent others. You may not attempt unauthorized access, interfere with the service, scrape in a way that degrades it, introduce malware, or otherwise misuse the site.',
      },
      {
        title: '6. No Advice; No Guarantee of Legitimacy',
        body: 'History and cryptographic proofs are an informational record of uncommissioned traces from independent systems — mail reports, public certificate logs, and public signature logs — as separate kinds. They are not legal, financial, compliance, or business advice, and they do not guarantee that a name, organization, or person is legitimate, safe to transact with, or free of risk. Judgement stays outside the record. You remain solely responsible for your own decisions.',
      },
      {
        title: '7. No Financial Services',
        body: 'We are not a bank, broker, money services business, or financial institution. We do not process, hold, custody, or transfer currency, securities, or financial assets.',
      },
      {
        title: '8. Intellectual Property',
        body: 'Site content, branding, and design for Wake are owned by PBM Labs LLC or its licensors unless otherwise stated. The PACT Protocol specification and whitepaper are published openly for review and implementation; third-party protocol implementations are encouraged subject to their own license terms where applicable. No rights are granted except the limited right to use this site as intended.',
      },
      {
        title: '9. Third-Party Services',
        body: 'The site may rely on or link to third parties (for example DNS providers such as Cloudflare, hosting and edge infrastructure, and database providers). We do not control third-party services and are not responsible for their content, availability, or policies. Your use of those services is subject to their terms.',
      },
      {
        title: '10. Disclaimer of Warranties',
        body: 'The site and service are provided “as is” and “as available” without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted, error-free, complete, or secure, or that published roots or proofs will meet your requirements.',
      },
      {
        title: '11. Limitation of Liability',
        body: 'To the maximum extent permitted by law, PBM Labs LLC and its members, officers, and contractors are not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the site or service, including reliance on the public ledger, even if advised of the possibility of such damages.',
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
    ],
    privacy: [
      {
        title: '1. Overview',
        body: 'This Privacy Policy explains how PBM Labs LLC handles information when you use Wake at leftover.webuildreal.dev. Wake records uncommissioned traces: DMARC aggregate reports, public Certificate Transparency log metadata, and public Rekor log metadata. Aggregate mail reports contain no message content and no personal identities. CT and Rekor data are already public log exhaust, including Rekor identities that were already published in that log.',
      },
      {
        title: '2. Information We Process',
        body: 'Domain and protocol data: sending domains submitted for mail intake; DMARC aggregate report metadata (reporting organization, period, authentication pass/fail counts, selector and infrastructure identifiers in hashed or summarized form); Certificate Transparency first-seen metadata from public logs (issuer, not-before, log time, fingerprint); Rekor subjects as already logged (GitHub URI, email, or host; integrated time; entry id); Merkle leaves, roots, and public verification data. Intake flow data: domain strings you submit; if you use Cloudflare OAuth, tokens and zone information needed to update DNS on your behalf during that session. Browser preferences: theme and language stored in local storage on your device. We do not operate consumer user accounts or marketing profiles on this site.',
      },
      {
        title: '3. What We Do Not Collect',
        body: 'We do not access, read, or store email message bodies, subject lines, recipient identities, or mailbox contents through the PACT Protocol. Aggregate reports used by the protocol are not personal data by design.',
      },
      {
        title: '4. How We Use Information',
        body: 'We use the information above to operate Wake mail intake, ingest and publish independently confirmed history, maintain cryptographic proofs, prevent abuse, and improve reliability of the service. Ledger fields are published so anyone — including agents — can recheck what happened.',
      },
      {
        title: '5. Public Ledger',
        body: 'Leftover identities and their independently confirmed history and proofs are intended to be public on the ledger API. Do not submit a sending domain unless you understand that related authentication metadata will appear in a public ledger. This site does not publish a ranked human evidence profile.',
      },
      {
        title: '6. Service Providers',
        body: 'We use infrastructure providers to host the site and store protocol data (including edge hosting and database services). If you connect via Cloudflare OAuth, Cloudflare processes authentication and DNS updates under its terms. Providers may process data in the United States or other jurisdictions where they operate.',
      },
      {
        title: '7. Cookies and Local Storage',
        body: 'We do not use advertising or analytics tracking pixels on this site. We store essential preferences (such as theme and language) in your browser’s local storage. You can clear these in your browser settings.',
      },
      {
        title: '8. Retention',
        body: 'Public ledger data is retained to preserve the integrity of the append-only record. Operational logs and intake-session data are retained only as needed to run, secure, and debug the service, and to meet legal obligations.',
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
    ],
  },
};
