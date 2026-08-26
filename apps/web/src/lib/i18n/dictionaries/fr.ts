import type { Dictionary } from '../types';

export const fr: Dictionary = {
  nav: {
    language: 'Langue',
    records: 'Registres',
    connect: 'Connecter',
    whitepaper: 'Livre blanc',
    menu: 'Menu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  footer: {
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
  },
  home: {
    heroTitle: 'L’IA peut tout falsifier.',
    heroAccent: 'Sauf hier.',
    heroSub:
      'Des traces résiduelles de systèmes indépendants, enregistrées comme des flux distincts sur un arbre en ajout seulement.',
    heroLead:
      'Connectez un nom. Les journaux publics sont indexés. Le flux de courrier a besoin du DNS pour conserver les rapports. N’importe qui peut revérifier le ledger. Le registre ne note pas le nom et ne décide pas qu’il est légitime.',
    howEyebrow: 'Flux',
    howTitle: 'Sources agnostiques. Un arbre.',
    howLead:
      'Ce n’est pas un produit de courrier. Des systèmes indépendants émettent déjà des traces résiduelles. Chaque source est son propre flux. Ils partagent un arbre pour que qui vérifie ait une racine. Ils ne sont jamais fusionnés en un score.',
    howSteps: [
      {
        title: 'Flux séparés',
        body: 'Les rapports de courrier, les journaux de certificats et les journaux de signatures sont des types résiduels d’origine distincte. D’autres sources peuvent s’ajouter comme types étiquetés. Chaque type garde son propre préimage. La page les montre côte à côte. Elle ne les additionne pas.',
      },
      {
        title: 'N’importe qui peut vérifier',
        body: 'Chaque trace est une feuille. Les racines sont publiées on-chain, hors de cet opérateur, pour qu’un autre passé ne puisse pas être substitué en silence. Qui vérifie recalcule l’inclusion contre cette racine sans demander la permission.',
      },
      {
        title: 'Pas un verdict',
        body: 'La page, ce sont des horloges et des flux. Elle publie ce qui s’est passé. Le jugement reste dehors.',
      },
    ],
    recordEyebrow: 'Un registre',
    recordTitle: 'Ce que la page montre.',
    recordSub:
      'Chaque nom a des horloges d’enregistrement et de confirmation, des flux résiduels et un ledger partagé. Ouvrez un registre en direct :',
    privacyTitle: 'Confidentialité',
    privacyBody1:
      'Connecter place le nom sur le ledger. Le flux de courrier a besoin du DNS pour conserver les rapports agrégés au lieu de les jeter. Les flux de certificats et de signatures sont déjà publics ; ce site les indexe. Aucun flux ne contient de messages, d’objets ou de boîtes.',
    privacyBody2: 'La page publique est l’historique du domaine à partir de ces flux. Rien d’autre n’est collecté.',
    privacyTableTitle: 'Ce qu’il y a dans le registre',
    privacyRows: [
      'Domaine',
      'Flux de courrier',
      'Flux de certificats',
      'Flux de signatures',
      'Arbre partagé',
    ],
    ctaTitle: 'Commencez un registre.',
    ctaButton: 'Connecter',
    ctaSub:
      'Les flux publics commencent une fois le nom sur le ledger. L’historique de courrier commence à l’arrivée du premier rapport indépendant — pas quand la ligne DNS est enregistrée.',
  },
  connect: {
    backHome: '← Accueil',
    eyebrow: 'Connecter',
    title: 'Connecter un domaine',
    intro:
      'Connecter place le nom sur le ledger. Les flux de certificats et de signatures sont indexés depuis des journaux publics. Le flux de courrier a besoin d’une ligne DNS pour que les déclarants indépendants continuent d’envoyer.',
    yourDomain: 'Votre domaine',
    pathCloudflareTitle: "J'utilise Cloudflare",
    pathCloudflareDesc: 'Un clic — nous ajoutons la ligne DNS.',
    pathCloudflareBadge: 'Le plus rapide',
    pathManualTitle: 'Ajouter manuellement',
    pathManualDesc:
      'Une ligne à coller là où vous gérez le DNS — GoDaddy, Namecheap ou tout autre hébergeur.',
    pathManualBadge: 'Universel',
    pathToolTitle: "J'utilise déjà un outil",
    pathToolDesc: 'Postmark ou similaire — ajoutez cette adresse comme destination de rapports.',
    pathToolBadge: 'Outil existant',
    streamCards: [
      {
        title: 'Courrier',
        body: 'Les systèmes destinataires indépendants émettent déjà des rapports agrégés. Une ligne DNS en conserve une copie ici.',
      },
      {
        title: 'Certificats',
        body: 'Les journaux publics de certificats sont déjà un journal d’émission. Indexés une fois le nom sur le ledger.',
      },
      {
        title: 'Signatures',
        body: 'Rekor enregistre déjà les métadonnées de logiciels signés. Indexé de la même façon. La couverture est souvent vide.',
      },
    ],
    mailStreamHow: 'Conserver le flux de courrier',
    putOnLedger: 'Mettre sur le ledger',
    ledgerExplain:
      'Place le nom sur le ledger pour indexer les flux de certificats et de signatures. Conservez ensuite le flux de courrier avec le DNS ci-dessous.',
    backToPaths: 'Choisir une méthode',
    whatDoesThisDo: 'Que fait cela ?',
    cloudflareExplain:
      'Vous vous connecterez à Cloudflare et nous ajouterons PACT comme destination de rapports dans le DNS pour conserver le flux de courrier. Les flux de certificats et de signatures sont indexés une fois le nom sur le ledger.',
    toolIntro: "Dans les paramètres de votre outil, ajoutez ceci :",
    toolExplain:
      'Votre outil collecte déjà des rapports pour ce domaine. Ajouter cette adresse nous inclut dans le flux de courrier. Mettez d’abord le nom sur le ledger pour indexer les flux publics. Le registre public de courrier apparaît à l’arrivée du premier rapport indépendant (souvent sous 24–48 h).',
    manualIntro:
      "Collez ceci là où vous gérez le DNS de votre site (demandez à votre hébergeur si vous n'êtes pas sûr) :",
    manualExplain:
      "Une ligne qui permet à des systèmes destinataires indépendants d’envoyer des rapports agrégés ici. Si vous avez déjà une ligne similaire, ajoutez notre adresse au lieu de la remplacer. C’est le flux de courrier. Mettez d’abord le nom sur le ledger pour indexer les flux publics. Le registre public de courrier apparaît à l’arrivée du premier rapport indépendant (souvent sous 24–48 h).",
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
    title: 'Registres',
    addDomain: 'Connecter',
    rankedBy: 'Par historique résiduel',
    lead:
      'Pages publiques des noms sur le ledger. Flux résiduels comme types distincts — jamais un score.',
    colDomain: 'Domaine',
    colHistory: 'Historique',
    verified: 'au registre',
    emptyTitle: 'Aucun registre',
    emptyBody:
      'Connectez un domaine pour commencer à enregistrer des flux résiduels. Les journaux de certificats et de signatures sont indexés une fois le nom sur le ledger. Le flux de courrier a besoin d’une ligne DNS.',
    emptyCta: 'Connecter',
    searchPlaceholder: 'Rechercher un domaine…',
    noMatch: 'Aucune correspondance pour « {query} ».',
  },
  domain: {
    backRecords: 'Registres',
    awaitingFirst: 'Sur le ledger, pas encore de traces',
    connected: 'Connecté',
    kindMail: 'Courrier',
    kindMailEmpty: 'Aucun',
    kindCt: 'Certificats',
    kindNone: 'Aucun',
    kindRekor: 'Signatures',
    streamsLabel: 'Flux',
    kindFirst: 'Premier journalisé',
    kindLatest: 'Plus récent',
    mailAuthRate: 'Auth courrier (DKIM réussi)',
    certs: 'Certs',
    sigs: 'Entrées',
    ledgerTitle: 'Ledger',
    mailLeaves: 'Flux de courrier',
    ctLeaves: 'Flux de certificats',
    rekorLeaves: 'Flux de signatures',
    reports: 'Rapports',
    reportingOrgs: 'Orgs déclarantes',
    domainRegistered: 'Domaine enregistré',
    verifiedSince: 'Historique depuis',
    awaitingReport: 'En attente de la première trace',
    noRecordYet: 'Aucun registre.',
    connectDomain: 'Connecter',
    firstDay: 'Premier jour',
    dayOne: '1 jour',
    days: '{n} jours',
    dbNotConfigured: 'Registre non configuré',
    reportHistory: 'Flux de courrier',
    reportHistoryCounts: '{periods} · {reporters} orgs',
    colReporter: 'Déclarant',
    colPeriod: 'Période',
    colPass: 'Réussi',
    colFail: 'Échoué',
    colIngested: 'Ingéré',
    verification: 'Vérification',
    anchor: 'Ancre',
    onChain: 'On-chain',
    stagingOffChain: 'Staging (hors chaîne)',
    rootsMatch: 'Racines concordantes',
    yes: 'Oui',
    no: 'Non',
    domainLeaves: 'Feuilles de flux',
    globalTree: 'Arbre global',
    publishedRoot: 'Racine publiée',
    explorerTx: 'Voir la transaction',
    explorerContract: 'Voir le contrat',
    leafLedger: 'Voir la feuille',
    openingCheck: 'Vérifier les octets stockés contre le hash de la feuille et la clé DNS',
    leafHash: 'Hash de la feuille',
    colWrapper: 'DKIM du wrapper',
    colOpening: 'Ouverture',
    proofVerified: 'Vérifiée',
    proofUnverified: 'Non vérifiée',
    openingNone: '—',
    openingMissing: 'Non stocké',
    openingOk: 'Hash et clé',
    openingHashMismatch: 'Hash incorrect',
    openingNoKey: 'Clé absente',
    openingFail: 'Échec',
    openingOkTitle:
      'Les octets stockés hasheent vers la feuille ; le TXT DKIM du DNS à l’ingest est enregistré.',
    openingHashMismatchTitle: 'Les octets stockés ne correspondent pas au hash du wrapper sur la feuille.',
    openingNoKeyTitle: 'Aucun instantané TXT DKIM enregistré pour le sélecteur de la feuille.',
    openingFailTitle: 'Les octets ne correspondent pas au hash, et aucune clé DKIM n’est enregistrée.',
    openingMissingTitle: 'Pas de copie stockée du wrapper pour ce hash.',
    clockUnknown: '—',
    clockDay1: '(Jour 1)',
    clockYears: '({n} ans)',
    clockYear: '({n} an)',
    clockMonths: '({n} mois)',
    clockDaysShort: '({n}j)',
    ctHistory: 'Flux de certificats',
    ctHistoryCounts: '{n}',
    colIssuer: 'Émetteur',
    colNotBefore: 'Valide dès',
    colLoggedAt: 'Journalisé',
    colFingerprint: 'Empreinte',
    rekorHistory: 'Flux de signatures',
    rekorHistoryCounts: '{n}',
    colIdentity: 'Identité',
    colEntryKind: 'Type',
  },
  whitepaper: {
    eyebrow: 'PACT',
    title: 'Livre blanc',
    subtitle: 'Provenance de traces accumulées et vérifiables',
    updated: 'Août 2026',
  },
  legal: {
    eyebrow: 'Mentions légales',
    lastUpdated: 'Dernière mise à jour le 25 août 2026',
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
        body: "Ce site est le foyer public de we build real, un mouvement pour une histoire vérifiable. PACT est un protocole ouvert. PBM Labs LLC (« nous »), une limited liability company du Wyoming, fournit la première implémentation de référence de PACT. Il donne un accès public à cette implémentation : connexion de domaines, flux résiduels comme types distincts sur un arbre, et documentation associée.",
      },
      {
        title: '3. Le service',
        body: "PACT capture des traces résiduelles déjà émises par des systèmes indépendants et les inscrit dans un arbre de Merkle append-only. Chaque source résiduelle est un flux (type) distinct sur cet arbre. L'historique de courrier vient des rapports d'authentification agrégés DMARC que les systèmes destinataires génèrent déjà. L'historique des certificats vient des journaux publics Certificate Transparency — échappement résiduel indexé, pas une nouvelle cérémonie d'émission et pas un badge HTTPS. L'historique des signatures vient du journal public Rekor — échappement résiduel indexé, pas une cérémonie de signature. Les flux ne sont pas fusionnés en un score. Connecter un domaine place le nom sur le ledger et nécessite d'ajouter PACT comme destination de rapports dans le DNS (directement ou via un fournisseur pris en charge) pour conserver le flux de courrier. L'indexation CT et Rekor n'exige aucun rituel supplémentaire. Nous ne lisons ni le contenu des messages, ni les identités des destinataires, ni les données de boîte aux lettres.",
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
        body: "Les résumés d'historique et les preuves cryptographiques sont un enregistrement informatif de traces résiduelles de systèmes indépendants — rapports de courrier, journaux publics de certificats et journaux publics de signatures — comme types distincts. Ils ne constituent pas un conseil juridique, financier, de conformité ou commercial, et ne garantissent pas qu'un domaine, une organisation ou une personne soit légitime, sûr pour une transaction, ou sans risque. Le jugement reste hors du registre. Vous restez seul responsable de vos décisions.",
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
        body: "Cette Politique de confidentialité explique comment PBM Labs LLC traite les informations lorsque vous utilisez webuildreal.dev — le foyer public du mouvement we build real et de la première implémentation de référence du protocole ouvert PACT. PACT enregistre des traces résiduelles : rapports agrégés DMARC, métadonnées des journaux publics Certificate Transparency et métadonnées du journal public Rekor. Les rapports agrégés de courrier ne contiennent ni contenu de message ni identités personnelles. Les données CT et Rekor sont déjà de l'échappement de journaux publics, y compris les identités Rekor déjà publiées dans ce journal.",
      },
      {
        title: '2. Informations que nous traitons',
        body: "Données de domaine et de protocole : noms de domaine que vous connectez ; métadonnées des rapports agrégés DMARC (organisation déclarante, période, comptes de réussite/échec d'authentification, sélecteurs et identifiants d'infrastructure sous forme hachée ou résumée) ; métadonnées de première vue Certificate Transparency issues de journaux publics (émetteur, not-before, heure du journal, empreinte) ; sujets résiduels Rekor tels que déjà consignés (URI GitHub, e-mail ou hôte ; heure intégrée ; id d'entrée) ; feuilles Merkle, racines et données de vérification publiques. Données du parcours de connexion : chaînes de domaine que vous soumettez ; si vous utilisez OAuth Cloudflare, jetons et informations de zone nécessaires pour mettre à jour le DNS en votre nom pendant cette session. Préférences du navigateur : thème et langue stockés dans le local storage de votre appareil. Nous n'exploitons pas de comptes utilisateurs grand public ni de profils marketing sur ce site.",
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
