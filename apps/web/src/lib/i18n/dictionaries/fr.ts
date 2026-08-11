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
  },
  home: {
    manifestoEyebrow: 'Le manifeste',
    manifestoParagraphs: [
      "En 1969, quatre ordinateurs se sont connectés pour la première fois. Personne dans cette pièce n'a pensé à l'identité. Ce n'était pas nécessaire. Tous ceux qui étaient en ligne se connaissaient déjà.",
      "Ainsi Internet est né sans moyen de savoir qui est vraiment qui. Pas un défaut. Juste une question que personne n'avait encore besoin de poser.",
      'Puis le monde est devenu plus petit, et s\'est rempli d\'inconnus.',
      "Un nom à l'écran pouvait être n'importe qui. Ou personne. Nous avons bâti une civilisation entière sur un réseau auquel on n'a jamais donné la seule chose dont toute communauté a besoin pour survivre : un moyen de savoir qui est réel.",
      "Et nous nous y sommes habitués. Une fondation à la taille d'Internet, absente à la vue de tous pendant un demi-siècle.",
      "Voici ce qui reste discrètement vrai : il n'est pas trop tard. Presque tout ce que vous êtes en ligne peut être falsifié en quelques minutes. L'histoire est la seule chose qui ne peut pas. Elle s'acquiert un jour honnête à la fois, et chaque jour d'attente est un jour que l'on ne récupère jamais.",
      "La fondation qu'Internet n'a jamais eue peut encore être coulée. Pas comme une réparation. Comme quelque chose enfin achevé, un demi-siècle trop tard.",
      'Nous n\'avons pas à vivre dans le vide.',
      'Nous construisons le réel. Dès maintenant.',
    ],
    readMore: 'Lire la suite',
    showLess: 'Réduire',
    ctaTitle: 'Commencez à couler la fondation.',
    ctaBody:
      "L'histoire s'acquiert un jour honnête à la fois,\net chaque jour d'attente est un jour que l'on ne récupère jamais.",
    ctaButton: 'Ajoutez votre domaine',
    ctaSub: 'Soyez parmi les premiers sur un terrain solide.',
    watchManifesto: 'Voir le manifeste',
  },
  howItWorks: {
    backHome: '← Accueil',
    eyebrow: 'Deux minutes, presque automatique',
    title: 'Ajoutez votre domaine',
    intro:
      "Pas de paperasse, pas d'attente. Juste le premier jour d'une histoire qui est vraiment la vôtre.",
    seeLiveDomain: 'Voir un domaine en direct →',
    chooseDifferent: '← Choisir une autre méthode',
    yourDomain: 'Votre domaine',
    pathCloudflareTitle: "J'utilise Cloudflare",
    pathCloudflareDesc: 'Un clic — nous nous occupons du reste.',
    pathCloudflareBadge: 'Le plus rapide',
    pathManualTitle: 'Ajouter manuellement',
    pathManualDesc:
      'Collez une ligne là où vous gérez le DNS — sans compte ni OAuth.',
    pathManualBadge: 'Sans connexion',
    pathToolTitle: "J'utilise déjà un outil",
    pathToolDesc: 'Postmark ou similaire — pointez-le ici.',
    pathToolBadge: 'Outil existant',
    whatDoesThisDo: 'Que fait cela ?',
    cloudflareExplain:
      "Vous vous connecterez à Cloudflare et nous ajouterons l'enregistrement de vérification pour vous.",
    cloudflareNoLoginHint: 'Vous préférez ne pas vous connecter ? Utilisez',
    toolIntro: "Dans les paramètres de votre outil, ajoutez ceci :",
    toolExplain:
      'Votre outil vérifie déjà ce domaine. Le pointer ici nous inclut dans cette vérification.',
    manualIntro:
      "Collez ceci là où vous gérez les paramètres de votre site (demandez à votre hébergeur si vous n'êtes pas sûr) :",
    manualExplain:
      "Une ligne qui permet à des systèmes indépendants de confirmer que votre domaine est réel. Si vous avez déjà une ligne similaire, ajoutez notre adresse au lieu de la remplacer.",
    errors: {
      invalid_domain: 'Saisissez un domaine valide (ex. example.com).',
      server_config:
        'Le serveur n\'a pas CONNECT_STATE_SECRET ou les identifiants Supabase.',
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
  domains: {
    backHome: 'Accueil',
    eyebrow: 'Registres publics',
    title: 'Domaines qui construisent la confiance',
    intro:
      "Classés par historique vérifié — depuis combien de temps chaque domaine a été confirmé de façon indépendante. Les scores de confiance apparaissent lorsque cet historique a du sens.",
    addDomain: 'Ajoutez votre domaine',
    building: 'En construction',
    proven: 'Éprouvé',
    rankedBy: 'Classés par historique vérifié',
    rankedHint:
      "Un historique confirmé indépendamment plus long se classe plus haut. Un score de confiance apparaît lorsque l'historique a du sens.",
    colDomain: 'Domaine',
    colHistory: 'Historique',
    colStatus: 'Statut',
    verified: 'vérifié',
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
    next1: 'Ce domaine est remarqué de façon indépendante, généralement sous un jour.',
    next2: 'Cela confirme discrètement que tout est en ordre.',
    next3: 'Cette page se met à jour toute seule — rien à cliquer.',
    historyHero: "d'historique vérifié",
    historyIntro:
      "Historique confirmé de façon indépendante, jour honnête après jour. Un score de confiance apparaît une fois qu'assez d'historique s'est accumulé.",
    scoreIntro:
      "Historique confirmé de façon indépendante, avec un score de confiance qui reflète depuis combien de temps et combien largement il a été vérifié.",
    timeVerified: 'Temps vérifié',
    reports: 'Rapports',
    allTime: 'depuis le début',
    passRate: 'Taux de réussite',
    techSummary: 'Vérification technique — rapports et preuve cryptographique',
    showMath: 'Voir le calcul',
    domainRegistered: 'Domaine enregistré',
    verifiedSince: 'Vérifié depuis',
    awaitingReport: 'En attente du premier rapport',
    noRecordYet: 'Pas encore de registre public.',
    noRecordHint:
      "Si vous avez déjà ajouté l'enregistrement de vérification, mettez cette page en favori. Elle se met à jour seule dès que le premier contrôle indépendant revient, généralement sous un jour.",
    connectDomain: 'Connecter',
    staging:
      'Aperçu anticipé — la vérification est active, l\'ancrage public permanent arrive bientôt.',
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
    dbNotConfigured: 'Base de données non configurée',
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
      'Preuves d\'inclusion recalculées à partir des données en direct contre la dernière racine de staging.',
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
    proofVerified: 'Vérifiée',
    proofUnverified: 'Non vérifiée',
    clockUnknown: '—',
    clockDay1: '(Jour 1)',
    clockYears: '({n} ans)',
    clockYear: '({n} an)',
    clockMonths: '({n} mo)',
    clockDaysShort: '({n}j)',
  },
  connectSuccess: {
    added: 'Ajouté',
    cloudflare: 'Cloudflare',
    body: 'Ajouté, rien d\'autre à faire. La construction de votre registre vient de commencer.',
    publicRecord: 'Votre registre public',
    shareEyebrow: 'Partagez votre preuve',
    shareLinkedIn: 'LinkedIn',
    shareX: 'X',
    shareText: '{domain} construit un registre public de confiance sur PACT',
    whatNext: 'Et ensuite',
    next1: 'Un contrôle indépendant arrive généralement sous un jour.',
    next2:
      "C'est ce qui confirme tout et ajoute ce domaine au registre public. Rien d'autre à cliquer.",
    next3: 'Ensuite, votre score de confiance se construit et se met à jour tout seul.',
    viewDomain: 'Voir',
    allRecords: 'Tous les registres',
    missing: 'Il manque quelque chose dans ce lien — réessayons.',
    tryAgain: 'Réessayer',
  },
  whitepaper: {
    eyebrow: 'PACT Protocol',
    title: 'Whitepaper',
    intro:
      "Le protocole ouvert derrière le registre public — comment l'historique vérifié est capturé, publié et mesuré.",
    source: 'Source sur GitHub →',
    footerLink: 'Voir la roadmap →',
  },
  whyPact: {
    eyebrow: 'PACT Protocol',
    title: 'What Makes PACT Different',
    intro: "Une note de deux minutes sur l'évidence face à l'autorité — pas le whitepaper complet.",
    scope:
      "PACT mesure l'historique de domaine vérifié de façon indépendante à partir des rapports agrégés DMARC. Ce n'est pas du KYC, pas une identité personnelle, et pas un substitut aux registres ou aux bureaux de crédit.",
    whitepaperLink: 'Lire le whitepaper →',
  },
  docs: {
    eyebrow: 'PACT Protocol',
    title: 'Docs',
    intro: 'Comment PACT fonctionne et pourquoi c’est différent.',
    whyTitle: 'What Makes PACT Different',
    whyBody: "Une note de deux minutes sur l'évidence face à l'autorité — à lire en premier.",
    whitepaperTitle: 'Whitepaper',
    whitepaperBody:
      "Le protocole ouvert derrière le registre public — comment l'historique vérifié est capturé, publié et mesuré.",
    roadmapTitle: 'Roadmap',
    roadmapBody: "Ce qui est en ligne aujourd'hui, et ce qui vient ensuite.",
    footerLink: 'Lire le whitepaper →',
  },
  roadmap: {
    eyebrow: 'PACT Protocol',
    title: 'Roadmap',
    intro:
      'La phase 0a est en ligne : un registre public recomputable avec des racines Merkle en staging. L’ancrage on-chain vient ensuite.',
    nowTitle: "En ligne aujourd'hui",
    nowItems: [
      'Connexion de domaine via OAuth Cloudflare, DNS manuel ou outils de reporting existants',
      'Création automatique du registre public dès le premier rapport agrégé valide',
      'Ingestion continue de vrais rapports agrégés DMARC',
      'Arbre de Merkle append-only avec preuves d’inclusion recomputables publiquement',
      'Publication régulière de racines de staging sur un registre public',
      'Registres publics classés par historique vérifié ; score mis à l’échelle quand il est significatif',
      'Pages par domaine avec horloges, activité et vérification technique',
    ],
    nextTitle: 'En développement actif',
    nextItems: [
      'Ancrage on-chain des racines Merkle',
      'La vélocité comme signal compagnon de la maturité',
      'Surveillance des discontinuités d’infrastructure (Signal)',
      'Opération multi-nœuds / permissionless plus large',
    ],
    nextNote:
      'Aucun de ces points n’est requis pour que la vérification publique d’aujourd’hui fonctionne. Ils étendent ce qui est déjà en ligne.',
    whitepaperLink: 'Lire le whitepaper →',
  },
  legal: {
    eyebrow: 'Mentions légales',
    lastUpdated: 'Dernière mise à jour le 8 août 2026',
    termsTitle: "Conditions d'utilisation",
    privacyTitle: 'Politique de confidentialité',
    emailLabel: 'E-mail',
    terms: [
      {
        title: '1. Acceptation des conditions',
        body: "En accédant à ce site (pact.pbm-labs.com) et aux services associés exploités sous la marque « we build real », ou en les utilisant, vous acceptez les présentes Conditions d'utilisation. Si vous n'êtes pas d'accord, n'utilisez pas le site et ne connectez pas de domaine.",
      },
      {
        title: '2. Qui nous sommes',
        body: "Ce site est exploité par PBM Labs LLC (« PBM Labs », « nous »), une limited liability company du Wyoming. Il donne un accès public à l'implémentation de référence du protocole PACT : connexion de domaines, registre public d'historique de domaines vérifié de façon indépendante, et documentation associée.",
      },
      {
        title: '3. Le service',
        body: "PACT capture les rapports d'authentification agrégés DMARC que les systèmes de messagerie destinataires génèrent déjà, inscrit les métadonnées extraites dans un arbre de Merkle append-only, et publie un registre public ainsi qu'un signal de confiance organique pour les domaines connectés. Connecter un domaine nécessite d'ajouter PACT comme destination de rapports dans le DNS (directement ou via un fournisseur pris en charge). Nous ne lisons ni le contenu des messages, ni les identités des destinataires, ni les données de boîte aux lettres.",
      },
      {
        title: '4. Registres publics',
        body: "Les informations publiées dans le registre public — notamment les noms de domaine, résumés d'historique vérifié, signaux de confiance et preuves cryptographiques — sont destinées à être consultables publiquement. Ne connectez pas un domaine si vous n'êtes pas autorisé à faire figurer les métadonnées d'authentification de ce domaine dans un registre public.",
      },
      {
        title: '5. Vos responsabilités',
        body: "Vous ne devez connecter que des domaines que vous contrôlez ou que vous êtes autorisé à gérer. Vous êtes responsable de l'exactitude des modifications DNS que vous effectuez, du respect de vos propres politiques et du droit applicable, et de ne pas utiliser le service pour harceler, frauder ou induire en erreur. Vous ne devez pas tenter d'accès non autorisé, interférer avec le service, scraper de manière à le dégrader, introduire de logiciels malveillants, ni autrement en abuser.",
      },
      {
        title: '6. Pas de conseil ; aucune garantie de légitimité',
        body: "Les scores de confiance, résumés d'historique et preuves sont des mesures informatives dérivées des rapports disponibles. Ils ne constituent pas un conseil juridique, financier, de conformité ou commercial, et ne garantissent pas qu'un domaine, une organisation ou une personne soit légitime, sûr pour une transaction, ou sans risque. Vous restez seul responsable de vos décisions.",
      },
      {
        title: '7. Pas de services financiers',
        body: "Nous ne sommes ni une banque, ni un courtier, ni une entreprise de services monétaires, ni une institution financière. Nous ne traitons, ne détenons, ne conservons ni ne transférons de devises, titres ou actifs financiers.",
      },
      {
        title: '8. Propriété intellectuelle',
        body: "Le contenu du site, la marque et le design appartiennent à PBM Labs LLC ou à ses concédants, sauf indication contraire. La spécification du protocole PACT et le whitepaper sont publiés ouvertement pour examen et mise en œuvre ; les implémentations tierces sont encouragées sous réserve de leurs propres licences le cas échéant. Aucun droit n'est concédé sauf le droit limité d'utiliser ce site conformément à sa destination.",
      },
      {
        title: '9. Services tiers',
        body: "Le site peut s'appuyer sur des tiers ou renvoyer vers eux (par exemple des fournisseurs DNS comme Cloudflare, l'hébergement et l'infrastructure edge, et des bases de données). Nous ne contrôlons pas les services tiers et ne sommes pas responsables de leur contenu, disponibilité ou politiques. Votre utilisation de ces services est soumise à leurs conditions.",
      },
      {
        title: '10. Exclusion de garanties',
        body: "Le site et le service sont fournis « en l'état » et « selon disponibilité », sans garantie d'aucune sorte, expresse ou implicite, y compris de qualité marchande, d'adéquation à un usage particulier et d'absence de contrefaçon. Nous ne garantissons pas que le service sera ininterrompu, sans erreur, complet ou sûr, ni que les racines, preuves ou scores publiés répondront à vos besoins.",
      },
      {
        title: '11. Limitation de responsabilité',
        body: "Dans la mesure maximale permise par la loi, PBM Labs LLC et ses membres, dirigeants et prestataires ne sont pas responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs découlant de votre utilisation du site ou du service, y compris de la confiance accordée aux registres publics ou aux signaux de confiance, même s'ils ont été informés de la possibilité de tels dommages.",
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
        body: "Cette Politique de confidentialité explique comment PBM Labs LLC traite les informations lorsque vous utilisez pact.pbm-labs.com et les services de référence PACT. PACT est conçu pour que sa source de données principale — les rapports agrégés DMARC — ne contienne ni contenu de message ni identités personnelles.",
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
        body: "Nous utilisons les informations ci-dessus pour assurer la connexion des domaines, ingérer et publier l'historique vérifié, calculer et afficher les signaux de confiance, maintenir les preuves cryptographiques, prévenir les abus et améliorer la fiabilité du service. Les champs du registre public sont publiés pour que quiconque puisse vérifier l'historique de façon indépendante.",
      },
      {
        title: '5. Registres publics',
        body: "Les domaines connectés et leurs résumés d'historique vérifié, scores (lorsqu'affichés) et preuves sont destinés à être publics. Ne connectez pas un domaine sans comprendre que les métadonnées d'authentification associées apparaîtront dans un registre public.",
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
