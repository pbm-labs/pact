import type { Dictionary } from '../types';

export const de: Dictionary = {
  nav: {
    language: 'Sprache',
    publicRecords: 'Öffentliche Einträge',
  },
  footer: {
    docs: 'Docs',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
  },
  common: {
    home: 'Startseite',
    continue: 'Weiter',
    copy: 'Kopieren',
    copied: 'Kopiert',
    loading: 'Wird geladen…',
    toggleTheme: 'Thema umschalten',
    trustScore: 'Vertrauenswert {n} von 100',
  },
  home: {
    heroTitle: 'KI kann alles fälschen.',
    heroAccent: 'Außer gestern.',
    heroSub:
      'Ein überprüfbarer öffentlicher Eintrag für deine Domain — entsteht passiv, lässt sich nicht zurückdatieren.',
    manifestoEyebrow: 'Das Manifest',
    manifestoTitle: 'Das Identitätsproblem des Internets',
    manifestoSub: 'Warum Geschichte das Eine ist, das sich nicht herstellen lässt.',
    closeVideo: 'Schließen',
    howEyebrow: 'So funktioniert es',
    howTitle: 'Evidenz, die du nachprüfen kannst.',
    howLead: 'Es bittet dich nicht, einer Autorität zu vertrauen. Es bittet dich, einen öffentlichen Eintrag zu prüfen.',
    howSteps: [
      {
        title: 'Unabhängige Systeme bestätigen es',
        body: 'Jede Aussage stammt von empfangenden Mailsystemen — Gmail, Outlook, Yahoo und andere — die einander nicht kennen, keinen Anreiz zur Absprache haben und nicht wissen, dass sie als Evidenz dienen. Ihre unkoordinierte Übereinstimmung über die Zeit ist der Beweis.',
      },
      {
        title: 'Jede Person kann den Eintrag prüfen',
        body: 'Der öffentliche Eintrag ist append-only. Jede Person kann das Veröffentlichte neu berechnen, ohne um Erlaubnis zu bitten. Evidenz, die du nachprüfen kannst — keine Behauptung, die du akzeptieren musst.',
      },
      {
        title: 'Gestern lässt sich nicht herstellen',
        body: 'Du kannst eine gealterte Domain kaufen. Du kannst eine LinkedIn-Historie fälschen. Du kannst gestern nicht früher geschehen lassen. Diese Historie entsteht aus vergehender Echtzeit, während unabhängige Dritte zusahen. Es gibt keine Abkürzung durch die Zeit.',
      },
    ],
    recordEyebrow: 'Hinter jedem Eintrag',
    recordTitle: 'Deine vollständige öffentliche Seite.',
    recordSub:
      'Jede Person kann sie öffnen. Unabhängig bestätigte Historie — teilbar, wo ein Gegenüber nachschauen könnte.',
    mockLabel: 'Beispiel',
    mockStatusSub: 'Unabhängig bestätigte Historie, die weiter wächst.',
    mockTimeSub: 'seit dem ersten Bericht',
    mockOrgs: 'Meldende Orgs.',
    mockOrgsSub: 'unabhängig',
    recordFoot:
      'Jeder Eintrag wurde von empfangenden Mailsystemen bestätigt — nicht selbst gemeldet. Dieser Eintrag wächst nur nach vorn.',
    privacyTitle: 'Datenschutz by Design.',
    privacyBody1:
      'Beim Verbinden zeigt ein DNS-Berichtsweg (rua) auf uns. Unabhängige Systeme senden bereits Aggregatberichte für die Domain — Authentifizierungszahlen, Zeitraum und Infrastruktur. Dieser Feed ist die einzige Datenquelle.',
    privacyBody2: 'Der öffentliche Eintrag ist bestätigte Domain-Historie. Mehr wird nicht erfasst.',
    privacyTableTitle: 'Was in einem Bericht steht',
    privacyRows: [
      'Domain',
      'Berichtszeitraum',
      'Bestanden / fehlgeschlagen',
      'Meldende Organisation',
    ],
    badgeEyebrow: 'Dein Nachweis als Unternehmen',
    badgeTitle: 'Einmal einfügen. Lebt in jeder E-Mail, die du sendest.',
    badgeSub:
      'Ein kleines Live-Bild in deiner E-Mail-Signatur. Es aktualisiert sich, während deine Historie wächst. Ein Klick öffnet deine vollständige öffentliche Seite.',
    signatureName: 'Jane Doe',
    signatureRole: 'Gründerin · Acme Studio',
    signatureContact: '+1 (415) 555-0134 · acme.studio',
    badgeFoot:
      'Funktioniert in Gmail, Outlook, Apple Mail und überall, wo HTML-Signaturen funktionieren.',
    ctaTitle: 'Starte deinen öffentlichen Eintrag.',
    ctaBody:
      'Einmal verbinden. Unabhängige Systeme bestätigen den Rest. Die Historie wächst nur nach vorn.',
    ctaButton: 'Domain hinzufügen',
    ctaSub: 'Sei unter den Ersten auf festem Boden.',
    watchManifesto: 'Das Manifest ansehen',
  },
  connect: {
    backHome: '← Startseite',
    eyebrow: 'Zwei Minuten, weitgehend automatisch',
    title: 'Domain hinzufügen',
    intro:
      'Kein Papierkram, kein Warten auf andere. Nur der erste Tag einer Geschichte, die wirklich dir gehört.',
    yourDomain: 'Deine Domain',
    pathCloudflareTitle: 'Ich nutze Cloudflare',
    pathCloudflareDesc: 'Ein Klick — wir erledigen den Rest.',
    pathCloudflareBadge: 'Am schnellsten',
    pathManualTitle: 'Manuell hinzufügen',
    pathManualDesc:
      'Eine Zeile zum Einfügen, wo du deine Website verwaltest — GoDaddy, Namecheap oder ein anderer Anbieter.',
    pathManualBadge: 'Universell',
    pathToolTitle: 'Ich nutze bereits ein Tool',
    pathToolDesc: 'Postmark oder ähnlich — hierher zeigen.',
    pathToolBadge: 'Vorhandenes Tool',
    whatDoesThisDo: 'Was bewirkt das?',
    cloudflareExplain:
      'Du meldest dich bei Cloudflare an, und wir fügen den Verifizierungs-Eintrag für dich hinzu.',
    toolIntro: 'Füge in den Einstellungen deines Tools dies hinzu:',
    toolExplain:
      'Dein Tool prüft diese Domain bereits. Wenn du es hierher zeigst, sind wir Teil dieser Prüfung. Dein öffentlicher Eintrag erscheint automatisch, sobald der erste Report eintrifft (meist innerhalb von 24–48 Stunden) — hier ist kein weiterer Schritt nötig.',
    manualIntro:
      'Füge dies dort ein, wo du die Einstellungen deiner Website verwaltest (frage deinen Anbieter, wenn du unsicher bist):',
    manualExplain:
      'Eine Zeile, mit der unabhängige Systeme bestätigen können, dass deine Domain echt ist. Wenn du bereits eine ähnliche Zeile hast, füge unsere Adresse hinzu, statt sie zu ersetzen. Dein öffentlicher Eintrag erscheint automatisch, sobald der erste Report eintrifft (meist innerhalb von 24–48 Stunden) — hier musst du nichts weiter absenden.',
    errors: {
      invalid_domain: 'Gib eine gültige Domain ein (z. B. example.com).',
      server_config: 'Dem Server fehlen CONNECT_STATE_SECRET oder Supabase-Zugangsdaten.',
      oauth_not_configured: 'Cloudflare-Anmeldung ist auf diesem Server nicht konfiguriert.',
      missing_code: 'Anmeldung wurde abgebrochen oder ist unvollständig.',
      invalid_state: 'Sitzung abgelaufen — versuche erneut zu verbinden.',
      token_exchange: 'Verbindung mit Cloudflare konnte nicht abgeschlossen werden.',
      zone_not_found:
        'Diese Domain wurde im gewählten Cloudflare-Konto nicht gefunden. Versuche ein anderes Konto.',
      dmarc_update:
        'Die Einrichtung konnte nicht automatisch abgeschlossen werden. Versuche die manuelle Option.',
      register: 'Fast geschafft — der letzte Schritt ist fehlgeschlagen. Versuche es erneut.',
      somethingWrong: 'Etwas ist schiefgelaufen.',
    },
  },
  records: {
    backHome: 'Startseite',
    eyebrow: 'Öffentliche Einträge',
    title: 'Domains, die Vertrauen aufbauen',
    intro:
      'Sortiert nach verifizierter Historie — wie lange jede Domain unabhängig bestätigt wurde. Vertrauenswerte erscheinen, sobald diese Historie aussagekräftig ist.',
    addDomain: 'Domain hinzufügen',
    building: 'Im Aufbau',
    proven: 'Nachgewiesen',
    rankedBy: 'Sortiert nach verifizierter Historie',
    rankedHint:
      'Längere unabhängig bestätigte Historie steht höher. Ein Vertrauenswert erscheint, sobald die Historie aussagekräftig ist.',
    colDomain: 'Domain',
    colHistory: 'Historie',
    colStatus: 'Status',
    verified: 'verifiziert',
    report: 'Bericht',
    reports: 'Berichte',
    org: 'Org.',
    orgs: 'Orgs.',
    emptyTitle: 'Noch keine Domains',
    emptyBody: 'Füge eine Domain hinzu, um einen öffentlichen Eintrag aufzubauen.',
    emptyCta: 'Erste Domain hinzufügen',
    searchPlaceholder: 'Nach Domain suchen…',
    noMatch: 'Keine Domain entspricht „{query}“.',
    registered: 'registriert',
  },
  domain: {
    backRecords: 'Öffentliche Einträge',
    publicRecord: 'Öffentlicher Eintrag',
    building: 'Im Aufbau',
    proven: 'Nachgewiesen',
    awaitingFirst: 'Warte auf ersten Bericht',
    awaitingIntro:
      'Registriert. Warte auf die erste unabhängige Bestätigung — meist innerhalb eines Tages.',
    connected: 'Verbunden',
    whatNext: 'Was als Nächstes passiert',
    next1: 'Diese Domain wird unabhängig erkannt, meist innerhalb eines Tages.',
    next2: 'Sie bestätigt still, dass alles in Ordnung ist.',
    next3: 'Diese Seite aktualisiert sich von allein — nichts zu klicken.',
    historyHero: 'verifizierter Historie',
    historyIntro:
      'Unabhängig bestätigte Historie, Tag für Tag ehrlich aufgebaut. Ein Vertrauenswert erscheint, sobald genug Historie vorliegt.',
    scoreIntro:
      'Unabhängig bestätigte Historie mit einem Vertrauenswert, der widerspiegelt, wie lange und wie breit sie verifiziert wurde.',
    timeVerified: 'Verifizierte Zeit',
    reports: 'Berichte',
    allTime: 'gesamt',
    passRate: 'Erfolgsquote',
    techSummary: 'Technische Verifizierung — Berichte & kryptografischer Nachweis',
    showMath: 'Rechnung anzeigen',
    domainRegistered: 'Domain registriert',
    verifiedSince: 'Verifiziert seit',
    awaitingReport: 'Warte auf ersten Bericht',
    noRecordYet: 'Noch kein öffentlicher Eintrag.',
    noRecordHint:
      'Wenn du den Verifizierungs-Eintrag bereits hinzugefügt hast, speichere diese Seite. Sie aktualisiert sich von allein, sobald die erste unabhängige Prüfung zurückkommt — meist innerhalb eines Tages.',
    connectDomain: 'Verbinden',
    firstDay: 'Erster Tag',
    dayOne: '1 Tag',
    days: '{n} Tage',
    progressDaysToBand: 'Noch etwa {days} Tage bis „{band}“, bei diesem Tempo.',
    progressBuilding: 'Die Historie wächst mit jeder unabhängigen Bestätigung weiter.',
    progressStarts: 'Das bewegt sich ab dem Moment der ersten Bestätigung.',
    bands: {
      no_history_yet: 'Noch keine Historie',
      provisional: 'Vorläufig',
      early: 'Früh',
      established: 'Etabliert',
      high_confidence: 'Hohes Vertrauen',
      maximum_confidence: 'Maximales Vertrauen',
    },
    mathRawScore: 'Rohwert (T)',
    mathDisplay: 'Anzeige',
    mathVolume: 'Volumen (V)',
    mathDiversity: 'Diversität (D)',
    mathMaturity: 'Reife (A)',
    mathFailedChecks: 'Fehlgeschlagene Prüfungen',
    dbNotConfigured: 'Datenbank nicht konfiguriert',
    reportHistory: 'Berichtshistorie',
    reportHistoryIntro:
      'Unabhängige Prüfungen treffen fortlaufend von verbundenen Reportern ein (typischerweise täglich).',
    reportHistoryCounts:
      '{periods} Berichtszeiträume von {reporters} Reporter-Organisationen — neueste zuerst.',
    colReporter: 'Reporter',
    colPeriod: 'Zeitraum',
    colPass: 'Bestanden',
    colFail: 'Fehlgeschlagen',
    colIngested: 'Erfasst',
    showOlderReports: 'Ältere Berichte anzeigen ({shown} von {total})',
    verification: 'Verifizierung',
    verificationIntro:
      'Inklusionsnachweise neu berechnet aus Live-Daten gegen den neuesten Staging-Root.',
    anchor: 'Anker',
    onChain: 'On-chain',
    stagingOffChain: 'Staging (off-chain)',
    rootsMatch: 'Roots stimmen überein',
    yes: 'Ja',
    no: 'Nein',
    domainLeaves: 'Domain-Leaves',
    globalTree: 'Globaler Baum',
    publishedRoot: 'Veröffentlichter Root',
    proofsShown:
      'Nachweise für die {n} neuesten Leaves. Lade oben ältere Berichte, um frühere Zeiträume zu prüfen.',
    leafHash: 'Leaf-Hash',
    proofVerified: 'Verifiziert',
    proofUnverified: 'Nicht verifiziert',
    clockUnknown: '—',
    clockDay1: '(Tag 1)',
    clockYears: '({n} J.)',
    clockYear: '({n} J.)',
    clockMonths: '({n} Mo.)',
    clockDaysShort: '({n}d)',
    pathEyebrow: 'Um nachgewiesen zu werden',
    pathDaysItem: '{n} Tage unabhängig bestätigter Historie',
    pathDaysCurrent: 'du bist bei {n}',
    pathReportersItem: 'Mindestens eine unabhängige meldende Organisation',
    pathReportersCurrent: 'du hast {n}',
    pathExplainer:
      'Eine unabhängige meldende Organisation ist ein empfangendes Mailsystem — Gmail, Outlook, Yahoo und andere — das diese Domain mit eigener Authentifizierung bestätigt hat. Unkoordinierte Übereinstimmung über die Zeit ist der Beweis. Nachgewiesen braucht genug dieser Historie, damit gestern nicht herstellbar ist.',
    pathFoot:
      'Jede Bestätigung kommt von unabhängigen Empfangssystemen — nicht selbst gemeldet. Dieser Eintrag wächst nur vorwärts.',
    badgeEyebrow: 'Einbettbares Badge',
    badgeIntro:
      'Eine kompakte Form dieser Seite. Lebt in E-Mail-Signaturen und aktualisiert sich, während der Eintrag wächst — jeder Klick öffnet hier.',
    shareRecord: 'Dein öffentlicher Eintrag',
    shareEyebrow: 'Teile deinen Nachweis',
    shareLinkedIn: 'LinkedIn',
    shareX: 'X',
    shareTextX:
      'KI kann alles fälschen. Außer gestern.\n\n{domain} hat jetzt einen öffentlichen Eintrag, den jede Person nachprüfen kann.',
    shareTextLinkedIn:
      '{domain} hat jetzt einen öffentlichen Eintrag, den jede Person nachprüfen kann — unabhängig bestätigte Historie, entsteht passiv, lässt sich nicht zurückdatieren.',
  },
  badge: {
    mockLabel: 'Deine E-Mail-Signatur',
    signatureName: 'Dein Name',
    signatureRole: 'Rolle · Unternehmen',
    signatureContact: 'name@{domain}',
    copyBadge: 'Badge kopieren',
    copyDone: 'Kopiert — in die Signatur einfügen',
    copyError: 'Kopieren fehlgeschlagen — erneut versuchen',
    howTo:
      'Funktioniert in Gmail, Outlook und Apple Mail. Das Badge bleibt nach dem Einfügen klickbar.',
    alt: 'we build real Badge für {domain}',
    themeAria: 'Badge-Thema',
    themeDark: 'Dunkel',
    themeLight: 'Hell',
  },
  whitepaper: {
    eyebrow: 'PACT Protocol',
    title: 'Whitepaper',
    intro:
      'Das offene Protokoll hinter dem öffentlichen Eintrag — wie verifizierte Historie erfasst, veröffentlicht und gemessen wird.',
    source: 'Quellcode auf GitHub →',
  },
  whyPact: {
    eyebrow: 'PACT Protocol',
    title: 'Was PACT anders macht',
    intro: 'Eine Zwei-Minuten-Notiz zu Evidenz statt Autorität — nicht das vollständige Whitepaper.',
    body: [
      'Jede bestehende Art zu beweisen, dass ein Unternehmen echt ist, hat denselben Fehler: Es ist die *Behauptung einer Autorität*, nicht *Evidenz*. Die Auskunft einer Credit-Agency, ein Registereintrag, ein Kontoauszug, eine LinkedIn-Historie — alle verlangen, dass du darauf vertraust, jemand anderes habe korrekt geprüft. Keine davon erzeugt etwas, das ein Fremder selbst nachrechnen kann, von ersten Prinzipien aus, ohne einem Torwächter zu vertrauen.',
      'Dieser Fehler war hinnehmbar. Das ist vorbei. Generative KI hat keine neue Bedrohung geschaffen — sie hat das Letzte entfernt, das das Fälschen dieser Signale teuer machte. Eine zehn Jahre alte Domain, fünf Jahre LinkedIn, ein überzeugender Kontoauszug: all das lässt sich jetzt billig fabrizieren. Die Autoritäten wurden nicht schlechter. Die Kosten, sie anzulügen, sind zusammengebrochen.',
      'PACT bittet dich nicht, einer Autorität zu vertrauen. PACT bittet dich, einen öffentlichen Eintrag zu prüfen.',
      'Jede Aussage von PACT stammt von unabhängigen empfangenden Mailsystemen — Gmail, Outlook, Yahoo und andere — die einander nicht kennen, keinen Anreiz zur Absprache haben und nicht wissen, dass sie als Evidenz dienen. Ihre aggregierte, unkoordinierte Übereinstimmung über die Zeit ist der Beweis. Nicht weil PACT das sagt. Weil jede Person die veröffentlichten Blätter und Inklusionsbeweise gegen den öffentlichen Append-only-Eintrag neu berechnen kann, ohne PACT um Erlaubnis zu bitten. Diesen Eintrag so zu verankern, dass die Prüfung nicht mehr von der Infrastruktur eines einzelnen Betreibers abhängt, ist der nächste Protokoll-Meilenstein — keine Änderung der These.',
      'Das ist die Eigenschaft, die etablierte Nachweise nicht nachrüsten können. Eine Auskunftei kann nicht trustless werden — ihr Geschäftsmodell *ist* der vertrauenswürdige Mittler. Ein staatliches Register kann nicht trustless werden — es ist definitionsgemäß eine Autorität. Ein Kontoauszug kann nicht trustless werden — er ist ein Dokument, und Dokumente lassen sich ändern. PACT ist keine bessere Version davon. Es sitzt in einer anderen Kategorie: Evidenz, die du nachprüfen kannst, nicht eine Behauptung, die du akzeptieren musst.',
      'Was das dauerhaft macht, nicht nur anders: **die Historie, die PACT misst, lässt sich nachträglich zu keinem Preis herstellen — auch nicht durch PACTs eigene Betreiber.**',
      'Du kannst eine gealterte Domain kaufen. Du kannst eine LinkedIn-Historie fälschen. Du kannst eine Briefkastenfirma mit perfekten Papieren bauen. Was du nicht kannst: gestern früher geschehen lassen. PACTs Historie entsteht aus vergehender Echtzeit, während unabhängige Dritte zusahen. Es gibt keine Abkürzung durch die Zeit. Das ist keine Produktpräferenz. Es ist eine physikalische Grenze, die PACT nutzt.',
      'Deshalb konkurriert PACT heute nicht über Preis oder Bequemlichkeit — und muss es nicht. Bestehende Methoden sind billig und sofort *weil* sie flach genug sind, um billig und sofort gefälscht zu werden. PACT ist langsam im Aufbau *weil* ein gut finanzierter, geduldiger, KI-ausgestatteter Gegner trotzdem keine Vergangenheit kaufen kann, die er nicht gelebt hat. Die Langsamkeit ist keine Limitierung, die wegoptimiert werden soll. Sie ist der Punkt.',
      'Jeder andere Legitimitätsnachweis beantwortet: *was hat jemand behauptet, und wer bürgt dafür?*',
      'PACT beantwortet eine andere Frage: *was ist tatsächlich geschehen, wie lange, bezeugt von wie vielen unabhängigen Parteien, die keinen Grund hatten zu lügen?*',
      'Diese Frage hatte nie eine dauerhafte öffentliche Antwort. Ab jetzt hat sie eine.',
    ].join('\n\n'),
    scope:
      'PACT misst unabhängig verifizierte Domain-Historie aus DMARC-Aggregatberichten. Es ist kein KYC, keine Personen-Credential und kein Ersatz für Register oder Auskunfteien.',
  },
  docs: {
    eyebrow: 'PACT Protocol',
    title: 'Docs',
    intro: 'PACT ist ein offenes Protokoll. we build real ist die Bewegung. Wie es funktioniert, und warum es anders ist.',
    whyTitle: 'Was PACT anders macht',
    whyBody: 'Eine Zwei-Minuten-Notiz zu Evidenz statt Autorität — zuerst lesen.',
    whitepaperTitle: 'Whitepaper',
    whitepaperBody:
      'Das offene Protokoll hinter dem öffentlichen Eintrag — wie verifizierte Historie erfasst, veröffentlicht und gemessen wird.',
    roadmapTitle: 'Roadmap',
    roadmapBody: 'Was heute live ist — und was als Nächstes kommt.',
    readWhitepaper: 'Whitepaper lesen',
    readRoadmap: 'Roadmap lesen',
  },
  roadmap: {
    eyebrow: 'PACT Protocol',
    title: 'Roadmap',
    intro:
      'Phase 0a ist live: ein öffentlicher, nachrechenbarer Eintrag mit Staging-Merkle-Roots. On-Chain-Verankerung folgt.',
    nowTitle: 'Heute live',
    nowItems: [
      'Domain-Verbindung über Cloudflare OAuth, manuelles DNS oder bestehende Reporting-Tools',
      'Automatische Erstellung des öffentlichen Eintrags beim ersten gültigen Aggregatbericht',
      'Kontinuierliche Aufnahme echter DMARC-Aggregatberichte',
      'Append-only-Merkle-Baum mit öffentlich nachrechenbaren Inklusionsbeweisen',
      'Regelmäßige Veröffentlichung von Staging-Roots in einem öffentlichen Ledger',
      'Öffentliche Einträge nach verifizierter Historie sortiert; skalierte Score wenn sinnvoll',
      'Domain-Seiten mit Uhren, Aktivität und technischer Verifikation',
    ],
    nextTitle: 'In aktiver Entwicklung',
    nextItems: [
      'On-Chain-Verankerung von Merkle-Roots',
      'Velocity als Begleitsignal zur Maturity',
      'Überwachung von Infrastruktur-Diskontinuitäten (Signal)',
      'Breitere Multi-Node- / permissionless Operation',
    ],
    nextNote:
      'Nichts davon ist für die heutige öffentliche Verifikation erforderlich. Sie erweitern, was bereits live ist.',
  },
  legal: {
    eyebrow: 'Rechtliches',
    lastUpdated: 'Zuletzt aktualisiert: 8. August 2026',
    termsTitle: 'Nutzungsbedingungen',
    privacyTitle: 'Datenschutzerklärung',
    emailLabel: 'E-Mail',
    terms: [
      {
        title: '1. Annahme der Bedingungen',
        body: 'Durch den Zugriff auf oder die Nutzung dieser Website (webuildreal.dev) und verwandter Dienste, die unter der Marke „we build real“ betrieben werden, stimmst du diesen Nutzungsbedingungen zu. Wenn du nicht einverstanden bist, nutze die Website nicht und verbinde keine Domain.',
      },
      {
        title: '2. Wer wir sind',
        body: 'Diese Website ist das öffentliche Zuhause von we build real, einer Bewegung für überprüfbare Geschichte. PACT ist ein offenes Protokoll. PBM Labs LLC („wir“, „uns“), eine Limited Liability Company nach dem Recht von Wyoming, stellt die erste PACT-Referenzimplementierung bereit. Sie bietet öffentlichen Zugang zu dieser Implementierung: Domain-Verbindung, einen öffentlichen Eintrag unabhängig verifizierter Domain-Historie und zugehörige Dokumentation.',
      },
      {
        title: '3. Der Dienst',
        body: 'PACT erfasst DMARC-Aggregat-Authentifizierungsberichte, die empfangende Mail-Systeme bereits erzeugen, schreibt extrahierte Metadaten in einen nur anhängenden Merkle-Baum und veröffentlicht einen öffentlichen Eintrag sowie ein organisches Vertrauenssignal für verbundene Domains. Das Verbinden einer Domain erfordert, PACT als Berichtsziel in DNS hinzuzufügen (direkt oder über einen unterstützten Anbieter). Wir lesen keine Nachrichteninhalte, Empfängeridentitäten oder Postfachdaten.',
      },
      {
        title: '4. Öffentliche Einträge',
        body: 'Informationen im öffentlichen Eintrag — einschließlich Domainnamen, Zusammenfassungen verifizierter Historie, Vertrauenssignale und kryptografischer Nachweise — sind zur öffentlichen Einsicht bestimmt. Verbinde keine Domain, wenn du nicht berechtigt bist, die Authentifizierungs-Metadaten dieser Domain Teil eines öffentlichen Ledgers werden zu lassen.',
      },
      {
        title: '5. Deine Verantwortlichkeiten',
        body: 'Du darfst nur Domains verbinden, die du kontrollierst oder zu deren Verwaltung du berechtigt bist. Du bist verantwortlich für die Richtigkeit der DNS-Änderungen, die du vornimmst, für die Einhaltung deiner eigenen Richtlinien und geltenden Rechts sowie dafür, den Dienst nicht zur Belästigung, zum Betrug oder zur Irreführung anderer zu nutzen. Unbefugter Zugriff, Störung des Dienstes, Scraping, das ihn beeinträchtigt, das Einschleusen von Malware oder sonstiger Missbrauch der Website sind untersagt.',
      },
      {
        title: '6. Keine Beratung; keine Garantie der Legitimität',
        body: 'Vertrauenswerte, Historienzusammenfassungen und Nachweise sind informative Messungen aus verfügbaren Berichten. Sie sind keine rechtliche, finanzielle, Compliance- oder Geschäftsberatung und garantieren nicht, dass eine Domain, Organisation oder Person legitim, sicher für Transaktionen oder risikofrei ist. Du bleibst allein für deine eigenen Entscheidungen verantwortlich.',
      },
      {
        title: '7. Keine Finanzdienstleistungen',
        body: 'Wir sind keine Bank, kein Broker, kein Money-Services-Business und kein Finanzinstitut. Wir verarbeiten, halten, verwahren oder übertragen keine Währung, Wertpapiere oder Finanzanlagen.',
      },
      {
        title: '8. Geistiges Eigentum',
        body: 'Website-Inhalte, Marke und Design von „we build real“ gehören PBM Labs LLC oder seinen Lizenzgebern, sofern nicht anders angegeben. Die Spezifikation des PACT-Protokolls und das Whitepaper werden offen zur Prüfung und Implementierung veröffentlicht; Implementierungen Dritter werden gefördert, vorbehaltlich ihrer eigenen Lizenzbedingungen, sofern anwendbar. Es werden keine Rechte gewährt außer dem beschränkten Recht, diese Website wie vorgesehen zu nutzen.',
      },
      {
        title: '9. Drittanbieter-Dienste',
        body: 'Die Website kann auf Dritte angewiesen sein oder auf sie verlinken (zum Beispiel DNS-Anbieter wie Cloudflare, Hosting- und Edge-Infrastruktur sowie Datenbankanbieter). Wir kontrollieren Drittanbieter-Dienste nicht und sind nicht für deren Inhalte, Verfügbarkeit oder Richtlinien verantwortlich. Deine Nutzung dieser Dienste unterliegt deren Bedingungen.',
      },
      {
        title: '10. Haftungsausschluss für Gewährleistungen',
        body: 'Die Website und der Dienst werden „wie besehen“ und „wie verfügbar“ ohne Gewährleistungen jeglicher Art bereitgestellt, ausdrücklich oder stillschweigend, einschließlich der Marktgängigkeit, der Eignung für einen bestimmten Zweck und der Nichtverletzung. Wir garantieren nicht, dass der Dienst ununterbrochen, fehlerfrei, vollständig oder sicher ist oder dass veröffentlichte Roots, Nachweise oder Werte deine Anforderungen erfüllen.',
      },
      {
        title: '11. Haftungsbeschränkung',
        body: 'Soweit gesetzlich zulässig, haften PBM Labs LLC und seine Mitglieder, Organe und Auftragnehmer nicht für indirekte, zufällige, besondere, Folgeschäden oder Strafschadensersatz aus deiner Nutzung der Website oder des Dienstes, einschließlich des Vertrauens auf öffentliche Einträge oder Vertrauenssignale, auch wenn auf die Möglichkeit solcher Schäden hingewiesen wurde.',
      },
      {
        title: '12. Änderungen',
        body: 'Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Die überarbeitete Fassung wird auf dieser Seite mit aktualisiertem Datum veröffentlicht. Die fortgesetzte Nutzung der Website nach Änderungen gilt als Annahme der überarbeiteten Bedingungen.',
      },
      {
        title: '13. Anwendbares Recht',
        body: 'Diese Bedingungen unterliegen dem Recht des Bundesstaates Wyoming, Vereinigte Staaten, unter Ausschluss der Kollisionsnormen.',
      },
      {
        title: '14. Kontakt',
        body: 'Rechtliche Mitteilungen und Fragen zu diesen Bedingungen: hello@webuildreal.dev.',
      },
    ],
    privacy: [
      {
        title: '1. Überblick',
        body: 'Diese Datenschutzerklärung erläutert, wie PBM Labs LLC Informationen verarbeitet, wenn du webuildreal.dev nutzt — das öffentliche Zuhause der Bewegung we build real und der ersten Referenzimplementierung des offenen PACT-Protokolls. PACT ist so gestaltet, dass seine primäre Datenquelle — DMARC-Aggregatberichte — keinen Nachrichteninhalt und keine persönlichen Identitäten enthält.',
      },
      {
        title: '2. Informationen, die wir verarbeiten',
        body: 'Domain- und Protokolldaten: Domainnamen, die du verbindest; Metadaten aus DMARC-Aggregatberichten (meldende Organisation, Zeitraum, Authentifizierungs-Pass/Fail-Zählungen, Selektor- und Infrastrukturkennungen in gehashter oder zusammengefasster Form); Merkle-Leaves, Roots und öffentliche Verifizierungsdaten. Daten aus dem Verbindungsablauf: Domain-Zeichenketten, die du übermittelst; bei Cloudflare-OAuth Tokens und Zoneninformationen, die nötig sind, um DNS in deinem Namen während dieser Sitzung zu aktualisieren. Browser-Einstellungen: Theme und Sprache im Local Storage deines Geräts. Wir betreiben auf dieser Website keine Verbraucher-Benutzerkonten oder Marketingprofile.',
      },
      {
        title: '3. Was wir nicht erheben',
        body: 'Wir greifen über das PACT-Protokoll nicht auf E-Mail-Nachrichtentexte, Betreffzeilen, Empfängeridentitäten oder Postfachinhalte zu und speichern sie nicht. Aggregatberichte, die das Protokoll nutzt, sind konzeptionell keine personenbezogenen Daten.',
      },
      {
        title: '4. Wie wir Informationen nutzen',
        body: 'Wir nutzen die oben genannten Informationen, um die Domain-Verbindung zu betreiben, verifizierte Historie aufzunehmen und zu veröffentlichen, Vertrauenssignale zu berechnen und anzuzeigen, kryptografische Nachweise zu pflegen, Missbrauch zu verhindern und die Zuverlässigkeit des Dienstes zu verbessern. Felder des öffentlichen Eintrags werden veröffentlicht, damit jeder die Historie unabhängig prüfen kann.',
      },
      {
        title: '5. Öffentliche Einträge',
        body: 'Verbundene Domains und ihre Zusammenfassungen verifizierter Historie, Werte (sofern angezeigt) und Nachweise sind zur Öffentlichkeit bestimmt. Verbinde keine Domain, wenn du nicht verstehst, dass zugehörige Authentifizierungs-Metadaten in einem öffentlichen Ledger erscheinen.',
      },
      {
        title: '6. Dienstleister',
        body: 'Wir nutzen Infrastrukturanbieter, um die Website zu hosten und Protokolldaten zu speichern (einschließlich Edge-Hosting und Datenbankdienste). Wenn du dich über Cloudflare-OAuth verbindest, verarbeitet Cloudflare Authentifizierung und DNS-Updates unter seinen Bedingungen. Anbieter können Daten in den Vereinigten Staaten oder anderen Jurisdiktionen verarbeiten, in denen sie tätig sind.',
      },
      {
        title: '7. Cookies und Local Storage',
        body: 'Wir verwenden auf dieser Website keine Werbe- oder Analyse-Tracking-Pixel. Wir speichern wesentliche Einstellungen (wie Theme und Sprache) im Local Storage deines Browsers. Du kannst diese in den Browser-Einstellungen löschen.',
      },
      {
        title: '8. Speicherung',
        body: 'Daten des öffentlichen Ledgers werden aufbewahrt, um die Integrität des nur anhängenden Eintrags zu wahren. Betriebsprotokolle und Verbindungs-Sitzungsdaten werden nur so lange aufbewahrt, wie es für Betrieb, Absicherung und Fehlersuche des Dienstes sowie zur Erfüllung rechtlicher Pflichten erforderlich ist.',
      },
      {
        title: '9. Sicherheit',
        body: 'Wir setzen angemessene technische und organisatorische Maßnahmen um, die zu einem öffentlichen Verifizierungsdienst passen. Keine Übertragung oder Speicherung ist vollständig sicher.',
      },
      {
        title: '10. Deine Rechte',
        body: 'Je nach deinem Standort kannst du Rechte auf Auskunft, Berichtigung oder Löschung personenbezogener Daten haben, die wir über dich speichern. Domainnamen und Einträge im öffentlichen Ledger werden unter dem primären Modell dieser Erklärung nicht als personenbezogene Daten behandelt; kontaktiere uns, wenn du glaubst, dass wir personenbezogene Daten über dich in anderer Form speichern. Wir verkaufen keine personenbezogenen Daten.',
      },
      {
        title: '11. Änderungen',
        body: 'Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Die überarbeitete Fassung wird auf dieser Seite mit aktualisiertem Datum veröffentlicht.',
      },
      {
        title: '12. Kontakt',
        body: 'Datenschutzfragen: hello@webuildreal.dev.',
      },
    ],
  },
};
