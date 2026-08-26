export const WHITEPAPER_DE = `
Identifikatoren sind billig. Eine Domain, ein Profil, ein Badge — all das lässt sich heute Nachmittag herstellen. Gestern nicht, wenn jemand anderes bereits zugesehen hat.

PACT ist ein öffentlicher Eintrag von Spuren, die unabhängige Systeme bereits emittieren. Mailsysteme erzeugen aggregierte Authentifizierungsberichte. Browser haben öffentliche Zertifikatslogs bereits verlangt. Softwaresignatur schreibt bereits ein öffentliches Log. Niemand tritt einem neuen Netz bei. DNS zeigt den Mail-Feed nur hierher. Der Eintrag veröffentlicht, was geschehen ist. Er entscheidet nicht, was es bedeutet.

Der Name ist Provenance of Accumulated Checkable Traces — Herkunft akkumuliert nachprüfbarer Spuren. Herkunft: die Spuren haben eine Quelle, die nicht dieser Betreiber ist. Akkumuliert: der Eintrag wächst mit der Zeit; er lässt sich nicht rückwärts füllen. Nachprüfbar: jede Person kann Inklusion gegen einen veröffentlichten Root neu berechnen.

Generative Modelle haben neue Identifikatoren und neue Dokumente billig gemacht. Gestern haben sie nicht billig gemacht. Der einzige Eintrag, der das übersteht, ist ein Eintrag, den jemand anderes bereits aufgeschrieben hat.

## Übrig gebliebene Spuren

Ein neues Identitätssystem bittet die Welt meist um ein neues Ritual: App installieren, eine Bescheinigung ausstellen, eine Zeremonie bestehen, einem neuen Aussteller vertrauen. Solche Systeme scheitern in der Skala, die zählt, weil die, die beitreten müssten, nicht auf ein weiteres Netz warten.

PACT zeichnet übrig gebliebene Spuren auf. Empfangende Mailsysteme emittieren bereits Berichte. Öffentliche Zertifikatslogs existieren bereits, weil Browser ein Ausstellungstagebuch verlangt haben. Rekor existiert bereits, weil die Software-Lieferkette ein Tagebuch signierter Artefakte wollte. Dieses Protokoll erfindet keinen Feed und bittet die Welt nicht, ihn zu füllen. Es behält, was ohnehin weggeworfen wird.

Mail, Zertifikate und Signaturen sind Restarten unterschiedlichen Ursprungs. Sie sitzen auf demselben append-only Baum, damit eine prüfende Person einen Root hat, gegen den sie neu rechnen kann. Sie werden nie zu einem Score vermischt. Eine spätere Restquelle kann als weitere getaggte Art hinzukommen. Jede Art behält ihr eigenes Preimage. Anwendungen dürfen die Felder interpretieren. Dieses Protokoll tut das nicht.

## Mailberichte

Jede institutionelle Domain, die Mail sendet, signiert sie bereits mit DKIM. Empfangssysteme — Gmail, Outlook, Yahoo und andere — validieren diese Signaturen bereits und emittieren bereits Aggregatberichte: ob authentifizierte Mail ankam, wie oft, aus welcher Infrastruktur, und laut wem.

Diese Berichte enthalten keine Nachrichten, keine Betreffzeilen, keine Postfächer, keine Personen. Sie sind Zusammenfassungen von Authentifizierungsergebnissen über einen Zeitraum. Privatsphäre ist hier strukturell. Die Pipeline sieht den Inhalt nie, also kann eine Richtlinie ihn später nicht versehentlich einsammeln.

Ein Name erhält einen Mail-Eintrag, indem DNS gezeigt wird. Ein Berichtsziel wird hinzugefügt, damit eine Kopie dieser Berichte behalten wird. Die bestehende Policy der Domain und andere Ziele bleiben. Am Senden und Empfangen von Mail ändert sich nichts. Die Historie beginnt, wenn der erste unabhängige Bericht eintrifft — nicht, wenn die DNS-Zeile gespeichert wird.

Jedes Mail-Leaf verpflichtet sich auf die Domain, den Berichtszeitraum, die meldende Organisation, Pass- und Fail-Zählungen und einen Hash des signierten Wrappers, der den Bericht getragen hat. Gefälschte Berichte kommen nicht hinein, weil der Wrapper authentifizieren muss und die meldende Organisation bekannt sein muss. Der Rohbericht wird nach der Extraktion verworfen.

## Zertifikatslogs

Certificate-Transparency-Logs zeichnen Ausstellung bereits auf. Sie existieren, weil Browser ein öffentliches Tagebuch verlangt haben, nicht weil dieses Protokoll jemanden ums Loggen gebeten hat. Ein Name, der dort erscheint, hat ein Erstes-Gesehen-Datum, das jemand anderes aufgeschrieben hat.

Ein neues Zertifikat kann in Minuten ausgestellt werden. Das ist ein schwacher Kalender, kein Beweis, dass HTTPS vertrauenswürdig ist, und keine Qualitätsaussage über das Zertifikat. Ein echtes Zertifikat kann einen Namen abdecken, den es gestern noch nicht gab.

Diese Seite indexiert öffentliche Logs, sobald der Name auf dem Ledger steht. Es gibt kein zweites Ritual. Das Subjekt kann bewirken, dass ein Zertifikat ausgestellt wird. Das Subjekt kann nicht das Log sein.

Zertifikats-Leaves tragen ein Erstes-Gesehen-Datum, Aussteller, Gültigkeitsfenster und Fingerprint. Sie teilen Baum und Leaf-Indexraum mit Mail- und Signatur-Leaves. Sie werden nie in diese Leaves zusammengeführt.

Die Referenz-Ingest liest einen öffentlichen Index über diese Logs, keinen Log-Betreiber. Das ist schwächer als der signierte Tree Head eines konkreten Logs. Es bleibt Restkalender aus Infrastruktur, die bereits existierte.

## Signaturlogs

Rekor zeichnet Metadaten signierter Software bereits auf. Es existiert, weil die Software-Lieferkette ein öffentliches Tagebuch wollte, nicht weil dieses Protokoll jemanden ums Loggen gebeten hat.

Eine neue Signatur kann so billig veröffentlicht werden wie ein neues Zertifikat. Das ist ein schwacher Kalender, kein Beweis, dass ein Name legitim ist, und keine Qualitätsaussage über die Software.

Diese Seite indexiert übrig gebliebene Rekor-Subjects — eine GitHub-URI, eine E-Mail oder einen Hostnamen — nicht eine verbundene Domain. Eine github.com-URI ist ein eigenständiges Leftover; sie deckt die Website eines Kunden nicht ab. Host-Leftover nutzt diesen Namen und seine www- und https-Formen. E-Mail-Leftover ist das genaue Postfach, das bereits im Log steht. Geratene Postfächer werden nicht gesucht. Leeres Hostname-Leftover ist erwartet.

Signatur-Leaves tragen eine Identität, eine integrierte Zeit und eine Entry-Id. Sie teilen Baum und Leaf-Indexraum mit Mail- und Zertifikats-Leaves. Sie werden nie in diese Leaves zusammengeführt.

Die Referenz-Ingest liest einen öffentlichen Index über Rekor, nicht Rekors eigenen Merkle-Beweis. Das ist schwächer als der signierte Tree Head des Logs. Es bleibt Restkalender aus Infrastruktur, die bereits existierte.

## Ein Baum, drei Arten

Drei Arten sind keccak256-Leaves in einem sparse Merkle-Baum. Bindings dürfen kein Preimage-Layout teilen, damit ein Mail-Leaf nicht mit einem Zertifikats-Leaf oder einem Signatur-Leaf desselben Namens kollidieren kann.

Die öffentliche Seite zeigt alle drei. Sie addiert sie nicht. Sie mittelt sie nicht. Sie erzeugt kein Badge. Wer eine Anwendung darauf baut, darf die Felder interpretieren. Sie in eine Zahl zu falten ist die Wahl dieser Anwendung, und es ist nicht dieses Protokoll.

## Jede Person kann prüfen

Jede Spur ist ein Leaf. Roots werden on-chain veröffentlicht, außerhalb dieses Betreibers, damit eine andere Vergangenheit nicht still ausgetauscht werden kann. Wer prüft, berechnet Inklusion gegen diesen Root neu: Leaf-Hash, Index, Geschwister-Hashes, veröffentlichter Root. Die Prüfung erfordert keinen Kontakt zu diesem Betreiber.

Mail-Leaves lassen sich weiter öffnen. Der Betreiber speichert den empfangenen Wrapper und einen DNS-Snapshot des DKIM-Schlüssels bei der Ingest. Wer prüft, hasht die gespeicherten Bytes gegen das Leaf und prüft, dass der Schlüssel erfasst war. Das ist keine Behauptung, dieser Betreiber sei ehrlich über Verfügbarkeit. Roots bezeugen Inklusion, nicht dass die Bytes morgen noch ausgeliefert werden.

## Zwei Uhren

Registrierung ist, wie lange der Name existiert. Bestätigt seit ist, wie lange dieser Eintrag Spuren sammelt. Sie werden nie zusammengelegt.

Ein acht Jahre alter Name, der heute verbunden wurde, hat eine lange Registrierungsuhr und eine Bestätigungsuhr bei null. Das ist erwartet. Wer DNS übernimmt, erbt das Registrierungsdatum und nichts von der Mail-Uhr. Beide zu mischen würde einem Entführer gestern leihen.

## Was die Seite zeigt

Die Seite ist absichtlich langweilig. Wie lange unabhängige Mail-Melder den Namen bestätigen. Wie viele Berichte. Von welchen Organisationen. Wann ein abdeckendes Zertifikat zuerst erschien. Wann eine abdeckende Signatur erschien. Uhren, Berichte, Organisationen, Zertifikatsdaten, Signatureinträge. Kein Score. Kein Badge. Kein Urteil.

## Was es nicht ist

Kein KYC. Keine Behauptung, ein Name sei legitim. Kein HTTPS-Badge. Kein Sigstore-Badge. Kein persönlicher Nachweis. Kein Ersatz für Register oder Auskunfteien. Kein Protokoll zur Dokumentauthentifizierung — es beantwortet, welche unabhängig bestätigte Historie für eine Domain veröffentlicht wurde, nicht ob eine bestimmte Nachricht oder ein Anhang echt ist.

Urteil bleibt draußen.

## Was heute wahr ist

Roots liegen auf Base Sepolia — Testnet, ein permissionierter Publisher. Dieser Betreiber hält die Leaves. Roots bezeugen Inklusion, nicht Verfügbarkeit.

Das ist die ehrliche Grenze. Die These wartet nicht auf Mainnet. Die Feeds, der Baum und die öffentliche Seite existieren bereits. Jede Person kann nachprüfen, was veröffentlicht ist.

PACT — Provenance of Accumulated Checkable Traces.

we build real ist die Bewegung. PACT ist das offene Protokoll. Die erste Referenzimplementierung ist diese Seite.
`.trim();
