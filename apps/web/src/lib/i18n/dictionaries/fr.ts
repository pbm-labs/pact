import type { Dictionary } from '../types';

export const fr: Dictionary = {
  nav: {
    language: 'Langue',
    intake: 'Intake courrier',
    whitepaper: 'Livre blanc',
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
    lede: 'PACT enregistre le leftover pour les agents. La requête est type plus identité. PACT ne décide pas.',
    kindMail: 'Courrier',
    kindCt: 'Certificats',
    kindRekor: 'Signatures',
    hintMail: 'Domaine d’envoi (header_from)',
    hintCt: 'Nom d’hôte dans SAN/CN',
    hintRekor: 'Sujet leftover Rekor — URI GitHub, e-mail ou hôte',
    identityLabel: 'Identité',
    aside: 'Pas de score. Pas de mélange. Vide est une réponse. Le jugement reste dehors.',
    whitepaperCta: 'Livre blanc',
  },
  connect: {
    backHome: '← Accueil',
    eyebrow: 'Intake courrier',
    title: 'Garder le leftover courrier',
    intro:
      'Ajoute une destination de rapports pour conserver les rapports DMARC indépendants. Ce n’est pas un profil. Certificats et signatures se consultent par leurs propres identités.',
    yourDomain: 'Domaine d’envoi',
    pathCloudflareTitle: 'J’utilise Cloudflare',
    pathCloudflareDesc: 'Un clic — nous ajoutons la ligne DNS.',
    pathManualTitle: 'L’ajouter à la main',
    pathManualDesc:
      'Une ligne à coller là où tu gères le DNS — GoDaddy, Namecheap ou un autre hébergeur.',
    pathToolTitle: 'J’utilise déjà un outil',
    pathToolDesc: 'Postmark ou similaire — ajoute cette adresse comme destination de rapports.',
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
