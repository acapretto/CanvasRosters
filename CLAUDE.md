# Canvas Rosters — Project Instructions

## Quick Start
```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/13-FoiledByMath/CanvasRosters
npm install
npm run dev
```

## What This Is
A free web app that exports Canvas class rosters into XLSX spreadsheets with multiple pre-formatted sheets (roster, seating chart, sign-in sheet, grade book).

## Tech Stack
- **Framework:** React 18 + Vite
- **Build tool:** Vite
- **HTTP:** Axios
- **Export:** exceljs (XLSX generation)
- **Storage:** LocalStorage (API token + optional encrypted password)
- **Encryption:** crypto-js (optional password protection)
- **Hosting:** Netlify
- **Deployment:** GitHub push → Netlify auto-deploy

## Folder Structure
```
CanvasRosters/
├── CLAUDE.md                ← You are here
├── PRD.md                   ← Product requirements
├── TASKS.md                 ← Build plan
├── package.json             ← Dependencies
├── vite.config.js           ← Vite config
├── src/
│   ├── main.jsx             ← React entry point
│   ├── App.jsx              ← Main component
│   ├── components/
│   │   ├── TokenInput.jsx   ← API token form
│   │   ├── ClassSelector.jsx← Canvas class picker
│   │   ├── SeatingConfig.jsx← Rows/cols form
│   │   └── ExportButton.jsx ← XLSX generator
│   ├── utils/
│   │   ├── canvasApi.js     ← Canvas API calls
│   │   ├── excelGenerator.js← XLSX sheet creation
│   │   └── encryption.js    ← Password encryption
│   ├── styles/
│   │   └── App.css          ← FBM brand styles
│   └── App.css
├── public/
│   └── index.html           ← Main HTML
├── .gitignore
└── netlify.toml             ← Netlify config
```

## Key Conventions

| Convention | Detail |
|---|---|
| **API token storage** | LocalStorage (localStorage.setItem/getItem) |
| **Optional encryption** | crypto-js for password-protected token storage |
| **Canvas API** | User provides token; no backend auth needed |
| **Export format** | XLSX only (no Google Sheets API) |
| **Error handling** | Show user-friendly messages for API failures |
| **Brand** | Use FBM colors, fonts, logo from BrandKit |
| **Responsive** | Works on desktop + tablet (mobile secondary) |

## Canvas API Usage
**Endpoints used:**
- `GET /api/v1/courses` — List user's classes
- `GET /api/v1/courses/{id}/students` — Get class roster

**Headers:**
```javascript
Authorization: Bearer {token}
```

**Rate limits:** Canvas allows 120 requests/minute (plenty for this app).

## XLSX Sheet Structure

### Sheet 1: Roster
| Column | Source |
|---|---|
| Last Name | Canvas student.sortable_name |
| First Name | Canvas student.name |
| Student ID | Canvas student.id |
| Email | Canvas student.email |
| Enrollment Status | Canvas enrollment.enrollment_state |

### Sheet 2: Seating Chart
- Grid layout (user-configured rows × columns)
- Students sorted alphabetically by last name
- Empty grid cells for student placement
- Designed for teacher to fill in names manually or print + cut

### Sheet 3: Sign-In Sheet
- Date columns (days of week, 2 weeks by default)
- Student names on left (alphabetically sorted)
- Blank signature lines

### Sheet 4: Grade Book
- Student names (alphabetically)
- Empty columns for assignment names + grades
- Color-coded header row (FBM navy)

## Deployment

### GitHub → Netlify (Auto-Deploy)
1. Push to `main` branch
2. Netlify automatically deploys
3. Live at `https://canvasrosters.netlify.app` (or custom domain)

**Netlify CLI commands:**
```bash
# Deploy to Netlify
netlify deploy --prod

# Check deployment status
netlify status
```

**GitHub CLI commands:**
```bash
# Create remote repo from CLI
gh repo create CanvasRosters --public --source=. --remote=origin --push

# View repo
gh repo view

# Create issue
gh issue create --title "Feature: ..."
```

## Privacy & Security
- **No backend:** No data leaves user's computer except Canvas API calls
- **Optional password:** Users can encrypt API token locally
- **Token storage:** localStorage (browser cache) — users should clear if using shared computer
- **Deprecate immediately:** If Canvas changes API, update token prompt

## How to Extend
- **AppScript integration (v2):** Add option to deploy AppScript to user's Google account
- **Direct Google Sheets (v2):** Use Google Sheets API (user provides API key)
- **Custom templates (v2):** Let users design their own sheet layouts
- **Bulk export (v2):** Export all classes at once

## Troubleshooting
- **"Unauthorized" error:** Canvas token expired or invalid → prompt for new token
- **Slow export:** Optimize exceljs workbook creation (cache headers, avoid loops)
- **localStorage full:** Warn user if token storage fails

## Questions?
Refer to PRD.md for features, TASKS.md for build phases.
