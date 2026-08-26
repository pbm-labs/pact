import type { Dictionary } from '../types';

export const de: Dictionary = {
  nav: {
    language: 'Sprache',
    intake: 'Mail-Intake',
    whitepaper: 'Whitepaper',
  },
  footer: {
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
    ledger: 'Ledger',
    contact: 'Kontakt',
  },
  common: {
    home: 'Start',
    continue: 'Weiter',
    copy: 'Kopieren',
    copied: 'Kopiert',
    loading: 'Laden…',
    toggleTheme: 'Theme umschalten',
  },
  home: {
    heroTitle: 'KI kann alles fälschen.',
    heroAccent: 'Außer gestern.',
    lede: 'PACT erfasst Leftover für Agenten. Die Abfrage ist Art plus Identität. PACT entscheidet nicht.',
    kindMail: 'Mail',
    kindCt: 'Zertifikate',
    kindRekor: 'Signaturen',
    hintMail: 'Absendedomain (header_from)',
    hintCt: 'Hostname in SAN/CN',
    hintRekor: 'Rekor-Leftover-Subjekt — GitHub-URI, E-Mail oder Host',
    identityLabel: 'Identität',
    lookup: 'Nachschlagen',
    empty: 'Null Zeilen. Dieses Log hat unter dieser Identität kein Leftover.',
    invalid: 'Diese Identität gilt nicht für diese Art.',
    echo: 'Nachgeschlagen',
    failed: 'Das Ledger war nicht erreichbar.',
    aside: 'Kein Score. Keine Mischung. Leer ist eine Antwort. Das Urteil bleibt draußen.',
  },
  connect: {
    backHome: '← Start',
    eyebrow: 'Mail-Intake',
    title: 'Mail-Leftover behalten',
    intro:
      'Füge ein Berichtsziel hinzu, damit unabhängige DMARC-Berichte behalten werden. Das ist kein Profil. Zertifikate und Signaturen werden über ihre eigenen Identitäten abgefragt.',
    yourDomain: 'Absendedomain',
    pathCloudflareTitle: 'Ich nutze Cloudflare',
    pathCloudflareDesc: 'Ein Klick — wir setzen die DNS-Zeile.',
    pathManualTitle: 'Manuell hinzufügen',
    pathManualDesc:
      'Eine Zeile zum Einfügen, wo du DNS verwaltest — GoDaddy, Namecheap oder ein anderer Host.',
    pathToolTitle: 'Ich nutze schon ein Tool',
    pathToolDesc: 'Postmark oder ähnlich — diese Adresse als Berichtsziel hinzufügen.',
    putOnLedger: 'Auf das Ledger setzen',
    ledgerExplain:
      'Registriert die Absendedomain, damit Mailberichte nicht verworfen werden. Es hängt kein GitHub-Leftover und kein Signaturlog an diese Website.',
    backToPaths: 'Methode wählen',
    whatDoesThisDo: 'Was macht das?',
    cloudflareExplain:
      'Du meldest dich bei Cloudflare an und wir fügen PACT als Berichtsziel in DNS hinzu, damit Mail-Leftover behalten wird. Danach gibt es kein Domain-Profil.',
    toolIntro: 'In den Einstellungen deines Tools dies hinzufügen:',
    toolExplain:
      'Dein Tool sammelt bereits Berichte für diese Domain. Diese Adresse nimmt uns in das Mail-Leftover auf. Setze die Absendedomain zuerst auf das Ledger. Historie beginnt, wenn der erste unabhängige Bericht eintrifft (meist 24–48 Stunden).',
    manualIntro:
      'Füge dies dort ein, wo du das DNS deiner Website verwaltest (frage den Host, wenn du unsicher bist):',
    manualExplain:
      'Eine Zeile, damit unabhängige Empfangssysteme Aggregatberichte hierher senden. Wenn du schon eine ähnliche Zeile hast, füge unsere Adresse hinzu statt sie zu ersetzen. Setze die Absendedomain zuerst auf das Ledger. Historie beginnt, wenn der erste unabhängige Bericht eintrifft (meist 24–48 Stunden).',
    doneTitle: 'Mail-Intake ist an.',
    doneBody:
      'Die Absendedomain ist auf dem Ledger. Behalte die DNS-Zeile. Mail-Leftover erscheint, wenn der erste unabhängige Bericht eintrifft — nicht beim Absenden dieses Formulars. Abfrage als kind=mail.',
    doneNext: 'Ledger abfragen',
    errors: {
      invalid_domain: 'Gib eine gültige Domain ein (z. B. example.com).',
      server_config: 'Dem Server fehlt CONNECT_STATE_SECRET oder Ledger-Schreibzugang.',
      oauth_not_configured: 'Cloudflare-Anmeldung ist auf diesem Server nicht konfiguriert.',
      missing_code: 'Die Anmeldung wurde abgebrochen oder nicht abgeschlossen.',
      invalid_state: 'Sitzung abgelaufen — bitte erneut versuchen.',
      token_exchange: 'Verbindung zu Cloudflare konnte nicht abgeschlossen werden.',
      zone_not_found:
        'Diese Domain war in dem gewählten Cloudflare-Konto nicht. Versuche ein anderes Konto.',
      dmarc_update:
        'Automatisches Einrichten ist fehlgeschlagen. Nutze die manuelle Option.',
      register: 'Fast — der letzte Schritt ist fehlgeschlagen. Bitte erneut versuchen.',
      somethingWrong: 'Etwas ist schiefgelaufen.',
    },
  },
  whitepaper: {
    eyebrow: 'PACT',
    title: 'Whitepaper',
    subtitle: 'Herkunft akkumuliert nachprüfbarer Spuren',
    updated: 'August 2026',
  },
  legal: {
    eyebrow: 'Rechtliches',
    lastUpdated: 'Zuletzt aktualisiert: 26. August 2026',
    termsTitle: 'Nutzungsbedingungen',
    privacyTitle: 'Datenschutzerklärung',
    emailLabel: 'E-Mail',
    terms: [
      {
        title: '1. Annahme der Bedingungen',
        body: 'Durch den Zugriff auf oder die Nutzung dieser Website (webuildreal.dev) und verwandter Dienste der Bewegung we build real stimmst du diesen Nutzungsbedingungen zu. Wenn du nicht einverstanden bist, nutze die Website nicht und reiche keine Absendedomain für Mail-Intake ein.',
      },
      {
        title: '2. Wer wir sind',
        body: 'Diese Website ist das öffentliche Zuhause von we build real, einer Bewegung für überprüfbare Geschichte. PACT ist ein offenes Protokoll. PBM Labs LLC („wir“, „uns“), eine Limited Liability Company nach dem Recht von Wyoming, stellt die erste PACT-Referenzimplementierung bereit. Die Website dokumentiert diese Implementierung und bietet Mail-Leftover-Intake. Prüfbares Leftover liegt auf der öffentlichen Ledger-API, nicht in einem menschlichen Domain-Profil.',
      },
      {
        title: '3. Der Dienst',
        body: 'PACT erfasst Restspuren, die unabhängige Systeme bereits emittieren, und schreibt sie in einen nur anhängenden Merkle-Baum. Jede Restquelle ist eine eigene Art auf diesem Baum. Mail-Leftover stammt aus DMARC-Aggregatberichten. Zertifikat-Leftover stammt aus öffentlichen Certificate-Transparency-Logs. Signatur-Leftover stammt aus dem öffentlichen Rekor-Log, keyed nach Leftover-Subject (GitHub-URI, E-Mail oder Host) — nicht nach einer verbundenen Website. Arten werden nicht zu einem Score vermischt. Mail-Intake setzt eine Absendedomain auf das Ledger und erfordert, PACT als Berichtsziel in DNS hinzuzufügen. Wir lesen keine Nachrichteninhalte, Empfängeridentitäten oder Postfachdaten.',
      },
      {
        title: '4. Öffentliches Ledger',
        body: 'Informationen auf dem Ledger — einschließlich Leftover-Identitäten, unabhängig bestätigter Historie und kryptografischer Nachweise — sind zur öffentlichen Einsicht und Abfrage durch Agenten bestimmt. Reiche keine Absendedomain ein, wenn du nicht berechtigt bist, die Authentifizierungs-Metadaten dieser Domain Teil eines öffentlichen Ledgers werden zu lassen.',
      },
      {
        title: '5. Deine Verantwortlichkeiten',
        body: 'Du darfst nur Absendedomains einreichen, die du kontrollierst oder zu deren Verwaltung du berechtigt bist. Du bist verantwortlich für die Richtigkeit der DNS-Änderungen, die du vornimmst, für die Einhaltung deiner eigenen Richtlinien und geltenden Rechts sowie dafür, den Dienst nicht zur Belästigung, zum Betrug oder zur Irreführung anderer zu nutzen. Unbefugter Zugriff, Störung des Dienstes, Scraping, das ihn beeinträchtigt, das Einschleusen von Malware oder sonstiger Missbrauch der Website sind untersagt.',
      },
      {
        title: '6. Keine Beratung; keine Garantie der Legitimität',
        body: 'Historie und kryptografische Nachweise sind ein informativer Eintrag von Restspuren unabhängiger Systeme — Mailberichte, öffentliche Zertifikatslogs und öffentliche Signaturlogs — als getrennte Arten. Sie sind keine rechtliche, finanzielle, Compliance- oder Geschäftsberatung und garantieren nicht, dass ein Name, eine Organisation oder Person legitim, sicher für Transaktionen oder risikofrei ist. Das Urteil bleibt außerhalb des Eintrags. Du bleibst allein für deine eigenen Entscheidungen verantwortlich.',
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
        body: 'Die Website und der Dienst werden „wie besehen“ und „wie verfügbar“ ohne Gewährleistungen jeglicher Art bereitgestellt, ausdrücklich oder stillschweigend, einschließlich der Marktgängigkeit, der Eignung für einen bestimmten Zweck und der Nichtverletzung. Wir garantieren nicht, dass der Dienst ununterbrochen, fehlerfrei, vollständig oder sicher ist oder dass veröffentlichte Roots oder Nachweise deine Anforderungen erfüllen.',
      },
      {
        title: '11. Haftungsbeschränkung',
        body: 'Soweit gesetzlich zulässig, haften PBM Labs LLC und seine Mitglieder, Organe und Auftragnehmer nicht für indirekte, zufällige, besondere, Folgeschäden oder Strafschadensersatz aus deiner Nutzung der Website oder des Dienstes, einschließlich des Vertrauens auf das öffentliche Ledger, auch wenn auf die Möglichkeit solcher Schäden hingewiesen wurde.',
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
        body: 'Diese Datenschutzerklärung erläutert, wie PBM Labs LLC Informationen verarbeitet, wenn du webuildreal.dev nutzt — das öffentliche Zuhause der Bewegung we build real und der ersten Referenzimplementierung des offenen PACT-Protokolls. PACT erfasst Restspuren: DMARC-Aggregatberichte, Metadaten öffentlicher Certificate-Transparency-Logs und Metadaten des öffentlichen Rekor-Logs. Aggregat-Mailberichte enthalten keinen Nachrichteninhalt und keine persönlichen Identitäten. CT- und Rekor-Daten sind bereits öffentlicher Log-Exhaust, einschließlich Rekor-Identitäten, die in diesem Log bereits veröffentlicht waren.',
      },
      {
        title: '2. Informationen, die wir verarbeiten',
        body: 'Domain- und Protokolldaten: Absendedomains, die für Mail-Intake eingereicht werden; Metadaten aus DMARC-Aggregatberichten; Certificate-Transparency-Erstgesehen-Metadaten aus öffentlichen Logs; übrig gebliebene Rekor-Subjects wie bereits geloggt (GitHub-URI, E-Mail oder Host); Merkle-Leaves, Roots und öffentliche Verifizierungsdaten. Intake-Ablauf: Domain-Zeichenketten, die du übermittelst; bei Cloudflare-OAuth Tokens und Zoneninformationen für DNS in deinem Namen. Browser-Einstellungen: Theme und Sprache im Local Storage. Wir betreiben keine Verbraucher-Benutzerkonten oder Marketingprofile.',
      },
      {
        title: '3. Was wir nicht erheben',
        body: 'Wir greifen über das PACT-Protokoll nicht auf E-Mail-Nachrichtentexte, Betreffzeilen, Empfängeridentitäten oder Postfachinhalte zu und speichern sie nicht. Aggregatberichte, die das Protokoll nutzt, sind konzeptionell keine personenbezogenen Daten.',
      },
      {
        title: '4. Wie wir Informationen nutzen',
        body: 'Wir nutzen die oben genannten Informationen, um Mail-Leftover-Intake zu betreiben, unabhängig bestätigte Historie aufzunehmen und zu veröffentlichen, kryptografische Nachweise zu pflegen, Missbrauch zu verhindern und die Zuverlässigkeit des Dienstes zu verbessern. Ledger-Felder werden veröffentlicht, damit jeder — einschließlich Agenten — nachprüfen kann, was geschehen ist.',
      },
      {
        title: '5. Öffentliches Ledger',
        body: 'Leftover-Identitäten und ihre unabhängig bestätigte Historie sowie Nachweise sind zur Öffentlichkeit auf der Ledger-API bestimmt. Reiche keine Absendedomain ein, wenn du nicht verstehst, dass zugehörige Authentifizierungs-Metadaten in einem öffentlichen Ledger erscheinen. Diese Website veröffentlicht kein menschliches Evidenz-Ranking.',
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
        body: 'Daten des öffentlichen Ledgers werden aufbewahrt, um die Integrität des nur anhängenden Eintrags zu wahren. Betriebsprotokolle und Intake-Sitzungsdaten werden nur so lange aufbewahrt, wie es für Betrieb, Absicherung und Fehlersuche des Dienstes sowie zur Erfüllung rechtlicher Pflichten erforderlich ist.',
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
