import type { Dictionary } from '../types';

export const fr: Dictionary = {
  nav: {
    language: 'Langue',
    intake: 'Intake courrier',
    whitepaper: 'Livre blanc',
    menu: 'Menu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  footer: {
    terms: 'Conditions',
    privacy: 'Confidentialité',
    ledger: 'Ledger',
    contact: 'Contact',
  },
  common: {
    home: 'Accueil',
    continue: 'Continuer',
    copy: 'Copier',
    copied: 'Copié',
    loading: 'Chargement…',
    toggleTheme: 'Changer le thème',
  },
  home: {
    heroTitle: 'L’IA peut tout falsifier.',
    heroAccent: 'Sauf hier.',
    heroSub: 'we build real est le mouvement. PACT est du leftover pour agents.',
    heroLead:
      'L’unité de preuve est type plus identité — pas une page de domaine. Pas de classement, pas trois cartes de flux, pas de verdict. Le jugement reste dehors.',
    primaryCta: 'GET /v1/kinds',
    secondaryCta: 'GET /v1/evidence',
    brokeEyebrow: 'Identité',
    brokeTitle: 'Chaque type a une clé d’identité différente.',
    brokeLead:
      'Un agent ne peut pas vérifier le leftover courrier d’une contrepartie et le leftover de signature en forme GitHub en un seul appel de domaine. Le domaine est une identité que le courrier et CT utilisent souvent — pas le type du monde entier.',
    identities: [
      {
        kind: 'Courrier',
        tag: 'v0.2 non étiqueté',
        identity: 'Domaine d’envoi (header_from)',
      },
      {
        kind: 'Certificats',
        tag: 'pact-ct-v1',
        identity: 'Nom d’hôte dans SAN/CN (comme leftover CT)',
      },
      {
        kind: 'Signatures',
        tag: 'pact-rekor-v1',
        identity: 'Sujet leftover Rekor — souvent une URI GitHub ou un e-mail, rarement le nom d’hôte d’un site',
      },
    ],
    splitEyebrow: 'Partage',
    splitTitle: 'PACT ne décide pas.',
    splitLead:
      'L’agent extrait les identités réellement utilisées par la tâche, interroge par type, et remet des faits vérifiables à la politique. La politique dit oui, non, ou attendre.',
    splitCards: [
      {
        title: 'Quelqu’un d’autre',
        body: 'Politiques. Gouvernance. « Est-ce autorisé ? » La résolution d’entités (From vs DKIM d= vs URI GitHub vs SAN) vit ici.',
      },
      {
        title: 'PACT',
        body: 'Traces résiduelles et preuves. Requête par type. Inclusion contre une racine nommée. Il répète l’identité réellement consultée.',
      },
      {
        title: 'Quelqu’un d’autre',
        body: 'Exécution. PACT NE DOIT PAS traiter github.com/acme/pay comme acme.com. Cette carte est de l’interprétation.',
      },
    ],
    queryEyebrow: 'Requête',
    queryTitle: 'Type plus identité.',
    queryLead:
      'L’agent ne commence pas par « ouvrir ce domaine ». Il interroge les identités résiduelles du moment, par type. Le catalogue est lisible par machine pour que les anciens agents ignorent les types qu’ils ne comprennent pas.',
    endpointKinds: 'Catalogue',
    endpointEvidence: 'Requête',
    endpointLeaf: 'Preuve',
    echoTitle: 'Répéter l’identité réellement utilisée',
    echoBody:
      'Une réponse valide sur la mauvaise clé est pire qu’un manque. L’inclusion prouve que la feuille est dans l’arbre, pas que l’appelant visait cette contrepartie. PACT ne corrige pas les bugs d’extraction. Il les rend auditables.',
    emptyTitle: 'Zéro ligne est une réponse',
    emptyBody:
      'HTTP 200 avec une liste vide signifie que ce journal n’a pas de leftover sous cette identité. Ce n’est pas une étape de configuration manquante.',
    proofTitle: 'Racine partagée nommée',
    proofBody:
      'Les lignes incluent included — appartenance à l’arbre partagé vivant. La preuve d’inclusion est sur GET /v1/leaves/:hash. Les listes NE DOIVENT PAS déverser des tableaux de preuves. Les preuves v1 nomment type: shared pour qu’une forêt ultérieure ne casse pas les appelants.',
    kindsTitle: 'Petit catalogue leftover-only',
    kindsLead:
      'Chaque type a un encodage figé, une forme de clé et une étiquette de stake. Ajouter un type est une décision produit, pas une nouvelle colonne sur une page de domaine.',
    kinds: [
      {
        title: 'Courrier',
        key: 'dns_name',
        stake: 'accumulated',
        body: 'v0.2 non étiqueté. Domaine d’envoi (header_from). Les destinataires indépendants continuent d’émettre des rapports.',
      },
      {
        title: 'Certificats',
        key: 'dns_name',
        stake: 'calendar',
        body: 'pact-ct-v1. Nom d’hôte dans SAN/CN. Un nouveau certificat est bon marché. Le poids est une série, pas un fait.',
      },
      {
        title: 'Signatures',
        key: 'leftover_subject',
        stake: 'calendar',
        body: 'pact-rekor-v1. URI GitHub, e-mail ou hôte — pas un site connecté. Un leftover d’hôte vide est attendu.',
      },
    ],
    stakeTitle: 'Le stake est une propriété du type',
    stakeAccumulated:
      'Le leftover ne croît que si des tiers indépendants continuent d’agir pour leurs propres raisons. Un mint ne crée pas l’histoire.',
    stakeCalendar:
      'Une seule entrée est bon marché. Tout poids est dans une série soutenue. Un nouveau certificat ou une nouvelle signature peut apparaître en minutes.',
    treeTitle: 'Un arbre, avec une couture',
    treeBody:
      'En direct : un arbre de Merkle creux, un espace leaf_index, un publishRoot. Chaque type déclare kind_root: { type: "shared" }. Une meta-root kind_id → kind_root est réservée. La forêt est v2 sans casser les appelants v1.',
    willNotTitle: 'Ce que PACT ne fera pas',
    willNot: [
      'Score, étiquette d’activation ou verdict.',
      'Mélanger les types.',
      'Deviner des boîtes pour chercher dans Rekor.',
      'Traiter github.com/… comme couvrant le domaine d’un client.',
      'Mapper les identités entre types.',
      'Inventer un rituel pour qu’un type se remplisse — y compris « signer sur Rekor ».',
    ],
    pressuresTitle: 'Pressions closes',
    pressures: [
      'Extraction d’identité — charge sur l’appelant ; PACT répète l’identité réellement utilisée.',
      'Catalogue de types — petit, encodages figés, découverte à l’exécution, stake étiqueté type par type.',
      'Forêt contre un arbre — la meta-root plus la racine de preuve nommée est la couture v1 ; la forêt est v2 sans casser les appelants.',
    ],
    intakeTitle: 'Le leftover courrier a encore besoin du DNS.',
    intakeBody:
      'C’est l’intake d’un type, pas un produit « connecte ton domaine ». Le leftover certificats et signatures s’interroge par l’identité que ces journaux ont déjà utilisée.',
    intakeCta: 'Intake courrier',
  },
  connect: {
    backHome: '← Accueil',
    eyebrow: 'Intake courrier',
    title: 'Garder le leftover courrier',
    intro:
      'Ce n’est pas un profil public. Mettre un domaine d’envoi sur le ledger et ajouter une destination de rapports conserve les rapports agrégés DMARC indépendants. Le leftover certificats et Rekor s’interroge par leurs propres identités — pas par ce formulaire.',
    note: 'PACT n’affichera ni classement ni trois cartes de flux pour ce nom. Les agents interrogent le ledger par type.',
    yourDomain: 'Domaine d’envoi',
    pathCloudflareTitle: 'J’utilise Cloudflare',
    pathCloudflareDesc: 'Un clic — nous ajoutons la ligne DNS.',
    pathCloudflareBadge: 'Le plus rapide',
    pathManualTitle: 'L’ajouter à la main',
    pathManualDesc:
      'Une ligne à coller là où vous gérez le DNS — GoDaddy, Namecheap ou un autre hébergeur.',
    pathManualBadge: 'Universel',
    pathToolTitle: 'J’utilise déjà un outil',
    pathToolDesc: 'Postmark ou similaire — ajoutez cette adresse comme destination de rapports.',
    pathToolBadge: 'Outil existant',
    mailStreamHow: 'Comment conserver les rapports',
    putOnLedger: 'Mettre sur le ledger',
    ledgerExplain:
      'Enregistre le domaine d’envoi pour ne pas jeter les rapports de courrier. Cela n’attache pas de leftover GitHub ni un journal de signatures à ce site.',
    backToPaths: 'Choisir une méthode',
    whatDoesThisDo: 'Que fait ceci ?',
    cloudflareExplain:
      'Vous vous connecterez à Cloudflare et nous ajouterons PACT comme destination de rapports dans le DNS pour conserver le leftover courrier. Il n’y a pas de profil de domaine ensuite.',
    toolIntro: 'Dans les réglages de votre outil, ajoutez ceci :',
    toolExplain:
      'Votre outil collecte déjà des rapports pour ce domaine. Ajouter cette adresse nous inclut dans le leftover courrier. Mettez d’abord le domaine d’envoi sur le ledger. L’historique commence à l’arrivée du premier rapport indépendant (souvent 24–48 h).',
    manualIntro:
      'Collez ceci là où vous gérez le DNS de votre site (demandez à l’hébergeur si vous n’êtes pas sûr) :',
    manualExplain:
      'Une ligne pour que les systèmes destinataires indépendants envoient des rapports agrégés ici. Si vous avez déjà une ligne similaire, ajoutez notre adresse au lieu de la remplacer. Mettez d’abord le domaine d’envoi sur le ledger. L’historique commence à l’arrivée du premier rapport indépendant (souvent 24–48 h).',
    doneTitle: 'L’intake courrier est actif.',
    doneBody:
      'Le domaine d’envoi est sur le ledger. Gardez la ligne DNS. Le leftover courrier apparaît à l’arrivée du premier rapport indépendant — pas à l’envoi de ce formulaire. Interrogez-le en kind=mail.',
    doneNext: 'Interroger le ledger',
    errors: {
      invalid_domain: 'Entrez un domaine valide (p. ex. example.com).',
      server_config: 'Il manque CONNECT_STATE_SECRET ou les identifiants d’écriture du ledger.',
      oauth_not_configured: 'La connexion Cloudflare n’est pas configurée sur ce serveur.',
      missing_code: 'La connexion a été annulée ou incomplète.',
      invalid_state: 'Session expirée — réessayez.',
      token_exchange: 'Impossible de terminer la connexion à Cloudflare.',
      zone_not_found:
        'Ce domaine n’était pas dans le compte Cloudflare choisi. Essayez un autre compte.',
      dmarc_update:
        'La configuration automatique a échoué. Essayez l’option manuelle.',
      register: 'Presque — la dernière étape a échoué. Réessayez.',
      somethingWrong: 'Quelque chose s’est mal passé.',
    },
  },
  whitepaper: {
    eyebrow: 'PACT',
    title: 'Livre blanc',
    subtitle: 'Provenance de traces accumulées et vérifiables',
    updated: 'Août 2026',
  },
  legal: {
    eyebrow: 'Mentions légales',
    lastUpdated: 'Dernière mise à jour le 26 août 2026',
    termsTitle: "Conditions d'utilisation",
    privacyTitle: 'Politique de confidentialité',
    emailLabel: 'E-mail',
    terms: [
      {
        title: '1. Acceptation des conditions',
        body: "En accédant à ce site (webuildreal.dev) et aux services associés du mouvement we build real, ou en les utilisant, vous acceptez les présentes Conditions d'utilisation. Si vous n'êtes pas d'accord, n'utilisez pas le site et ne soumettez pas de domaine d’envoi pour l’intake courrier.",
      },
      {
        title: '2. Qui nous sommes',
        body: "Ce site est le foyer public de we build real, un mouvement pour une histoire vérifiable. PACT est un protocole ouvert. PBM Labs LLC (« nous »), une limited liability company du Wyoming, fournit la première implémentation de référence de PACT. Le site documente cette implémentation et propose l’intake du leftover courrier. Le leftover vérifiable est sur l’API publique du ledger, pas un profil humain de domaine.",
      },
      {
        title: '3. Le service',
        body: "PACT capture des traces résiduelles déjà émises par des systèmes indépendants et les inscrit dans un arbre de Merkle append-only. Chaque source résiduelle est un type distinct sur cet arbre. Le leftover courrier vient des rapports agrégés DMARC. Le leftover certificats vient des journaux publics Certificate Transparency. Le leftover signatures vient du journal public Rekor, indexé par sujet résiduel (URI GitHub, e-mail ou hôte) — pas un site connecté. Les types ne sont pas fusionnés en un score. L’intake courrier place un domaine d’envoi sur le ledger et nécessite d’ajouter PACT comme destination de rapports dans le DNS. Nous ne lisons ni le contenu des messages, ni les identités des destinataires, ni les données de boîte aux lettres.",
      },
      {
        title: '4. Ledger public',
        body: "Les informations publiées sur le ledger — notamment les identités résiduelles, l'historique confirmé de façon indépendante et les preuves cryptographiques — sont destinées à être consultables publiquement par des agents. Ne soumettez pas un domaine d’envoi si vous n'êtes pas autorisé à faire figurer les métadonnées d'authentification de ce domaine dans un registre public.",
      },
      {
        title: '5. Vos responsabilités',
        body: "Vous ne devez soumettre que des domaines d’envoi que vous contrôlez ou que vous êtes autorisé à gérer. Vous êtes responsable de l'exactitude des modifications DNS que vous effectuez, du respect de vos propres politiques et du droit applicable, et de ne pas utiliser le service pour harceler, frauder ou induire en erreur. Vous ne devez pas tenter d'accès non autorisé, interférer avec le service, scraper de manière à le dégrader, introduire de logiciels malveillants, ni autrement en abuser.",
      },
      {
        title: '6. Pas de conseil ; aucune garantie de légitimité',
        body: "L’historique et les preuves cryptographiques sont un enregistrement informatif de traces résiduelles de systèmes indépendants — rapports de courrier, journaux publics de certificats et journaux publics de signatures — comme types distincts. Ils ne constituent pas un conseil juridique, financier, de conformité ou commercial, et ne garantissent pas qu'un nom, une organisation ou une personne soit légitime, sûr pour une transaction, ou sans risque. Le jugement reste hors du registre. Vous restez seul responsable de vos décisions.",
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
        body: "Dans la mesure maximale permise par la loi, PBM Labs LLC et ses membres, dirigeants et prestataires ne sont pas responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs découlant de votre utilisation du site ou du service, y compris de la confiance accordée au ledger public, même s'ils ont été informés de la possibilité de tels dommages.",
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
        body: "Données de domaine et de protocole : domaines d’envoi soumis pour l’intake courrier ; métadonnées des rapports agrégés DMARC ; métadonnées de première vue Certificate Transparency issues de journaux publics ; sujets résiduels Rekor tels que déjà consignés (URI GitHub, e-mail ou hôte) ; feuilles Merkle, racines et données de vérification publiques. Données du parcours d’intake : chaînes de domaine que vous soumettez ; si vous utilisez OAuth Cloudflare, jetons et informations de zone pour mettre à jour le DNS. Préférences du navigateur : thème et langue dans le local storage. Nous n'exploitons pas de comptes utilisateurs grand public ni de profils marketing.",
      },
      {
        title: '3. Ce que nous ne collectons pas',
        body: "Nous n'accédons pas, ne lisons pas et ne stockons pas les corps de messages e-mail, objets, identités de destinataires ou contenus de boîtes aux lettres via le protocole PACT. Les rapports agrégés utilisés par le protocole ne constituent pas, par conception, des données personnelles.",
      },
      {
        title: '4. Comment nous utilisons les informations',
        body: "Nous utilisons les informations ci-dessus pour assurer l’intake du leftover courrier, ingérer et publier l'historique confirmé de façon indépendante, maintenir les preuves cryptographiques, prévenir les abus et améliorer la fiabilité du service. Les champs du ledger sont publiés pour que quiconque — y compris des agents — puisse revérifier ce qui s'est passé.",
      },
      {
        title: '5. Ledger public',
        body: "Les identités résiduelles et leur historique confirmé de façon indépendante ainsi que leurs preuves sont destinés à être publics sur l’API du ledger. Ne soumettez pas un domaine d’envoi sans comprendre que les métadonnées d'authentification associées apparaîtront dans un registre public. Ce site ne publie pas de profil humain d’évidence classé.",
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
        body: "Les données du registre public sont conservées pour préserver l'intégrité de l'enregistrement append-only. Les journaux opérationnels et les données de session d’intake ne sont conservés que le temps nécessaire pour faire fonctionner, sécuriser et déboguer le service, et pour respecter les obligations légales.",
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
