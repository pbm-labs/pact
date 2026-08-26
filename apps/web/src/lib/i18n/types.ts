export type LegalSectionCopy = { title: string; body: string };

export type Dictionary = {
  nav: {
    language: string;
    intake: string;
    whitepaper: string;
  };
  footer: {
    terms: string;
    privacy: string;
    ledger: string;
    contact: string;
  };
  common: {
    home: string;
    continue: string;
    copy: string;
    copied: string;
    loading: string;
    toggleTheme: string;
  };
  home: {
    heroTitle: string;
    heroAccent: string;
    lede: string;
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
