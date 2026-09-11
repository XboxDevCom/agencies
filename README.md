# DACH Agency Directory

Agenturen, Creator-Netzwerke und verwandte Marketinganbieter im DACH-Umfeld. React-Anwendung unter [agencies.xboxdev.com](https://agencies.xboxdev.com), gepflegt von XboxDev und Huskynarr.

## Modernisierung September 2026

- Responsive Verzeichnisansicht mit Suchfeld, Filtern und Agenturprofilen.
- Filter für Schwerpunkt, Plattform, Land, Status und dokumentierte Vertrags-/Reichweitenangaben; Sortierung nach allen bisherigen Datenfeldern.
- Oberfläche auf Deutsch, Englisch, Französisch und Italienisch. Recherchetexte behalten ihre Ursprungssprache.
- 45 bestehende Einträge erhalten. Bei 38 Einträgen wurden konkrete Felder anhand von Primärquellen geprüft; sieben bleiben ungeklärt.
- Quellen, Prüfdatum und geprüfte Felder stehen direkt im Agenturprofil und in `public/data.csv`.
- Unbelegte Reichweiten, Vergütungsmodelle, Creator-Zuordnungen und Bedingungen wurden entfernt. Fehlende Werte bleiben unbekannt, einschließlich Gründungsjahr und Agenturtyp.
- Tastaturbedienbare Profile mit nativem Dialog, Fokus-Rückgabe und Escape zum Schließen.
- Ein gemeinsamer Prüf- und Veröffentlichungsablauf; keine konkurrierenden Deployments.

## Entwicklung

Node.js 22 und npm verwenden. Die bestehenden React-18-/TypeScript-/Create-React-App-Strukturen und der npm-Lockfile bleiben erhalten.

```bash
npm ci
npm start
npm run validate:data
npm run type-check
npm run lint:check
npm run test:ci -- --runInBand
npm run validate:translations
npm run build
```

Der Build liegt in `build/`. `scripts/copy-data.js` erhält den Domain-Eintrag und erzeugt direkte HTML-Einstiegspunkte für die bestehenden Unterseiten sowie `404.html`.

`npm run test:accessibility` prüft den gebauten Stand mit Puppeteer und axe über einen temporären HTTP-Server. Echte Datenzeilen müssen geladen sein. Der Test prüft Desktop/Mobilansichten, horizontales Überlaufen, das Profil und direkte Unterseiten. Er wird im GitHub-Workflow ausgeführt. JSDOM-Tests ersetzen keine visuelle oder manuelle Prüfung assistiver Technologien.

## Datenpflege

`public/data.csv` ist die Datenquelle. Die Schema- und Quellenprüfung läuft mit `npm run validate:data` und in CI.

| Feld | Bedeutung |
|---|---|
| `agency`, `url` | Öffentlicher Name und Website; unbekannte Identitäten werden nicht mit namensähnlichen Firmen zusammengeführt. |
| `focus`, `platforms` | Kommagetrennte, durch Quellen bestätigte Kategorien. |
| `country` | `DE`, `AT`, `CH`, `International` oder `unknown`; mehrere bestätigte Länder kommagetrennt. Länder beziehen sich auf dokumentierte Standorte, nicht nur Absatzmärkte. |
| `status`, `type`, `pricing_model` | `unknown`, solange das jeweilige Feld nicht belastbar bestätigt ist. Eine erreichbare Website bestätigt nicht automatisch den Unternehmensstatus. |
| `followers`, `founding_year` | Leere Zelle bedeutet unbekannt. Reichweite ist kein Aufnahmekriterium für Creator. |
| `source_urls` | Quellen-URLs mit `\|` getrennt. |
| `checked_at` | Datum der Quellenprüfung, `YYYY-MM-DD`. Kein automatisch gesetztes Tagesdatum beim Laden. |
| `verified_fields` | Kommagetrennte Liste der tatsächlich bestätigten CSV-Felder. |

Die Kennzeichnung „Mit Quellen geprüft“ bezieht sich nur auf die im Profil genannten Felder. Sie bestätigt keine Zusammenarbeit, Verfügbarkeit, Aufnahmebedingungen, rechtliche Qualität oder Empfehlung. Quellen sind überwiegend Selbstdarstellungen der Anbieter.

Alle Datensätze müssen einen eindeutigen Namen haben. HTTP(S)-Links werden geprüft; HTML-Fehlerseiten, beschädigte CSV-Dateien und Duplikate lösen einen sichtbaren Ladefehler aus. Suche und Filter greifen auf denselben Parser zurück.

Details und offene Identitäten: [DATA_REVIEW.md](DATA_REVIEW.md).

## Bestehende Zusatzseiten

- `/`: Agenturverzeichnis
- `/investor-tips`: bestehende Investoren-Seite, als Archiv gekennzeichnet
- `/dividend-calculator`: bestehender Rechner, als Archiv gekennzeichnet

Die Finanzseiten enthalten historische, ungeprüfte Kurs-, Rendite- und Steuerannahmen. Ihre Inhalte und Berechnungsmodelle wurden nicht fachlich aktualisiert. Sie stehen unter „Weitere Tools“ und dürfen nicht als aktuelle Finanzplanung verstanden werden.

## Veröffentlichung

`.github/workflows/ci-cd.yml` prüft Pull Requests und erstellt ein Build-Artefakt. Nach einem Push auf `main` wird genau dieses geprüfte Artefakt nach `gh-pages` veröffentlicht. CNAME: `agencies.xboxdev.com`. Der bisherige zweite Deployment-Workflow entfällt. Ein Pull Request allein veröffentlicht die Website nicht.

## Verbleibende technische Altlasten

Die kompatiblen Abhängigkeitsupdates im September 2026 haben den npm-Audit-Befund von 69 auf 34 Einträge reduziert und alle vier kritischen Befunde beseitigt. Es verbleiben 15 hohe, zehn mittlere und neun niedrige Meldungen, überwiegend in der alten Build-/Test-Werkzeugkette; auch React Router hat verbleibende mittlere Meldungen. Das ist keine Sicherheitsfreigabe. Eine vollständige Bereinigung erfordert gesondert getestete größere Versionswechsel, insbesondere der Create-React-App-Werkzeugkette. `npm audit fix --force` ist hier keine geeignete Reparatur: npm schlägt dabei unter anderem `react-scripts@0.0.0` vor.
