# Canvas Rosters

Free web app to generate classroom rosters, seating charts, sign-in sheets, and grade books directly from your Canvas LMS.

## Features

✅ **Pull from Canvas** — Paste your Canvas API token and select a class
✅ **Custom seating charts** — Configure rows and columns
✅ **Multi-sheet exports** — Roster, seating chart, sign-in sheet, grade book
✅ **XLSX format** — Export as Excel (.xlsx) for easy import to Google Sheets
✅ **Local storage** — Optional password-protected token storage
✅ **Free & fast** — No backend, no subscriptions

## Get Started

1. Visit **[Canvas Rosters](https://canvasrosters.foiledbymath.com)**
2. Paste your Canvas API token
3. Select a class
4. Configure seating chart dimensions
5. Download your roster XLSX file
6. Import into Google Sheets or Excel

## How to Get Your Canvas API Token

1. Log in to Canvas
2. Go to **Settings** → **Approved Integrations**
3. Click **New Access Token**
4. Name it "Canvas Rosters" and generate
5. Copy the token and paste into the app

## What's Included

- **Roster Sheet:** Student names, IDs, emails, enrollment status
- **Seating Chart:** Grid layout with alphabetically sorted student names
- **Sign-In Sheet:** Date columns and signature lines
- **Grade Book:** Student names with empty columns for grades

## Privacy

Canvas Rosters is completely client-side:
- Your API token never leaves your browser
- All processing happens locally
- No account or login required
- No data stored on any server

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Build for production
```

## Built with

- React 18 + Vite
- Canvas API
- ExcelJS
- Crypto-JS

## Support

Questions or feedback? [Contact Foiled By Math](https://www.foiledbymath.com)

---

**Love Canvas Rosters?** Check out [Foiled By Math](https://www.foiledbymath.com) for more classroom tools.
