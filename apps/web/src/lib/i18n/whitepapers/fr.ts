export const WHITEPAPER_FR = `
Les identifiants sont bon marché. Un domaine, un profil, un badge — tout cela peut se fabriquer cet après-midi. Hier ne le peut pas, si quelqu’un d’autre regardait déjà.

PACT est un registre public de traces que des systèmes indépendants émettent déjà. Les systèmes de courrier produisent des rapports agrégés d’authentification. Les navigateurs ont déjà exigé des journaux publics de certificats. La signature logicielle écrit déjà un journal public. Personne n’adhère à un nouveau réseau. Le DNS ne fait que pointer le flux de courrier ici. Le registre publie ce qui s’est passé. Il ne décide pas ce que cela signifie.

Le nom est Provenance of Accumulated Checkable Traces — provenance de traces accumulées et vérifiables. Provenance : les traces ont une source qui n’est pas cet opérateur. Accumulées : le registre grandit avec le temps ; on ne peut pas le remplir vers le passé. Vérifiables : n’importe qui peut recalculer l’inclusion contre une racine publiée.

Les modèles génératifs ont rendu bon marché les nouveaux identifiants et les nouveaux documents. Ils n’ont pas rendu hier bon marché. Le seul registre qui survit à cela est un registre que quelqu’un d’autre était déjà en train d’écrire.

## Traces résiduelles

Un nouveau système d’identité demande en général au monde un rituel nouveau : installer une application, émettre une attestation, passer une cérémonie, faire confiance à un nouvel émetteur. Ces systèmes échouent à l’échelle qui compte, parce que ceux qui devraient adhérer n’attendent pas un autre réseau.

PACT enregistre l’échappement résiduel. Les systèmes destinataires de courrier émettent déjà des rapports. Les journaux publics de certificats existent déjà parce que les navigateurs ont exigé un journal d’émission. Rekor existe déjà parce que la chaîne d’approvisionnement logicielle a voulu un journal d’artefacts signés. Ce protocole n’invente pas un flux pour demander au monde de le remplir. Il conserve ce qui était déjà jeté.

Courrier, certificats et signatures sont des types résiduels d’origine distincte. Ils restent sur le même arbre en ajout seulement, pour que qui vérifie ait une seule racine contre laquelle recalculer. Ils ne sont jamais fusionnés en un score. Une source résiduelle ultérieure peut s’ajouter comme un autre type étiqueté. Chaque type garde son propre préimage. Les applications peuvent interpréter les champs. Ce protocole ne le fera pas.

## Rapports de courrier

Tout domaine institutionnel qui envoie du courrier le signe déjà avec DKIM. Les systèmes destinataires — Gmail, Outlook, Yahoo et d’autres — valident déjà ces signatures et émettent déjà des rapports agrégés : si du courrier authentifié est arrivé, à quelle fréquence, depuis quelle infrastructure, et selon qui.

Ces rapports ne contiennent ni messages, ni objets, ni boîtes, ni personnes. Ce sont des résumés de résultats d’authentification sur une période. La confidentialité ici est structurelle. Le pipeline ne voit jamais le contenu, donc une politique ne peut pas le collecter plus tard par accident.

Un nom obtient un registre de courrier en pointant le DNS. On ajoute une destination de rapports pour en conserver une copie. La politique existante du domaine et les autres destinations restent. Rien ne change dans l’envoi ni dans la réception du courrier. L’historique commence à l’arrivée du premier rapport indépendant — pas quand la ligne DNS est enregistrée.

Chaque feuille de courrier s’engage sur le domaine, la période, l’organisation déclarante, les comptes de réussite et d’échec, et un hash du wrapper signé qui a porté le rapport. Les faux rapports n’entrent pas : le wrapper doit s’authentifier et le déclarant doit être une organisation connue. Le rapport brut est jeté après extraction.

## Journaux de certificats

Les journaux Certificate Transparency enregistrent déjà l’émission. Ils existent parce que les navigateurs ont exigé un journal public, non parce que ce protocole a demandé à quiconque de journaliser. Un nom qui y apparaît a une date de première vue écrite par quelqu’un d’autre.

Un nouveau certificat peut être émis en quelques minutes. C’est un calendrier faible, non une preuve que HTTPS est digne de confiance, ni une affirmation de qualité sur le certificat. Un vrai certificat peut couvrir un nom qui n’existait pas hier.

Ce site indexe les journaux publics une fois le nom sur le ledger. Il n’y a pas de second rituel. Le sujet peut faire émettre un certificat. Le sujet ne peut pas être le journal.

Les feuilles de certificats portent une date de première vue, un émetteur, une fenêtre de validité et une empreinte. Elles partagent l’arbre et l’espace d’index avec les feuilles de courrier et de signature. Elles ne sont jamais fusionnées avec elles.

L’ingest de référence lit un index public sur ces journaux, non un opérateur de journal. C’est plus faible que la tête d’arbre signée d’un journal précis. C’est encore du calendrier résiduel d’une infrastructure qui existait déjà.

## Journaux de signatures

Rekor enregistre déjà les métadonnées de logiciels signés. Il existe parce que la chaîne d’approvisionnement logicielle a voulu un journal public, non parce que ce protocole a demandé à quiconque de journaliser.

Une nouvelle signature peut être publiée aussi bon marché qu’un nouveau certificat. C’est un calendrier faible, non une preuve qu’un nom est légitime, ni une affirmation de qualité sur le logiciel.

Ce site indexe les sujets Rekor résiduels — un URI GitHub, un e-mail ou un nom d’hôte — pas un domaine connecté. Un URI github.com est un leftover de premier ordre ; il ne couvre pas le site d’un client. Le leftover d’hôte utilise ce nom et ses formes www et https. Le leftover e-mail est la boîte exacte déjà présente dans le journal. On ne cherche pas des boîtes devinées. Un leftover d’hôte vide est attendu.

Les feuilles de signature portent une identité, une heure intégrée et un id d’entrée. Elles partagent l’arbre et l’espace d’index avec les feuilles de courrier et de certificats. Elles ne sont jamais fusionnées avec elles.

L’ingest de référence lit un index public sur Rekor, non la preuve Merkle de Rekor. C’est plus faible que la tête d’arbre signée du journal. C’est encore du calendrier résiduel d’une infrastructure qui existait déjà.

## Un arbre, trois types

Les trois types sont des feuilles keccak256 dans un arbre de Merkle creux. Les bindings ne doivent pas partager la disposition du préimage, pour qu’une feuille de courrier ne puisse pas collisionner avec une feuille de certificat ou de signature du même nom.

La page publique montre les trois. Elle ne les additionne pas. Elle ne les moyenne pas. Elle ne produit pas de badge. Quiconque construit une application au-dessus peut interpréter les champs. Les fondre en un seul nombre est le choix de cette application, et ce n’est pas ce protocole.

## N’importe qui peut vérifier

Chaque trace est une feuille. Les racines sont publiées on-chain, hors de cet opérateur, pour qu’un autre passé ne puisse pas être substitué en silence. Qui vérifie recalcule l’inclusion contre cette racine : hash de la feuille, index, hashes frères, racine publiée. La vérification n’exige pas de contacter cet opérateur.

Les feuilles de courrier peuvent s’ouvrir plus loin. L’opérateur stocke le wrapper reçu et un instantané DNS de la clé DKIM à l’ingest. Qui vérifie hashe les octets stockés contre la feuille, et contrôle que la clé était enregistrée. Ce n’est pas une affirmation que cet opérateur est honnête sur la disponibilité. Les racines attestent l’inclusion, non que les octets seront encore servis demain.

## Deux horloges

L’enregistrement est depuis combien de temps le nom existe. Confirmé depuis est depuis combien de temps ce registre accumule des traces. Elles ne sont jamais fusionnées.

Un nom de huit ans connecté aujourd’hui a une longue horloge d’enregistrement et une horloge de confirmation à zéro. C’est attendu. Saisir le DNS hérite la date d’enregistrement et rien de l’horloge de courrier. Les mélanger laisserait un usurpatteur emprunter hier.

## Ce que la page montre

La page est ennuyeuse exprès. Depuis combien de temps des déclarants de courrier indépendants confirment le nom. Combien de rapports. De quelles organisations. Quand un certificat couvrant est apparu pour la première fois. Quand une signature couvrante est apparue. Horloges, rapports, organisations, dates de certificats, entrées de signature. Pas de score. Pas de badge. Pas de verdict.

## Ce que ce n’est pas

Pas du KYC. Pas une affirmation qu’un nom est légitime. Pas un badge HTTPS. Pas un badge Sigstore. Pas une attestation personnelle. Pas un remplacement des registres ou des bureaux de crédit. Pas un protocole d’authentification de documents — il répond à quel historique confirmé de façon indépendante a été publié pour un domaine, non si un message ou une pièce jointe particulière est authentique.

Le jugement reste dehors.

## Ce qui est vrai aujourd’hui

Les racines sont sur Base Sepolia — testnet, un publieur autorisé. Cet opérateur détient les feuilles. Les racines attestent l’inclusion, non la disponibilité.

C’est la limite honnête. La thèse n’attend pas le mainnet. Les flux, l’arbre et la page publique existent déjà. N’importe qui peut revérifier ce qui est publié.

PACT — Provenance of Accumulated Checkable Traces.

we build real est le mouvement. PACT est le protocole ouvert. La première implémentation de référence est ce site.
`.trim();
