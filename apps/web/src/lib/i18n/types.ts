export type LegalSectionCopy = { title: string; body: string };

export type StreamCopy = {
  name: string;
  what: string;
  identity: string;
  empty: string;
};

export type Dictionary = {
  nav: {
    language: string;
    intake: string;
    whitepaper: string;
    howItWorks: string;
  };
  footer: {
    terms: string;
    privacy: string;
    ledger: string;
    contact: string;
    operator: string;
  };
  common: {
    home: string;
    continue: string;
    copy: string;
    copied: string;
    loading: string;
    toggleTheme: string;
    openMenu: string;
    closeMenu: string;
  };
  home: {
    title: string;
    lede: string;
    identityLabel: string;
    stakeLabel: string;
    emptyLabel: string;
    agents: string;
    catalog: string;
    intakeCta: string;
    stakeCalendar: string;
    stakeCounterparty: string;
    stakeCalendarHint: string;
    stakeCounterpartyHint: string;
    unknownWhat: string;
    unknownEmpty: string;
    heroLine1: string;
    heroLine2: string;
    turnLine: string;
    howItWorksHeading: string;
    seeHowItWorks: string;
    liveHeading: string;
    liveViewRecord: string;
    proofRoot: string;
    proofEmpty: string;
    proofIncluded: string;
    chainBaseSepolia: string;
    recordsHeading: string;
    streamLabel: string;
    querySubmit: string;
    queryFailed: string;
    queryHint: string;
    outlivesHeading: string;
    outlivesBody: string;
    governedHeading: string;
    governedBody: string;
    streams: Record<string, StreamCopy>;
  };
  connect: {
    backHome: string;
    eyebrow: string;
    title: string;
    intro: string;
    yourDomain: string;
    pathCloudflareTitle: string;
    pathCloudflareDesc: string;
    pathManualTitle: string;
    pathManualDesc: string;
    pathToolTitle: string;
    pathToolDesc: string;
    pathCloudflareEffort: string;
    pathManualEffort: string;
    pathToolEffort: string;
    afterOptions: string;
    putOnLedger: string;
    ledgerExplain: string;
    backToPaths: string;
    whatDoesThisDo: string;
    cloudflareExplain: string;
    toolIntro: string;
    toolExplain: string;
    manualIntro: string;
    manualExplain: string;
    doneTitle: string;
    doneBody: string;
    doneNext: string;
    errors: {
      invalid_domain: string;
      server_config: string;
      oauth_not_configured: string;
      missing_code: string;
      invalid_state: string;
      token_exchange: string;
      zone_not_found: string;
      dmarc_update: string;
      register: string;
      somethingWrong: string;
    };
  };
  whitepaper: {
    eyebrow: string;
    title: string;
    subtitle: string;
    updated: string;
  };
  legal: {
    eyebrow: string;
    lastUpdated: string;
    termsTitle: string;
    privacyTitle: string;
    emailLabel: string;
    terms: LegalSectionCopy[];
    privacy: LegalSectionCopy[];
  };
};

export type { Dictionary as default };
