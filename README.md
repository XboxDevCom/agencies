# DACH Agency Directory

Eine barrierefreie und übersichtliche Tabelle von Creator-Agenturen im DACH-Raum (Deutschland, Österreich, Schweiz). Diese Anwendung bietet eine einfache und zugängliche Möglichkeit, Agenturen nach verschiedenen Kriterien zu filtern und zu sortieren.

## 📸 Screenshots

### Hauptansicht
![Creator Agencies Main View](https://github.com/user-attachments/assets/30593dad-5493-4e39-8290-56b211c758c1)

*Übersichtliche Darstellung aller Creator-Agenturen mit umfangreichen Filter- und Sortierfunktionen*

## ♿ Barrierefreiheit (Accessibility)

Diese Anwendung wurde nach den **WCAG 2.1 AA Standards** entwickelt und bietet:

### 🎯 Kernfeatures für Barrierefreiheit
- **Vollständige Keyboard-Navigation** - Alle Funktionen sind ohne Maus bedienbar
- **Screen Reader Unterstützung** - Optimiert für NVDA, JAWS, VoiceOver und andere
- **Hoher Farbkontrast** - Mindestens 4.5:1 Kontrastverhältnis für bessere Lesbarkeit
- **Responsive Design** - Funktioniert auf allen Geräten und Bildschirmgrößen
- **Focus Management** - Klare visuelle Fokusindikatoren
- **ARIA Landmarks** - Strukturierte Navigation für assistive Technologien
- **Live Regions** - Dynamische Inhaltsänderungen werden angekündigt
- **Skip Links** - Schnelle Navigation zu Hauptinhalten

### ⌨️ Keyboard-Shortcuts
- `Tab` / `Shift+Tab` - Navigation zwischen Elementen
- `Enter` / `Space` - Aktivierung von Buttons und Links
- `Arrow Keys` - Navigation in Tabellen und Listen
- `Escape` - Schließen von Modals und Dropdowns
- `Home` / `End` - Sprung zum ersten/letzten Element

### 🔧 Accessibility Testing
```bash
# Automatisierte Accessibility-Tests ausführen
npm run test:a11y

# ESLint Accessibility-Regeln prüfen
npm run lint:a11y

# Vollständiges Accessibility-Audit
npm run audit:a11y
```

## Features

### 🏢 Creator-Agenturen Verzeichnis
- **Übersichtliche Darstellung** von Creator-Agenturen im DACH-Raum
- **Erweiterte Filterung** nach:
  - Agentur-Name (Volltext-Suche)
  - Fokus-Bereich
  - Plattformen
  - Referenzen
  - Status
  - Preismodell
  - Mindest-Follower-Anzahl
- **Sortierung** nach allen Spalten
- **Responsive Design** für Desktop, Tablet und Mobile
- **Modal-Details** für detaillierte Agentur-Informationen

### 📊 Investoren-Tipps Seite
- **Top 100 Unternehmen** aus Gaming, Tech und Infrastruktur
- **18 Premium-Unternehmen** mit detaillierten Dividenden-Informationen:
  - 5 Gaming-Unternehmen (Microsoft, EA, Nintendo, Sony, Take-Two)
  - 8 Tech-Unternehmen (Apple, Microsoft, NVIDIA, Meta, Intel, etc.)
  - 5 Infrastruktur-Unternehmen (Cell Towers, Data Centers)
- **Filterbare Ansicht** nach Sektor
- **Sortierbar** nach Dividendenrendite, Marktkapitalisierung oder Name
- **Detaillierte Unternehmensdaten**:
  - Ticker-Symbol und Börse
  - Marktkapitalisierung
  - Dividendenrendite
  - Ausschüttungshäufigkeit (monatlich/vierteljährlich/jährlich)
  - Analystenbewertungen (Buy/Hold/Sell)
  - 5-Jahres Dividendenwachstum
- **Investitions-Tipps** für Anfänger

### 💰 Dividenden-Rendite-Rechner
- **Netto-zu-Brutto Kalkulation** für passives Einkommen
- **Multi-Country Support**:
  - 🇩🇪 **Deutschland**: 
    - Kapitalertragsteuer (25%)
    - Solidaritätszuschlag (5,5%)
    - Krankenversicherung (14,6%) - optional
    - Rentenversicherung (18,6%) - optional
    - Sparer-Pauschbetrag (1.000€)
  - 🇺🇸 **USA**:
    - Federal Income Tax (durchschnittlich 22%)
    - Capital Gains Tax (15%)
    - Self-Employment Tax (15,3%)
    - Standard Deduction ($13.850)
  - 🇨🇭 **Schweiz**:
    - Einkommensteuer (variiert nach Kanton, ~20%)
    - Keine Kapitalertragssteuer für Privatanleger
    - AHV/IV/EO Beiträge (10,55%)
- **Automatische Portfolio-Generierung**:
  - Diversifiziert über High-Dividend Aktien
  - Berechnet benötigte Aktienanzahl
  - Zeigt monatliche und jährliche Dividenden
  - Portfolio-Gewichtung und -Allokation
- **Detaillierte Steueraufschlüsselung** für alle Abzüge

## Navigation

Die Anwendung verfügt über drei Hauptbereiche:

1. **`/`** - Creator-Agenturen Verzeichnis
2. **`/investor-tips`** - Investoren-Tipps & Top Unternehmen
3. **`/dividend-calculator`** - Dividenden-Rendite-Rechner

## Daten

Die Agentur-Daten werden aus einer CSV-Datei geladen und enthalten Informationen zu:
- Agentur-Name und Website
- Fokus-Bereiche und Spezialisierungen
- Unterstützte Social Media Plattformen
- Bekannte Referenzen und Kunden
- Geschäftsbedingungen
- Follower-Reichweite
- Status (aktiv/inaktiv)
- Rechtsform und Standort
- Gründungsjahr
- Abteilungen
- Zusätzliche Notizen

## Technologien

- **React 18** mit TypeScript
- **Tailwind CSS** für Styling
- **PapaParse** für CSV-Verarbeitung
- **React Helmet Async** für SEO
- **Axe-core** für Accessibility-Testing
- **ESLint jsx-a11y** für Accessibility-Linting

## Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm start

# Für Produktion bauen
npm run build

# Tests ausführen
npm test

# Accessibility-Tests
npm run test:a11y
```

## Entwicklung

### Code-Qualität
```bash
# TypeScript-Typen prüfen
npm run type-check

# ESLint ausführen
npm run lint

# ESLint mit Accessibility-Regeln
npm run lint:a11y
```

### Performance-Analyse
```bash
# Bundle-Größe analysieren
npm run analyze
```

### Testing
```bash
# Unit Tests
npm test

# Test Coverage
npm run test:coverage

# Accessibility Tests
npm run test:a11y
```

## Deployment

Die Anwendung wird automatisch auf GitHub Pages deployed:
https://xboxdevcom.github.io/agencys/

### Build-Prozess
1. TypeScript Kompilierung
2. Tailwind CSS Optimierung
3. Bundle Minimierung
4. Accessibility-Validierung
5. Deployment zu GitHub Pages

## Browser-Unterstützung

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Screen Readers**: NVDA, JAWS, VoiceOver, Dragon NaturallySpeaking
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet

## Accessibility-Standards

Diese Anwendung erfüllt:
- ✅ **WCAG 2.1 Level A** - Grundlegende Barrierefreiheit
- ✅ **WCAG 2.1 Level AA** - Erweiterte Barrierefreiheit
- ✅ **Section 508** - US-Bundesstandards
- ✅ **EN 301 549** - Europäische Standards

### Getestete assistive Technologien
- **NVDA** (Windows)
- **JAWS** (Windows)
- **VoiceOver** (macOS/iOS)
- **TalkBack** (Android)
- **Dragon NaturallySpeaking** (Sprachsteuerung)

## Beitragen

Beim Beitragen zu diesem Projekt beachte bitte:

1. **Accessibility First** - Alle neuen Features müssen barrierefrei sein
2. **Testing** - Führe Accessibility-Tests vor Pull Requests aus
3. **Documentation** - Dokumentiere Accessibility-Features
4. **Code Review** - Accessibility wird in Code Reviews geprüft

### Accessibility-Checklist für Contributors
- [ ] Keyboard-Navigation funktioniert
- [ ] Screen Reader-Tests durchgeführt
- [ ] Farbkontrast geprüft (min. 4.5:1)
- [ ] ARIA-Attribute korrekt verwendet
- [ ] Focus Management implementiert
- [ ] Automatisierte Tests bestanden

## 💼 Investitions-Features

### Verwendungszweck
Die Investitions-Features sind als Bildungswerkzeuge konzipiert, um Nutzern zu helfen:
- Die Grundlagen von Dividenden-Investitionen zu verstehen
- Verschiedene steuerliche Auswirkungen in verschiedenen Ländern zu vergleichen
- Realistische Finanzplanung für passives Einkommen durchzuführen
- Top-Unternehmen im Gaming-, Tech- und Infrastruktursektor zu entdecken

### Wichtiger Disclaimer
⚠️ **Keine Anlageberatung**: Die bereitgestellten Informationen dienen ausschließlich Bildungszwecken und stellen keine Anlageberatung dar. Konsultieren Sie immer einen qualifizierten Finanzberater, bevor Sie Anlageentscheidungen treffen.

### Datenquellen
- Unternehmensdaten und Dividendeninformationen basieren auf öffentlich verfügbaren Finanzberichten
- Steuersätze entsprechen den aktuellen Durchschnittswerten der jeweiligen Länder (Stand 2024)
- Marktdaten können sich ändern und sollten vor Investitionsentscheidungen verifiziert werden

### Berechnung-Methodik
Der Dividenden-Rechner verwendet:
1. **Netto-Einkommen**: Gewünschtes monatliches Netto-Einkommen
2. **Steuerliche Abzüge**: Land-spezifische Steuern und Abgaben
3. **Brutto-Dividenden**: Berechnetes jährliches Brutto-Dividenden-Einkommen
4. **Durchschnittliche Rendite**: Basierend auf High-Dividend Aktien (>2%)
5. **Portfolio-Allokation**: Diversifiziert über 8 Unternehmen mit unterschiedlichen Gewichtungen

### Beispiel-Rechnung (Deutschland, €1.200 netto/Monat):
- **Netto-Ziel**: €1.200/Monat = €14.400/Jahr
- **Kapitalertragsteuer**: 25% + 5,5% Soli = 26,375%
- **Gesamt-Abzüge**: ~26,375% (ohne freiwillige Versicherungen)
- **Brutto-Bedarf**: ~€19.560/Jahr
- **Bei 3% Dividendenrendite**: ~€652.000 Investition erforderlich

## Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## Support

Bei Accessibility-Problemen oder Fragen:
- 🐛 **Issues**: GitHub Issues für Bug Reports
- 📧 **Email**: accessibility@example.com
- 📖 **Docs**: Siehe `/docs/accessibility.md`

Bei Investitions-bezogenen Fragen:
- ℹ️ **Hinweis**: Wir bieten keine individuelle Anlageberatung an
- 📚 **Bildungsmaterial**: Nutzen Sie die bereitgestellten Ressourcen als Lernmaterial
- 💡 **Tipps**: Siehe die Investitions-Tipps auf der `/investor-tips` Seite

---

**Hinweis**: Diese Anwendung wird kontinuierlich auf Barrierefreiheit getestet und verbessert. Feedback von Nutzern assistiver Technologien ist sehr willkommen!
