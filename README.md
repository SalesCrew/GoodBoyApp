# Mitarbeiter-Vertragsverwaltung

Eine minimalistische Web-Anwendung zur Verwaltung von Mitarbeiterdaten und automatischen Generierung von Dienstverträgen.

## Features

- Mitarbeiter hinzufügen (Name, Adresse, Geburtsdatum)
- Lokale Speicherung im Browser (localStorage)
- Excel-Export aller Mitarbeiterdaten
- ZIP-Export mit personalisierten Dienstverträgen

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Öffnen Sie [http://localhost:3000](http://localhost:3000) im Browser.

## Dienstvertrag-Vorlage

Legen Sie Ihre Word-Vorlage als `public/template.docx` ab. Die Vorlage kann folgende Platzhalter enthalten:

- `{vollstaendigerName}` - Vollständiger Name
- `{strasse}` - Straße und Hausnummer
- `{plz}` - Postleitzahl
- `{stadt}` - Stadt
- `{geburtsdatum}` - Geburtsdatum (TT.MM.JJJJ)

## Deployment

Die App ist für Vercel optimiert:

```bash
npm run build
```

Oder direkt über das Vercel Dashboard deployen.

## Technologien

- Next.js 14 (App Router)
- Tailwind CSS
- localStorage für Datenpersistenz
- docxtemplater für Word-Generierung
- xlsx für Excel-Export
- jszip für ZIP-Erstellung
