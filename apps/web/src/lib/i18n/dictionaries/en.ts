import type { Dictionary } from '../types';
import { WHY_PACT_MARKDOWN } from '@/lib/why-pact';

export const en: Dictionary = {
  nav: {
    language: 'Language',
    records: 'Records',
    docs: 'Docs',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  footer: {
    terms: 'Terms',
    privacy: 'Privacy',
  },
  common: {
    home: 'Home',
    continue: 'Continue',
    copy: 'Copy',
    copied: 'Copied',
    loading: 'Loading…',
    toggleTheme: 'Toggle theme',
  },
  home: {
    heroTitle: 'AI can fake everything.',
    heroAccent: 'Except yesterday.',
    heroSub:
      'History exists first. The claim can be made afterwards.',
    manifestoTitle: "The Internet's Identity Problem",
    closeVideo: 'Close',
    howEyebrow: 'How it works',
    howTitle: 'Evidence you can recheck.',
    howLead: 'It does not ask you to trust an authority. It asks you to check a public record.',
    howSteps: [
      {
        title: 'Independent systems report it',
        body: 'Every entry comes from receiving mail systems — Gmail, Outlook, Yahoo, and others — that have no relationship with each other, no incentive to coordinate, and no idea they are being used as evidence. Their uncoordinated agreement over time is what the record contains.',
      },
      {
        title: 'Anyone can check the record',
        body: 'The public record is append-only. Anyone can recompute what was published without asking permission. It is evidence you can recheck — not a claim you must accept.',
      },
      {
        title: 'Yesterday cannot be manufactured',
        body: 'You can buy an aged domain. You can fabricate a LinkedIn history. You cannot make yesterday happen earlier. This history is built from real time passing while independent third parties were watching. There is no shortcut through time.',
      },
    ],
    recordEyebrow: 'Behind every record',
    recordTitle: 'Your full public page.',
    recordSub:
      'Anyone can open it. Independently confirmed history — days, reports, and who confirmed them.',
    mockLabel: 'Example',
    mockTimeSub: 'since first report',
    mockOrgs: 'Reporting orgs',
    mockOrgsSub: 'independent',
    recordFoot:
      'Every entry was confirmed by receiving mail systems — not self-reported. This record only grows forward.',
    privacyTitle: 'Privacy by design.',
    privacyBody1:
      'Connecting points a DNS report address (rua) at us. Independent systems already emit aggregate reports for the domain — authentication counts, period, and infrastructure. That feed is the only data source.',
    privacyBody2: 'The public record is confirmed domain history. Nothing else is collected.',
    privacyTableTitle: "What's in a report",
    privacyRows: [
      'Domain',
      'Reporting period',
      'Pass / fail counts',
      'Reporting organization',
    ],
    ctaTitle: 'Start your public record.',
    ctaBody:
      'Connect once. Independent receiving systems send the reports. The history only grows forward.',
    ctaButton: 'Add your domain',
    ctaSub: 'The record starts when independent reports arrive.',
    watchManifesto: 'Watch The Manifesto',
  },
  connect: {
    backHome: '← Home',
    eyebrow: 'Two minutes, mostly automatic',
    title: 'Add your domain',
    intro:
      'No paperwork, no waiting on anyone. The public record starts when the first independent report arrives.',
    yourDomain: 'Your domain',
    pathCloudflareTitle: 'I use Cloudflare',
    pathCloudflareDesc: 'One click — we handle the rest.',
    pathCloudflareBadge: 'Fastest',
    pathManualTitle: 'Add it manually',
    pathManualDesc:
      'One line to paste wherever you manage your website — GoDaddy, Namecheap, or any other host.',
    pathManualBadge: 'Universal',
    pathToolTitle: 'I already use a tool',
    pathToolDesc: 'Postmark or similar — point it here.',
    pathToolBadge: 'Existing tool',
    whatDoesThisDo: 'What does this do?',
    cloudflareExplain:
      "You'll sign in to Cloudflare and we'll add the verification record for you.",
    toolIntro: "In your tool's settings, add this:",
    toolExplain:
      'Your tool already checks this domain. Pointing it here includes us in that check. Your public record appears automatically when the first report arrives (usually within 24–48 hours) — no extra step here.',
    manualIntro:
      "Paste this wherever you manage your website's settings (ask your host if you're not sure where):",
    manualExplain:
      'One line that lets independent receiving systems send aggregate reports here. If you already have a similar line, add our address to it instead of replacing it. Your public record appears automatically when the first report arrives (usually within 24–48 hours) — nothing else to submit here.',
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
  records: {
    backHome: 'Home',
    eyebrow: 'Public records',
    title: 'Domains with a public record',
    intro:
      'Ranked by independently confirmed history — how long each domain has been reported.',
    addDomain: 'Add your domain',
    rankedBy: 'Ranked by independently confirmed history',
    rankedHint:
      'Longer independently confirmed history ranks higher.',
    colDomain: 'Domain',
    colHistory: 'History',
    verified: 'confirmed',
    report: 'report',
    reports: 'reports',
    org: 'org',
    orgs: 'orgs',
    emptyTitle: 'No domains yet',
    emptyBody: 'Add a domain to start building a public record.',
    emptyCta: 'Add the first domain',
    searchPlaceholder: 'Search by domain…',
    noMatch: 'No domains match "{query}".',
    registered: 'registered',
  },
  domain: {
    backRecords: 'Public records',
    publicRecord: 'Public record',
    awaitingFirst: 'Awaiting first report',
    awaitingIntro:
      'Registered. Waiting for the first independent confirmation — usually within a day.',
    connected: 'Connected',
    whatNext: 'What happens next',
    next1: 'Receiving mail systems notice this domain, usually within a day.',
    next2: 'The first independent reports arrive.',
    next3: 'This page updates on its own — nothing to click.',
    historyIntro:
      'Independently confirmed history anyone can recheck.',
    timeVerified: 'Days confirmed',
    reports: 'Reports',
    allTime: 'all time',
    reportingOrgs: 'Reporting orgs',
    independent: 'independent',
    passRate: 'Pass rate',
    techSummary: 'What was published — reports and cryptographic proofs',
    domainRegistered: 'Domain registered',
    verifiedSince: 'Confirmed since',
    awaitingReport: 'Awaiting first report',
    noRecordYet: 'No public record yet.',
    noRecordHint:
      'If you already added the verification record, bookmark this page. It updates on its own once the first independent check comes back, usually within a day.',
    connectDomain: 'Connect',
    firstDay: 'First day',
    dayOne: '1 day',
    days: '{n} days',
    dbNotConfigured: 'Ledger not configured',
    reportHistory: 'Report history',
    reportHistoryCounts:
      '{periods} report periods from {reporters} reporter orgs — newest first.',
    colReporter: 'Reporter',
    colPeriod: 'Period',
    colPass: 'Pass',
    colFail: 'Fail',
    colIngested: 'Ingested',
    showOlderReports: 'Show older reports ({shown} of {total})',
    verification: 'Verification',
    anchor: 'Anchor',
    onChain: 'On-chain',
    stagingOffChain: 'Staging (off-chain)',
    rootsMatch: 'Roots match',
    yes: 'Yes',
    no: 'No',
    domainLeaves: 'Domain leaves',
    globalTree: 'Global tree',
    publishedRoot: 'Published root',
    proofsShown:
      'Proofs shown for the {n} most recent leaves. Load older reports above to inspect earlier periods.',
    leafHash: 'Leaf hash',
    colWrapper: 'Wrapper DKIM',
    proofVerified: 'Verified',
    proofUnverified: 'Unverified',
    clockUnknown: '—',
    clockDay1: '(Day 1)',
    clockYears: '({n} yrs)',
    clockYear: '({n} yr)',
    clockMonths: '({n} mo)',
    clockDaysShort: '({n}d)',
    shareRecord: 'Public record',
    shareEyebrow: 'Share the record',
    shareLinkedIn: 'LinkedIn',
    shareX: 'X',
    shareText:
      'AI can fake everything. Except yesterday.\n\n{domain} now has a public record anyone can recheck.',
  },
  whitepaper: {
    eyebrow: 'PACT Protocol',
    title: 'Whitepaper',
    intro:
      'The open protocol behind the public record — how independently confirmed history is captured and published.',
    source: 'Source on GitHub →',
  },
  whyPact: {
    eyebrow: 'Docs',
    title: 'Evidence, not authority',
    intro: 'A short note on why the public record publishes what happened instead of asking you to trust a claim.',
    body: WHY_PACT_MARKDOWN,
    scope:
      'PACT measures independently verified domain history from DMARC aggregate reports. It is not KYC, not a verdict that a domain is legitimate, not a personal credential, and not a replacement for registries or credit bureaus. Scores and thresholds are application policy on top of that history.',
  },
  docs: {
    title: 'Docs',
    intro:
      'The public record of independently confirmed domain history. Judgement stays outside. The protocol is PACT.',
    sections: [
      {
        title: 'The record',
        body: 'Receiving mail systems — Gmail, Outlook, Yahoo, and others — already generate DMARC aggregate reports. A domain joins by pointing an existing DNS field at this implementation. Nothing about how it sends mail changes.\n\nThe public page lists days independently confirmed, reports, reporting organizations, observed pass rate, leaves, Merkle proofs, and wrapper DKIM. It does not display a score, a Proven label, or a verdict.',
      },
      {
        title: 'Judgement stays outside',
        body: 'PACT does not define a score, an activation label, or a verdict. Applications may interpret the published fields; an informative example lives in the repository. The record does not decide that a domain is legitimate.',
      },
      {
        title: 'How a domain gets a record',
        body: 'Add rua@pact.webuildreal.dev as a report destination in DNS. Independent systems already emit the reports. The record appears when the first valid aggregate arrives, usually within a day or two.',
      },
      {
        title: 'How anyone checks',
        body: 'Recompute the published leaves and the inclusion proof against the on-chain Merkle root. Wrapper openings — passing d=/selector and keccak256 of the RFC822 — are on the public leaf. The mail itself is not published.',
      },
    ],
    limitsTitle: 'Honest limits',
    limits: [
      'Roots are on Base Sepolia (testnet), permissioned publisher — not mainnet, not permissionless.',
      'The first publishRoot waits on the first live leaf after the D1 cutover.',
      'Reporter-wrapper DKIM is verified at ingest. SPF of the connecting MTA is not. Forwarder DKIM is weaker than a reporter-signed wrapper.',
      'Without the RFC822, DKIM cannot be re-run. The leaf and Merkle proof still can.',
      'Leaf availability is the operator’s database. Roots attest inclusion, not availability.',
    ],
    whyTitle: 'Evidence, not authority',
    whitepaperTitle: 'Whitepaper',
    protocolTitle: 'Protocol',
    scoringTitle: 'Example: scoring',
    statusTitle: 'Status',
    readWhitepaper: 'Read the whitepaper',
    readStatus: 'Read status',
  },
  roadmap: {
    eyebrow: 'Docs',
    title: 'Status',
    intro:
      'The contract is live. Ingest is wired. The public record shows what happened. The first on-chain root waits on the first live report.',
    liveTitle: 'Live today',
    liveItems: [
      'Domain connection via Cloudflare OAuth, manual DNS, or existing reporting tools',
      'Automatic public-record creation on the first valid aggregate report',
      'Ingest fail-closed on reporter-wrapper DKIM (Gmail, Microsoft, Yahoo, Apple, and allowlisted forwarders)',
      'Wrapper witness in the leaf: passing d=/selector and keccak256 of the RFC822 (the mail itself is not published)',
      'Append-only Merkle tree with publicly recomputable inclusion proofs',
      'Merkle roots on PactRoots / Base Sepolia (testnet, permissioned publisher)',
      'Public records ranked by independently confirmed history',
      'Per-domain pages with clocks, observed pass rate, leaves, and cryptographic proofs — no score, Proven label, or verdict badge',
    ],
    waitingTitle: 'Waiting on the world',
    waitingItems: [
      'First live leaves after the D1 cutover, then the first publishRoot. Ingest already writes a leaf and publishes a root when a valid report arrives.',
    ],
    laterTitle: 'Later',
    laterItems: [
      'Content-addressed leaf blobs — public object store plus a CID with each root; D1 stays the query index. Can ship on Sepolia; leaves do not go in the contract',
      'IPFS pin of those blobs as a second retrieval path',
      'Base mainnet for PactRoots',
      'Permissionless publication',
      'Independent third-party leaf mirrors',
      'Velocity as a companion signal for applications',
      'Infrastructure-discontinuity monitoring (Signal)',
    ],
    laterNote:
      'Waiting on reports is operational, not a code task. Later items shrink remaining operator trust. None of them are required for a record to exist once reports arrive.',
  },
  legal: {
    eyebrow: 'Legal',
    lastUpdated: 'Last updated August 16, 2026',
    termsTitle: 'Terms of Service',
    privacyTitle: 'Privacy Policy',
    emailLabel: 'Email',
    terms: [
      {
        title: '1. Acceptance of Terms',
        body: 'By accessing or using this website (webuildreal.dev) and related services of the we build real movement, you agree to these Terms of Service. If you do not agree, do not use the site or connect a domain.',
      },
      {
        title: '2. Who We Are',
        body: 'This site is the public home of we build real, a movement for verifiable history. PACT is an open protocol. PBM Labs LLC (“we”, “us”), a Wyoming limited liability company, provides the first PACT reference implementation. The site offers public access to that implementation: domain connection, a public record of independently verified domain history, and related documentation.',
      },
      {
        title: '3. The Service',
        body: 'PACT captures DMARC aggregate authentication reports that receiving mail systems already generate, commits extracted metadata to an append-only Merkle tree, and publishes a public record of that history for connected domains. Connecting a domain requires adding PACT as a report destination in DNS (directly or via a supported provider). We do not read message content, recipient identities, or mailbox data.',
      },
      {
        title: '4. Public Records',
        body: 'Information published in the public record — including domain names, independently confirmed history, and cryptographic proofs — is intended to be publicly viewable. Do not connect a domain if you are not authorized to make that domain’s authentication metadata part of a public ledger.',
      },
      {
        title: '5. Your Responsibilities',
        body: 'You must only connect domains you control or are authorized to manage. You are responsible for the accuracy of DNS changes you make, for complying with your own policies and applicable law, and for not using the service to harass, defraud, or misrepresent others. You may not attempt unauthorized access, interfere with the service, scrape in a way that degrades it, introduce malware, or otherwise misuse the site.',
      },
      {
        title: '6. No Advice; No Guarantee of Legitimacy',
        body: 'History summaries and cryptographic proofs are an informational record of what independent receiving systems reported. They are not legal, financial, compliance, or business advice, and they do not guarantee that a domain, organization, or person is legitimate, safe to transact with, or free of risk. Judgement stays outside the record. You remain solely responsible for your own decisions.',
      },
      {
        title: '7. No Financial Services',
        body: 'We are not a bank, broker, money services business, or financial institution. We do not process, hold, custody, or transfer currency, securities, or financial assets.',
      },
      {
        title: '8. Intellectual Property',
        body: 'Site content, branding, and design for “we build real” are owned by PBM Labs LLC or its licensors unless otherwise stated. The PACT Protocol specification and whitepaper are published openly for review and implementation; third-party protocol implementations are encouraged subject to their own license terms where applicable. No rights are granted except the limited right to use this site as intended.',
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
        body: 'To the maximum extent permitted by law, PBM Labs LLC and its members, officers, and contractors are not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the site or service, including reliance on public records, even if advised of the possibility of such damages.',
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
        body: 'This Privacy Policy explains how PBM Labs LLC handles information when you use webuildreal.dev — the public home of the we build real movement and of the first reference implementation of the open PACT protocol. PACT is designed so its primary data source — DMARC aggregate reports — contains no message content and no personal identities.',
      },
      {
        title: '2. Information We Process',
        body: 'Domain and protocol data: domain names you connect; DMARC aggregate report metadata (reporting organization, period, authentication pass/fail counts, selector and infrastructure identifiers in hashed or summarized form); Merkle leaves, roots, and public verification data. Connection flow data: domain strings you submit; if you use Cloudflare OAuth, tokens and zone information needed to update DNS on your behalf during that session. Browser preferences: theme and language stored in local storage on your device. We do not operate consumer user accounts or marketing profiles on this site.',
      },
      {
        title: '3. What We Do Not Collect',
        body: 'We do not access, read, or store email message bodies, subject lines, recipient identities, or mailbox contents through the PACT Protocol. Aggregate reports used by the protocol are not personal data by design.',
      },
      {
        title: '4. How We Use Information',
        body: 'We use the information above to operate domain connection, ingest and publish independently confirmed history, maintain cryptographic proofs, prevent abuse, and improve reliability of the service. Public record fields are published so anyone can recheck what happened.',
      },
      {
        title: '5. Public Records',
        body: 'Connected domains and their independently confirmed history and proofs are intended to be public. Do not connect a domain unless you understand that related authentication metadata will appear in a public ledger.',
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
    ],
  },
};
