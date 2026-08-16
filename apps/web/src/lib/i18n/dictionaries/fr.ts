import type { Dictionary } from '../types';

export const fr: Dictionary = {
  nav: {
    language: 'Langue',
    publicRecords: 'Registres publics',
  },
  footer: {
    docs: 'Docs',
    terms: 'Conditions',
    privacy: 'Confidentialité',
  },
  common: {
    home: 'Accueil',
    continue: 'Continuer',
    copy: 'Copier',
    copied: 'Copié',
    loading: 'Chargement…',
    toggleTheme: 'Changer de thème',
    trustScore: 'Score de confiance {n} sur 100',
  },
  home: {
    heroTitle: 'L’IA peut tout falsifier.',
    heroAccent: 'Sauf hier.',
    heroSub:
      'L’histoire existe d’abord. L’affirmation peut se faire ensuite.',
    manifestoEyebrow: 'Le manifeste',
    manifestoTitle: 'Le problème d’identité d’Internet',
    manifestoSub: 'Pourquoi l’histoire est la seule chose qui ne peut encore se fabriquer.',
    closeVideo: 'Fermer',
    howEyebrow: 'Comment ça marche',
    howTitle: 'De l’évidence que l’on peut revérifier.',
    howLead: 'Il ne vous demande pas de faire confiance à une autorité. Il vous demande de consulter un registre public.',
    howSteps: [
      {
        title: 'Des systèmes indépendants le rapportent',
        body: 'Chaque entrée vient de systèmes de messagerie destinataires — Gmail, Outlook, Yahoo et d’autres — qui n’ont aucun lien entre eux, aucun motif de se coordonner, et ignorent qu’ils servent d’évidence. Leur accord non coordonné dans le temps est ce que contient le registre.',
      },
      {
        title: 'N’importe qui peut vérifier le registre',
        body: 'Le registre public est append-only. N’importe qui peut recalculer ce qui a été publié sans demander la permission. C’est de l’évidence que l’on peut revérifier — pas une affirmation à accepter.',
      },
      {
        title: 'Hier ne se fabrique pas',
        body: 'Vous pouvez acheter un domaine âgé. Fabriquer un LinkedIn. Vous ne pouvez pas faire arriver hier plus tôt. Cet historique se construit avec le temps réel qui passe pendant que des tiers indépendants regardaient. Il n’y a pas de raccourci dans le temps.',
      },
    ],
    recordEyebrow: 'Derrière chaque registre',
    recordTitle: 'Votre page publique complète.',
    recordSub:
      'N’importe qui peut l’ouvrir. Historique confirmé de façon indépendante — jours, rapports, et qui les a confirmés.',
    mockLabel: 'Exemple',
    mockStatusSub: 'Historique confirmé de façon indépendante, encore en train de s’accumuler.',
    mockTimeSub: 'depuis le premier rapport',
    mockOrgs: 'Orgs déclarantes',
    mockOrgsSub: 'indépendantes',
    recordFoot:
      'Chaque entrée a été confirmée par des systèmes de messagerie destinataires — pas auto-déclarée. Ce registre ne grandit que vers l’avant.',
    privacyTitle: 'Confidentialité par conception.',
    privacyBody1:
      'En connectant, un enregistrement DNS pointe une adresse de rapports (rua) vers nous. Des systèmes indépendants émettent déjà des rapports agrégés pour le domaine — compteurs d’authentification, période et infrastructure. Cette source est la seule.',
    privacyBody2: 'Le registre public est l’historique de domaine confirmé. Rien d’autre n’est collecté.',
    privacyTableTitle: 'Ce qu’il y a dans un rapport',
    privacyRows: [
      'Domaine',
      'Période du rapport',
      'Compteurs succès / échec',
      'Organisation déclarante',
    ],
    badgeEyebrow: 'Un lien vers le registre',
    badgeTitle: 'Collez une fois. Vit dans chaque email que vous envoyez.',
    badgeSub:
      'Pas un certificat. Un lien live vers l’historique confirmé de façon indépendante — collez-le dans votre signature, n’importe qui peut ouvrir le registre.',
    signatureName: 'Jane Doe',
    signatureRole: 'Fondatrice · Acme Studio',
    signatureContact: '+1 (415) 555-0134 · acme.studio',
    badgeFoot:
      'Fonctionne dans Gmail, Outlook, Apple Mail, et partout où les signatures HTML fonctionnent.',
    ctaTitle: 'Commencez votre registre public.',
    ctaBody:
      'Connectez une fois. Des systèmes destinataires indépendants envoient les rapports. L’historique ne grandit que vers l’avant.',
    ctaButton: 'Ajoutez votre domaine',
    ctaSub: 'Le registre commence à l’arrivée des rapports indépendants.',
    watchManifesto: 'Voir le manifeste',
  },
  connect: {
    backHome: '← Accueil',
    eyebrow: 'Deux minutes, presque automatique',
    title: 'Ajoutez votre domaine',
    intro:
      'Pas de paperasse, pas d’attente. Le registre public commence à l’arrivée du premier rapport indépendant.',
    yourDomain: 'Votre domaine',
    pathCloudflareTitle: "J'utilise Cloudflare",
    pathCloudflareDesc: 'Un clic — nous nous occupons du reste.',
    pathCloudflareBadge: 'Le plus rapide',
    pathManualTitle: 'Ajouter manuellement',
    pathManualDesc:
      'Une ligne à coller là où vous gérez votre site — GoDaddy, Namecheap ou tout autre hébergeur.',
    pathManualBadge: 'Universel',
    pathToolTitle: "J'utilise déjà un outil",
    pathToolDesc: 'Postmark ou similaire — pointez-le ici.',
    pathToolBadge: 'Outil existant',
    whatDoesThisDo: 'Que fait cela ?',
    cloudflareExplain:
      "Vous vous connecterez à Cloudflare et nous ajouterons l'enregistrement de vérification pour vous.",
    toolIntro: "Dans les paramètres de votre outil, ajoutez ceci :",
    toolExplain:
      'Votre outil vérifie déjà ce domaine. Le pointer ici nous inclut dans cette vérification. Votre fiche publique apparaît automatiquement à l’arrivée du premier rapport (souvent sous 24–48 h) — rien d’autre à envoyer ici.',
    manualIntro:
      "Collez ceci là où vous gérez les paramètres de votre site (demandez à votre hébergeur si vous n'êtes pas sûr) :",
    manualExplain:
      "Une ligne qui permet à des systèmes destinataires indépendants d’envoyer des rapports agrégés ici. Si vous avez déjà une ligne similaire, ajoutez notre adresse au lieu de la remplacer. Votre fiche publique apparaît automatiquement à l’arrivée du premier rapport (souvent sous 24–48 h) — rien d’autre à envoyer ici.",
    errors: {
      invalid_domain: 'Saisissez un domaine valide (ex. example.com).',
      server_config:
        'Le serveur n\'a pas CONNECT_STATE_SECRET ou les identifiants d\'écriture du registre.',
      oauth_not_configured:
        "La connexion Cloudflare n'est pas configurée sur ce serveur.",
      missing_code: 'La connexion a été annulée ou est incomplète.',
      invalid_state: 'Session expirée — réessayez de connecter.',
      token_exchange: 'Impossible de terminer la connexion à Cloudflare.',
      zone_not_found:
        "Ce domaine n'a pas été trouvé dans le compte Cloudflare choisi. Essayez un autre compte.",
      dmarc_update:
        "Impossible de terminer la configuration automatiquement. Essayez l'option manuelle.",
      register: 'Presque — la dernière étape a échoué. Réessayez.',
      somethingWrong: "Une erreur s'est produite.",
    },
  },
  records: {
    backHome: 'Accueil',
    eyebrow: 'Registres publics',
    title: 'Domaines avec un registre public',
    intro:
      'Classés par historique confirmé de façon indépendante — depuis combien de temps chaque domaine a été rapporté.',
    addDomain: 'Ajoutez votre domaine',
    building: 'En construction',
    proven: 'Éprouvé',
    rankedBy: 'Classés par historique confirmé de façon indépendante',
    rankedHint:
      'Un historique confirmé indépendamment plus long se classe plus haut.',
    colDomain: 'Domaine',
    colHistory: 'Historique',
    colStatus: 'Statut',
    verified: 'confirmé',
    report: 'rapport',
    reports: 'rapports',
    org: 'org',
    orgs: 'orgs',
    emptyTitle: 'Aucun domaine pour le moment',
    emptyBody: 'Ajoutez un domaine pour commencer un registre public.',
    emptyCta: 'Ajouter le premier domaine',
    searchPlaceholder: 'Rechercher par domaine…',
    noMatch: 'Aucun domaine ne correspond à « {query} ».',
    registered: 'enregistré',
  },
  domain: {
    backRecords: 'Registres publics',
    publicRecord: 'Registre public',
    building: 'En construction',
    proven: 'Éprouvé',
    awaitingFirst: 'En attente du premier rapport',
    awaitingIntro:
      'Enregistré. En attente de la première confirmation indépendante — généralement sous un jour.',
    connected: 'Connecté',
    whatNext: 'Et ensuite',
    next1: 'Les systèmes de messagerie destinataires remarquent ce domaine, généralement sous un jour.',
    next2: 'Les premiers rapports indépendants arrivent.',
    next3: 'Cette page se met à jour toute seule — rien à cliquer.',
    historyIntro:
      'Historique confirmé de façon indépendante, que chacun peut revérifier.',
    scoreIntro:
      'Historique confirmé de façon indépendante, que chacun peut revérifier.',
    timeVerified: 'Jours confirmés',
    reports: 'Rapports',
    allTime: 'depuis le début',
    reportingOrgs: 'Orgs déclarantes',
    independent: 'indépendantes',
    passRate: 'Taux de réussite',
    techSummary: 'Ce qui a été publié — rapports et preuves cryptographiques',
    showMath: 'Voir le calcul',
    domainRegistered: 'Domaine enregistré',
    verifiedSince: 'Confirmé depuis',
    awaitingReport: 'En attente du premier rapport',
    noRecordYet: 'Pas encore de registre public.',
    noRecordHint:
      "Si vous avez déjà ajouté l'enregistrement de vérification, mettez cette page en favori. Elle se met à jour seule dès que le premier contrôle indépendant revient, généralement sous un jour.",
    connectDomain: 'Connecter',
    firstDay: 'Premier jour',
    dayOne: '1 jour',
    days: '{n} jours',
    progressDaysToBand: 'Environ {days} jours de plus pour atteindre « {band} », à ce rythme.',
    progressBuilding: 'L\'historique continue de se construire à chaque confirmation indépendante.',
    progressStarts: 'Cela commence à bouger dès votre première confirmation.',
    bands: {
      no_history_yet: 'Pas encore d\'historique',
      provisional: 'Provisoire',
      early: 'Précoce',
      established: 'Établi',
      high_confidence: 'Confiance élevée',
      maximum_confidence: 'Confiance maximale',
    },
    mathRawScore: 'Score brut (T)',
    mathDisplay: 'Affiché',
    mathVolume: 'Volume (V)',
    mathDiversity: 'Diversité (D)',
    mathMaturity: 'Maturité (A)',
    mathFailedChecks: 'Contrôles échoués',
    dbNotConfigured: 'Registre non configuré',
    reportHistory: 'Historique des rapports',
    reportHistoryIntro:
      'Les contrôles indépendants arrivent en continu depuis les reporters connectés (généralement chaque jour).',
    reportHistoryCounts:
      '{periods} périodes de rapport de {reporters} organisations reporteuses — les plus récentes en premier.',
    colReporter: 'Reporter',
    colPeriod: 'Période',
    colPass: 'Réussi',
    colFail: 'Échoué',
    colIngested: 'Ingesté',
    showOlderReports: 'Afficher les rapports plus anciens ({shown} sur {total})',
    verification: 'Vérification',
    verificationIntro:
      'Preuves d\'inclusion recalculées à partir des feuilles en direct contre la dernière racine on-chain.',
    anchor: 'Ancre',
    onChain: 'On-chain',
    stagingOffChain: 'Staging (hors chaîne)',
    rootsMatch: 'Racines concordantes',
    yes: 'Oui',
    no: 'Non',
    domainLeaves: 'Feuilles du domaine',
    globalTree: 'Arbre global',
    publishedRoot: 'Racine publiée',
    proofsShown:
      'Preuves affichées pour les {n} feuilles les plus récentes. Chargez les rapports plus anciens ci-dessus pour inspecter les périodes antérieures.',
    leafHash: 'Hash de la feuille',
    colWrapper: 'DKIM du wrapper',
    proofVerified: 'Vérifiée',
    proofUnverified: 'Non vérifiée',
    clockUnknown: '—',
    clockDay1: '(Jour 1)',
    clockYears: '({n} ans)',
    clockYear: '({n} an)',
    clockMonths: '({n} mo)',
    clockDaysShort: '({n}j)',
    pathEyebrow: 'Ce qui continue de s’accumuler',
    pathDaysItem: '{n} jours d’historique confirmé de façon indépendante',
    pathDaysCurrent: 'vous en êtes à {n}',
    pathReportersItem: 'Au moins une organisation reporteuse indépendante',
    pathReportersCurrent: 'vous en avez {n}',
    pathExplainer:
      'Une organisation reporteuse indépendante est un système de messagerie destinataire — Gmail, Outlook, Yahoo et d’autres — qui a confirmé ce domaine avec sa propre authentification. L’accord non coordonné dans le temps est ce que contient le registre.',
    pathFoot:
      'Chaque confirmation vient de systèmes destinataires indépendants — pas d’auto-déclaration. Ce registre ne grandit que vers l’avant.',
    badgeEyebrow: 'Badge intégrable',
    badgeIntro:
      'Pas un certificat. Un lien live vers cette page — collez-le dans une signature, n’importe qui peut ouvrir le registre.',
    shareRecord: 'Registre public',
    shareEyebrow: 'Partagez le registre',
    shareLinkedIn: 'LinkedIn',
    shareX: 'X',
    shareText:
      'L’IA peut tout falsifier. Sauf hier.\n\n{domain} a désormais un registre public que n’importe qui peut revérifier.',
  },
  badge: {
    mockLabel: 'Votre signature email',
    signatureName: 'Votre nom',
    signatureRole: 'Fonction · Entreprise',
    signatureContact: 'nom@{domain}',
    copyBadge: 'Copier le badge',
    copyDone: 'Copié — collez-le dans votre signature',
    copyError: 'Échec de la copie — réessayez',
    howTo:
      'Fonctionne dans Gmail, Outlook et Apple Mail. Le badge reste cliquable une fois collé.',
    alt: 'Badge we build real pour {domain}',
    themeAria: 'Thème du badge',
    themeDark: 'Sombre',
    themeLight: 'Clair',
  },
  whitepaper: {
    eyebrow: 'PACT Protocol',
    title: 'Whitepaper',
    intro:
      "Le protocole ouvert derrière le registre public — comment l'historique confirmé de façon indépendante est capturé et publié.",
    source: 'Source sur GitHub →',
  },
  whyPact: {
    eyebrow: 'PACT Protocol',
    title: 'De l’évidence, pas de l’autorité',
    intro: 'Une note courte sur pourquoi PACT publie ce qui s’est passé plutôt que de vous demander de faire confiance à une affirmation.',
    body: [
      "Chaque façon existante de prouver qu'une entreprise est réelle partage le même défaut : c'est l'*affirmation d'une autorité*, pas de l'*évidence*. Un rapport de bureau de crédit, une inscription au registre, un relevé bancaire, un historique LinkedIn — tous vous demandent de faire confiance à la vérification de quelqu'un d'autre. Aucun ne produit quelque chose qu'un inconnu peut vérifier lui-même, depuis les premiers principes, sans faire confiance à un gardien.",
      "Ce défaut était tolérable. Il ne l'est plus. L'IA générative n'a pas créé une nouvelle menace — elle a retiré la dernière chose qui rendait ces signaux chers à falsifier. Un domaine de dix ans, cinq ans de LinkedIn, un relevé convaincant : tout cela se fabrique désormais à bas coût. Les autorités n'ont pas empiré. Le coût de leur mentir s'est effondré.",
      "PACT ne vous demande pas de faire confiance à une autorité. Il vous demande de consulter un registre public.",
      "Chaque fait du registre vient de systèmes de messagerie destinataires indépendants — Gmail, Outlook, Yahoo et d'autres — qui n'ont aucun lien entre eux, aucun motif de se coordonner, et ignorent qu'ils servent d'évidence. Leur accord agrégé et non coordonné dans le temps est ce que contient le registre. Pas parce que PACT le dit. Parce que n'importe qui peut recalculer les feuilles publiées et les preuves d'inclusion contre la racine Merkle on-chain, sans demander la permission à PACT. Les racines sont aujourd'hui sur Base Sepolia (testnet, éditeur permissionné). Le DKIM du wrapper rapporteur est vérifié à l'ingest, et le d=/sélecteur qui passe plus le keccak256 du wrapper sont engagés dans la feuille. Le RFC822 lui-même n'est pas publié. Ce qui reste est une confiance opérateur plus étroite : disponibilité des feuilles et cette clé d'édition — pas un changement de thèse.",
      "Cette évidence est obstinément ennuyeuse sur ce qui s'est passé. Le jugement reste dehors. Le même historique peut alimenter des politiques d'application différentes. Un témoin plus fort n'hérite toujours pas de la décision.",
      "C'est la propriété que les preuves incumbentes ne peuvent pas greffer. Un bureau de crédit ne peut pas devenir trustless — son modèle *est* l'intermédiaire de confiance. Un registre d'État ne peut pas devenir trustless — c'est une autorité par définition. Un relevé bancaire ne peut pas devenir trustless — c'est un document, et les documents s'éditent. PACT n'est pas une meilleure version de cela. Il est dans une autre catégorie : de l'évidence que l'on peut revérifier, pas une affirmation à accepter.",
      "Voici ce qui rend cela durable, pas seulement différent : **l'historique que PACT mesure ne peut pas être fabriqué après coup, à aucun prix — y compris par les opérateurs de PACT.**",
      "Vous pouvez acheter un domaine âgé. Fabriquer un LinkedIn. Monter une société écran avec des papiers parfaits. Ce que vous ne pouvez pas faire, c'est faire arriver hier plus tôt. L'historique de PACT se construit avec le temps réel qui passe pendant que des tiers indépendants regardaient. Il n'y a pas de raccourci dans le temps. Ce n'est pas une préférence produit. C'est une contrainte physique que PACT met au travail.",
      "C'est pourquoi PACT ne concurrence pas aujourd'hui sur le coût ou la commodité, et n'en a pas besoin. Les méthodes existantes sont bon marché et instantanées *parce qu'*elles sont assez superficielles pour être falsifiées à bas coût et instantanément. PACT est lent à construire *parce qu'*un adversaire bien financé, patient, équipé d'IA ne peut toujours pas acheter un passé qu'il n'a pas vécu. La lenteur n'est pas une limite à optimiser. C'est le point.",
      'Toute autre preuve de légitimité répond : *qu\'a-t-on affirmé, et qui s\'en porte garant ?*',
      'PACT répond à une autre question : *que s\'est-il vraiment passé, pendant combien de temps, attesté par combien de parties indépendantes qui n\'avaient aucune raison de mentir ?*',
      "Cette question n'a jamais eu de réponse publique durable. À partir de maintenant, elle en a une.",
    ].join('\n\n'),
    scope:
      "PACT mesure l'historique de domaine vérifié de façon indépendante à partir des rapports agrégés DMARC. Ce n'est pas du KYC, pas un verdict qu'un domaine est légitime, pas une identité personnelle, et pas un substitut aux registres ou aux bureaux de crédit. Scores et seuils sont une politique d'application sur cet historique.",
  },
  docs: {
    eyebrow: 'PACT Protocol',
    title: 'Docs',
    intro:
      'PACT est un protocole ouvert. we build real est le mouvement. Ceci est l’implémentation de référence — un registre public d’historique de domaine confirmé de façon indépendante. Le jugement reste dehors.',
    sections: [
      {
        title: 'Le registre',
        body: 'PACT publie un historique de domaine confirmé de façon indépendante à partir des rapports agrégés DMARC. Les systèmes de messagerie destinataires — Gmail, Outlook, Yahoo et d’autres — génèrent déjà ces rapports. Un domaine rejoint en pointant un champ DNS existant vers PACT. Rien ne change dans la façon dont il envoie du courrier.\n\nLa page publique liste ce qui s’est passé : jours confirmés de façon indépendante, rapports, organisations déclarantes, taux de réussite observé, feuilles, preuves Merkle et DKIM du wrapper. Elle n’affiche pas de score, d’étiquette Proven, ni de verdict.',
      },
      {
        title: 'Le jugement reste dehors',
        body: 'Le protocole est obstinément ennuyeux sur ce qui s’est passé. Une formule de score existe pour les applications qui choisissent d’interpréter. Les libellés d’activation tels que Proven sont une politique d’application. Le même historique peut alimenter des décisions différentes. PACT ne décide pas qu’un domaine est légitime.',
      },
      {
        title: 'Comment un domaine obtient un registre',
        body: 'Ajoutez PACT comme destination de rapports dans le DNS — rua@pact.webuildreal.dev. Des systèmes indépendants émettent déjà les rapports. Le registre public apparaît à l’arrivée du premier agrégé valide, souvent sous un jour ou deux. Rien d’autre à envoyer ici.',
      },
      {
        title: 'Comment n’importe qui vérifie',
        body: 'Recalculez les feuilles publiées et la preuve d’inclusion contre la racine Merkle on-chain. Vous n’avez besoin ni de permission, ni d’une clé d’API, ni de la parole de l’opérateur pour cette vérification d’inclusion. Les ouvertures du wrapper — d=/sélecteur qui passe et keccak256 du RFC822 — sont sur la feuille publique pour que l’engagement puisse être recalculé. Le courrier lui-même n’est pas publié.',
      },
    ],
    limitsTitle: 'Limites honnêtes',
    limits: [
      'Les racines sont sur Base Sepolia (testnet), avec un éditeur permissionné. Indépendamment vérifiable. Ce n’est pas Base mainnet, ni une publication permissionless.',
      'Le premier publishRoot attend la première feuille live après le basculement D1.',
      'Le DKIM du wrapper rapporteur est vérifié à l’ingest. Le SPF du MTA connectant n’est pas vérifié de façon indépendante — Email Routing a accepté le saut. Le DKIM d’un forwarder est plus faible que celui du rapporteur signant le wrapper lui-même.',
      'Sans une copie du RFC822, un inconnu ne peut pas relancer DKIM. Il peut toujours recalculer la feuille à partir des ouvertures et vérifier la preuve Merkle.',
      'La disponibilité des feuilles est la base de l’opérateur. Les racines attestent l’inclusion, pas que les feuilles resteront disponibles.',
    ],
    furtherTitle: 'Lire la suite',
    whyTitle: 'De l’évidence, pas de l’autorité',
    whyBody: 'Pourquoi PACT publie ce qui s’est passé plutôt que de vous demander de faire confiance à une affirmation.',
    whitepaperTitle: 'Whitepaper',
    whitepaperBody:
      "Le protocole ouvert derrière le registre public — comment l'historique confirmé de façon indépendante est capturé et publié.",
    protocolTitle: 'Spécification du protocole',
    protocolBody:
      'Spécification normative — arbre de Merkle, encodage des feuilles (témoin du wrapper dans la feuille), formule de score pour les applications, et racines on-chain.',
    statusTitle: 'État',
    statusBody: 'Ce qui est en ligne, ce qui attend le monde, et ce qui vient plus tard.',
    readWhitepaper: 'Lire le whitepaper',
    readStatus: 'Lire l’état',
  },
  roadmap: {
    eyebrow: 'PACT Protocol',
    title: 'État',
    intro:
      'Le contrat est en ligne. L’ingest est câblé. Le registre public montre ce qui s’est passé. La première racine on-chain attend le premier rapport réel.',
    liveTitle: "En ligne aujourd'hui",
    liveItems: [
      'Connexion de domaine via OAuth Cloudflare, DNS manuel ou outils de reporting existants',
      'Création automatique du registre public dès le premier rapport agrégé valide',
      'Ingest fail-closed sur le DKIM du wrapper rapporteur (Gmail, Microsoft, Yahoo, Apple et forwarders sur liste)',
      'Témoin du wrapper dans la feuille : d=/sélecteur qui passe et keccak256 du RFC822 (le courrier n’est pas publié)',
      'Arbre de Merkle append-only avec preuves d’inclusion recomputables publiquement',
      'Racines Merkle sur PactRoots / Base Sepolia (testnet, éditeur permissionné)',
      'Registres publics classés par historique confirmé de façon indépendante',
      'Pages par domaine avec horloges, taux de réussite observé, feuilles et preuves cryptographiques — pas de score, d’étiquette Proven, ni de verdict',
    ],
    waitingTitle: 'En attente du monde',
    waitingItems: [
      'Premières feuilles live après le basculement D1, puis le premier publishRoot. L’ingest écrit déjà une feuille et publie une racine à l’arrivée d’un rapport valide.',
    ],
    laterTitle: 'Plus tard',
    laterItems: [
      'Base mainnet pour PactRoots',
      'Publication permissionless',
      'Miroirs indépendants des feuilles',
      'La vélocité comme signal compagnon pour les applications',
      'Surveillance des discontinuités d’infrastructure (Signal)',
    ],
    laterNote:
      'Attendre des rapports est opérationnel, pas une tâche de code. Les points suivants réduisent la confiance opérateur restante. Aucun n’est requis pour qu’un registre existe une fois les rapports arrivés.',
  },
  legal: {
    eyebrow: 'Mentions légales',
    lastUpdated: 'Dernière mise à jour le 16 août 2026',
    termsTitle: "Conditions d'utilisation",
    privacyTitle: 'Politique de confidentialité',
    emailLabel: 'E-mail',
    terms: [
      {
        title: '1. Acceptation des conditions',
        body: "En accédant à ce site (webuildreal.dev) et aux services associés exploités sous la marque « we build real », ou en les utilisant, vous acceptez les présentes Conditions d'utilisation. Si vous n'êtes pas d'accord, n'utilisez pas le site et ne connectez pas de domaine.",
      },
      {
        title: '2. Qui nous sommes',
        body: "Ce site est le foyer public de we build real, un mouvement pour une histoire vérifiable. PACT est un protocole ouvert. PBM Labs LLC (« nous »), une limited liability company du Wyoming, fournit la première implémentation de référence de PACT. Il donne un accès public à cette implémentation : connexion de domaines, registre public d'historique de domaines vérifié de façon indépendante, et documentation associée.",
      },
      {
        title: '3. Le service',
        body: "PACT capture les rapports d'authentification agrégés DMARC que les systèmes de messagerie destinataires génèrent déjà, inscrit les métadonnées extraites dans un arbre de Merkle append-only, et publie un registre public de cet historique pour les domaines connectés. Connecter un domaine nécessite d'ajouter PACT comme destination de rapports dans le DNS (directement ou via un fournisseur pris en charge). Nous ne lisons ni le contenu des messages, ni les identités des destinataires, ni les données de boîte aux lettres.",
      },
      {
        title: '4. Registres publics',
        body: "Les informations publiées dans le registre public — notamment les noms de domaine, l'historique confirmé de façon indépendante et les preuves cryptographiques — sont destinées à être consultables publiquement. Ne connectez pas un domaine si vous n'êtes pas autorisé à faire figurer les métadonnées d'authentification de ce domaine dans un registre public.",
      },
      {
        title: '5. Vos responsabilités',
        body: "Vous ne devez connecter que des domaines que vous contrôlez ou que vous êtes autorisé à gérer. Vous êtes responsable de l'exactitude des modifications DNS que vous effectuez, du respect de vos propres politiques et du droit applicable, et de ne pas utiliser le service pour harceler, frauder ou induire en erreur. Vous ne devez pas tenter d'accès non autorisé, interférer avec le service, scraper de manière à le dégrader, introduire de logiciels malveillants, ni autrement en abuser.",
      },
      {
        title: '6. Pas de conseil ; aucune garantie de légitimité',
        body: "Les résumés d'historique et les preuves cryptographiques sont un enregistrement informatif de ce que des systèmes destinataires indépendants ont rapporté. Ils ne constituent pas un conseil juridique, financier, de conformité ou commercial, et ne garantissent pas qu'un domaine, une organisation ou une personne soit légitime, sûr pour une transaction, ou sans risque. Le jugement reste hors du registre. Vous restez seul responsable de vos décisions.",
      },
      {
        title: '7. Pas de services financiers',
        body: "Nous ne sommes ni une banque, ni un courtier, ni une entreprise de services monétaires, ni une institution financière. Nous ne traitons, ne détenons, ne conservons ni ne transférons de devises, titres ou actifs financiers.",
      },
      {
        title: '8. Propriété intellectuelle',
        body: "Le contenu du site, la marque et le design de « we build real » appartiennent à PBM Labs LLC ou à ses concédants, sauf indication contraire. La spécification du protocole PACT et le whitepaper sont publiés ouvertement pour examen et mise en œuvre ; les implémentations tierces sont encouragées sous réserve de leurs propres licences le cas échéant. Aucun droit n'est concédé sauf le droit limité d'utiliser ce site conformément à sa destination.",
      },
      {
        title: '9. Services tiers',
        body: "Le site peut s'appuyer sur des tiers ou renvoyer vers eux (par exemple des fournisseurs DNS comme Cloudflare, l'hébergement et l'infrastructure edge, et des bases de données). Nous ne contrôlons pas les services tiers et ne sommes pas responsables de leur contenu, disponibilité ou politiques. Votre utilisation de ces services est soumise à leurs conditions.",
      },
      {
        title: '10. Exclusion de garanties',
        body: "Le site et le service sont fournis « en l'état » et « selon disponibilité », sans garantie d'aucune sorte, expresse ou implicite, y compris de qualité marchande, d'adéquation à un usage particulier et d'absence de contrefaçon. Nous ne garantissons pas que le service sera ininterrompu, sans erreur, complet ou sûr, ni que les racines ou preuves publiées répondront à vos besoins.",
      },
      {
        title: '11. Limitation de responsabilité',
        body: "Dans la mesure maximale permise par la loi, PBM Labs LLC et ses membres, dirigeants et prestataires ne sont pas responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs découlant de votre utilisation du site ou du service, y compris de la confiance accordée aux registres publics, même s'ils ont été informés de la possibilité de tels dommages.",
      },
      {
        title: '12. Modifications',
        body: "Nous pouvons mettre à jour ces Conditions de temps à autre. La version révisée sera publiée sur cette page avec une date mise à jour. L'utilisation continue du site après modification vaut acceptation des Conditions révisées.",
      },
      {
        title: '13. Droit applicable',
        body: "Ces Conditions sont régies par les lois de l'État du Wyoming, États-Unis, sans égard aux principes de conflit de lois.",
      },
      {
        title: '14. Contact',
        body: 'Avis juridiques et questions sur ces Conditions : hello@pbm-labs.com.',
      },
    ],
    privacy: [
      {
        title: '1. Vue d\'ensemble',
        body: "Cette Politique de confidentialité explique comment PBM Labs LLC traite les informations lorsque vous utilisez webuildreal.dev — le foyer public du mouvement we build real et de la première implémentation de référence du protocole ouvert PACT. PACT est conçu pour que sa source de données principale — les rapports agrégés DMARC — ne contienne ni contenu de message ni identités personnelles.",
      },
      {
        title: '2. Informations que nous traitons',
        body: "Données de domaine et de protocole : noms de domaine que vous connectez ; métadonnées des rapports agrégés DMARC (organisation déclarante, période, comptes de réussite/échec d'authentification, sélecteurs et identifiants d'infrastructure sous forme hachée ou résumée) ; feuilles Merkle, racines et données de vérification publiques. Données du parcours de connexion : chaînes de domaine que vous soumettez ; si vous utilisez OAuth Cloudflare, jetons et informations de zone nécessaires pour mettre à jour le DNS en votre nom pendant cette session. Préférences du navigateur : thème et langue stockés dans le local storage de votre appareil. Nous n'exploitons pas de comptes utilisateurs grand public ni de profils marketing sur ce site.",
      },
      {
        title: '3. Ce que nous ne collectons pas',
        body: "Nous n'accédons pas, ne lisons pas et ne stockons pas les corps de messages e-mail, objets, identités de destinataires ou contenus de boîtes aux lettres via le protocole PACT. Les rapports agrégés utilisés par le protocole ne constituent pas, par conception, des données personnelles.",
      },
      {
        title: '4. Comment nous utilisons les informations',
        body: "Nous utilisons les informations ci-dessus pour assurer la connexion des domaines, ingérer et publier l'historique confirmé de façon indépendante, maintenir les preuves cryptographiques, prévenir les abus et améliorer la fiabilité du service. Les champs du registre public sont publiés pour que quiconque puisse revérifier ce qui s'est passé.",
      },
      {
        title: '5. Registres publics',
        body: "Les domaines connectés et leur historique confirmé de façon indépendante ainsi que leurs preuves sont destinés à être publics. Ne connectez pas un domaine sans comprendre que les métadonnées d'authentification associées apparaîtront dans un registre public.",
      },
      {
        title: '6. Prestataires',
        body: "Nous utilisons des prestataires d'infrastructure pour héberger le site et stocker les données du protocole (notamment hébergement edge et bases de données). Si vous vous connectez via OAuth Cloudflare, Cloudflare traite l'authentification et les mises à jour DNS selon ses conditions. Les prestataires peuvent traiter des données aux États-Unis ou dans d'autres juridictions où ils opèrent.",
      },
      {
        title: '7. Cookies et stockage local',
        body: "Nous n'utilisons pas de pixels de suivi publicitaire ou d'analytique sur ce site. Nous stockons des préférences essentielles (comme le thème et la langue) dans le local storage de votre navigateur. Vous pouvez les effacer dans les paramètres du navigateur.",
      },
      {
        title: '8. Conservation',
        body: "Les données du registre public sont conservées pour préserver l'intégrité de l'enregistrement append-only. Les journaux opérationnels et les données de session de connexion ne sont conservés que le temps nécessaire pour faire fonctionner, sécuriser et déboguer le service, et pour respecter les obligations légales.",
      },
      {
        title: '9. Sécurité',
        body: "Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables adaptées à un service de vérification public. Aucune méthode de transmission ou de stockage n'est totalement sûre.",
      },
      {
        title: '10. Vos droits',
        body: "Selon votre localisation, vous pouvez avoir des droits d'accès, de rectification ou de suppression des données personnelles que nous détenons à votre sujet. Les noms de domaine et les entrées du registre public ne sont pas traités comme des données personnelles dans le modèle principal de cette politique ; contactez-nous si vous estimez que nous détenons des données personnelles vous concernant sous une autre forme. Nous ne vendons pas de données personnelles.",
      },
      {
        title: '11. Modifications',
        body: 'Nous pouvons mettre à jour cette Politique de confidentialité de temps à autre. La version révisée sera publiée sur cette page avec une date mise à jour.',
      },
      {
        title: '12. Contact',
        body: 'Questions de confidentialité : hello@pbm-labs.com.',
      },
    ],
  },
};
