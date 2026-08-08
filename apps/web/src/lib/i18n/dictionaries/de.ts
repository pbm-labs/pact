import type { Dictionary } from '../types';

export const de: Dictionary = {
  nav: {
    language: 'Sprache',
    whitepaper: 'Whitepaper',
    publicRecords: 'Öffentliche Einträge',
  },
  footer: {
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
  },
  common: {
    home: 'Startseite',
    back: 'Zurück',
    continue: 'Weiter',
    copy: 'Kopieren',
    copied: 'Kopiert',
    loading: 'Wird geladen…',
  },
  home: {
    manifestoEyebrow: 'Das Manifest',
    manifestoParagraphs: [
      '1969 verbanden sich zum ersten Mal vier Computer. Niemand in diesem Raum dachte an Identität. Es war nicht nötig. Jeder Online kannte ohnehin jeden anderen.',
      'So entstand das Internet ohne eine Möglichkeit zu wissen, wer jemand wirklich ist. Kein Fehler. Nur eine Frage, die noch niemand stellen musste.',
      'Dann wurde die Welt kleiner — und füllte sich mit Fremden.',
      'Ein Name auf dem Bildschirm konnte jeder sein. Oder niemand. Wir bauten eine ganze Zivilisation auf einem Netz, dem man nie das eine gab, was jede Gemeinschaft zum Überleben braucht: eine Art zu erkennen, wer echt ist.',
      'Und wir gewöhnten uns daran. Ein Fundament so groß wie das Internet — ein halbes Jahrhundert lang offen fehlend.',
      'Was still wahr bleibt: Es ist nicht zu spät. Fast alles, was du online bist, lässt sich in Minuten fälschen. Geschichte ist das Eine, das nicht. Sie entsteht Tag für Tag — ehrlich und nachvollziehbar. Jeder Tag, den wir warten, kommt nicht zurück.',
      'Das Fundament, das das Internet nie hatte, kann immer noch gegossen werden. Nicht als Reparatur. Als etwas, das endlich fertig ist — ein halbes Jahrhundert zu spät.',
      'Wir müssen nicht in der Lücke leben.',
      'Wir bauen echt. Ab jetzt.',
    ],
    readMore: 'Mehr lesen',
    showLess: 'Weniger anzeigen',
    ctaTitle: 'Beginne, das Fundament zu gießen.',
    ctaBody:
      'Geschichte entsteht Tag für Tag — ehrlich und nachvollziehbar. Jeder Tag, den wir warten, kommt nicht zurück.',
    ctaButton: 'Domain hinzufügen',
    ctaSub: 'Sei unter den Ersten auf festem Boden.',
    watchManifesto: 'Das Manifest ansehen',
  },
  howItWorks: {
    backHome: '← Startseite',
    eyebrow: 'Zwei Minuten, weitgehend automatisch',
    title: 'Domain hinzufügen',
    intro:
      'Kein Papierkram, kein Warten auf andere. Nur der erste Tag einer Geschichte, die wirklich dir gehört.',
    chooseDifferent: '← Anderen Weg wählen',
    yourDomain: 'Deine Domain',
    pathCloudflareTitle: 'Ich nutze Cloudflare',
    pathCloudflareDesc: 'Ein Klick — wir erledigen den Rest.',
    pathCloudflareBadge: 'Am schnellsten',
    pathManualTitle: 'Manuell hinzufügen',
    pathManualDesc:
      'Eine Zeile zum Einfügen, wo du deine Website verwaltest — GoDaddy, Namecheap oder ein anderer Anbieter.',
    pathManualBadge: 'Universell',
    pathToolTitle: 'Ich nutze ein E-Mail-Sicherheitstool',
    pathToolDesc: 'Postmark, EasyDMARC oder ähnlich — auf uns zeigen.',
    pathToolBadge: 'Vorhandenes Tool',
    whatDoesThisDo: 'Was bewirkt das?',
    cloudflareExplain:
      'Du meldest dich bei Cloudflare an, und wir fügen den Verifizierungs-Eintrag für dich hinzu. An deinem E-Mail-Versand ändert sich nichts.',
    toolIntro: 'Füge in den Einstellungen deines Tools dies als Berichtsziel hinzu:',
    toolExplain:
      'Dein Tool übernimmt bereits die E-Mail-Authentifizierung. Wenn du es hierher zeigst, sendet es uns zusätzlich eine Kopie des Verifizierungsergebnisses. An deinem E-Mail-Versand ändert sich nichts.',
    manualIntro:
      'Füge dies dort ein, wo du die Einstellungen deiner Website verwaltest (frage deinen Anbieter, wenn du unsicher bist):',
    manualExplain:
      'Dies ist ein DMARC-Eintrag — ein E-Mail-Sicherheitsstandard, den Mail-Anbieter bereits nutzen. Das Hinzufügen ändert nicht, wie du E-Mails sendest; es teilt Anbietern nur mit, uns auch eine Kopie des Verifizierungsergebnisses zu senden. Wenn du bereits einen hast, füge unsere Adresse hinzu, statt ihn zu ersetzen.',
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
  domains: {
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
    backRecords: 'Einträge',
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
    staging:
      'Frühe Vorschau — die Verifizierung läuft; die dauerhafte öffentliche Verankerung folgt bald.',
  },
  connectSuccess: {
    added: 'Hinzugefügt',
    cloudflare: 'Cloudflare',
    body: 'Hinzugefügt — mehr ist nicht nötig. Der Aufbau deines Eintrags hat gerade begonnen.',
    whatNext: 'Was als Nächstes passiert',
    next1: 'Eine unabhängige Prüfung kommt meist innerhalb eines Tages.',
    next2:
      'Das bestätigt alles und fügt diese Domain dem öffentlichen Eintrag hinzu. Mehr ist nicht zu klicken.',
    next3: 'Danach baut sich dein Vertrauenswert auf und aktualisiert sich von allein.',
    viewDomain: 'Ansehen',
    allRecords: 'Alle Einträge',
    missing: 'In diesem Link fehlte etwas — lass es uns erneut versuchen.',
    tryAgain: 'Erneut versuchen',
  },
  whitepaper: {
    eyebrow: 'PACT Protocol',
    title: 'Whitepaper',
    intro:
      'Das offene Protokoll hinter dem öffentlichen Eintrag — wie verifizierte Historie erfasst, veröffentlicht und gemessen wird.',
    source: 'Quellcode auf GitHub →',
    ready: 'Bereit zu starten?',
    addDomain: 'Domain hinzufügen',
    publicRecords: 'Öffentliche Einträge',
  },
  legal: {
    eyebrow: 'Rechtliches',
    lastUpdated: 'Zuletzt aktualisiert: 8. August 2026',
    termsTitle: 'Nutzungsbedingungen',
    privacyTitle: 'Datenschutzerklärung',
    terms: [
      {
        title: '1. Annahme der Bedingungen',
        body: 'Durch den Zugriff auf oder die Nutzung dieser Website (pact.pbm-labs.com) und verwandter Dienste, die unter der Marke „we build real“ betrieben werden, stimmst du diesen Nutzungsbedingungen zu. Wenn du nicht einverstanden bist, nutze die Website nicht und verbinde keine Domain.',
      },
      {
        title: '2. Wer wir sind',
        body: 'Diese Website wird von PBM Labs LLC („PBM Labs“, „wir“, „uns“) betrieben, einer Limited Liability Company nach dem Recht von Wyoming. Sie bietet öffentlichen Zugang zur Referenzimplementierung des PACT-Protokolls: Domain-Verbindung, einen öffentlichen Eintrag unabhängig verifizierter Domain-Historie und zugehörige Dokumentation.',
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
        body: 'Website-Inhalte, Marke und Design gehören PBM Labs LLC oder seinen Lizenzgebern, sofern nicht anders angegeben. Die Spezifikation des PACT-Protokolls und das Whitepaper werden offen zur Prüfung und Implementierung veröffentlicht; Implementierungen Dritter werden gefördert, vorbehaltlich ihrer eigenen Lizenzbedingungen, sofern anwendbar. Es werden keine Rechte gewährt außer dem beschränkten Recht, diese Website wie vorgesehen zu nutzen.',
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
        body: 'Rechtliche Mitteilungen und Fragen zu diesen Bedingungen: hello@pbm-labs.com.',
      },
    ],
    privacy: [
      {
        title: '1. Überblick',
        body: 'Diese Datenschutzerklärung erläutert, wie PBM Labs LLC Informationen verarbeitet, wenn du pact.pbm-labs.com und die PACT-Referenzdienste nutzt. PACT ist so gestaltet, dass seine primäre Datenquelle — DMARC-Aggregatberichte — keinen Nachrichteninhalt und keine persönlichen Identitäten enthält.',
      },
      {
        title: '2. Informationen, die wir verarbeiten',
        body: 'Domain- und Protokolldaten: Domainnamen, die du verbindest; Metadaten aus DMARC-Aggregatberichten (meldende Organisation, Zeitraum, Authentifizierungs-Pass/Fail-Zählungen, Selektor- und Infrastrukturkennungen in gehashter oder zusammengefasster Form); Merkle-Leaves, Roots und öffentliche Verifizierungsdaten. Daten aus dem Verbindungsablauf: Domain-Zeichenketten, die du übermittelst; bei Cloudflare-OAuth Tokens und Zoneninformationen, die nötig sind, um DNS in deinem Namen während dieser Sitzung zu aktualisieren. Browser-Einstellungen: Themenwahl im Local Storage deines Geräts. Wir betreiben auf dieser Website keine Verbraucher-Benutzerkonten oder Marketingprofile.',
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
        body: 'Datenschutzfragen: hello@pbm-labs.com.',
      },
    ],
  },
};
