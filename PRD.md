# Canvas Rosters — PRD

## Overview
A free web app that helps teachers quickly generate classroom rosters, seating charts, sign-in sheets, and grade books directly from their Canvas LMS. Designed to reduce manual data entry and encourage trial of Foiled By Math paid tools.

## Problem
Teachers spend time copying student data from Canvas into spreadsheets to create seating charts, rosters, and other classroom materials. They want a fast, one-click solution.

## Solution
Canvas Rosters pulls student data from Canvas (via teacher-provided API token), lets them configure a seating chart layout, and exports a ready-to-use XLSX file with multiple formatted sheets.

## User Journey
1. **Input:** Paste Canvas API token (optionally save locally with password encryption)
2. **Select:** Pick a Canvas class
3. **Configure:** Choose seating chart dimensions (rows × columns)
4. **Export:** Download XLSX with 4 sheets:
   - **Roster:** Clean student data (name, ID, email, etc.)
   - **Seating Chart:** Students alphabetically sorted, placed in grid
   - **Sign-In Sheet:** Formatted with date columns and signature line
   - **Grade Book:** Column headers for grades, organized alphabetically
5. **Use:** Import into Google Sheets or Excel, customize as needed

## Target User
Secondary math teachers (grades 6–12) who use Canvas and want to save 10–15 minutes per class.

## Scope — v1 (Free)
- Canvas API token input (no backend storage)
- Optional local encryption with password (localStorage)
- Fetch classes from Canvas API
- Student data pull (name, ID, email, enrollment status)
- XLSX export with 4 pre-formatted sheets
- No Google Sheets integration (user imports themselves)
- No AppScript integration (future paid feature)

## Out of Scope — v1
- Backend API or database
- Google Sheets direct export
- AppScript automation
- Multi-user accounts
- Canvas SSO login

## Success Metrics
- ✅ Zero backend infrastructure cost
- ✅ Fast load/export (< 30 seconds for 150 students)
- ✅ Encourages discovery of other Foiled By Math tools
- ✅ GitHub stars/forks
- ✅ User feedback for v2 features

## Technical Stack
- **Frontend:** React 18 + Vite
- **APIs:** Canvas REST API (read-only, user-provided token)
- **Export:** XLSX (exceljs or xlsx library)
- **Storage:** LocalStorage (API token + optional encrypted password)
- **Hosting:** Netlify (zero-cost tier)
- **Deployment:** GitHub → Netlify auto-deploy

## Monetization Path
- **v1:** Free (lead magnet for Foiled By Math products)
- **v2 (Paid):** AppScript integration, direct Google Sheets export, custom branding, bulk export

## Brand Guidelines
Apply **Foiled By Math** brand kit: `/Users/acapretto/Library/Mobile Documents/com~apple~CloudDocs/13-FoiledByMath/BrandKit/finalbrandassets`
- Colors: Navy (#141D37), Pink (#EC5D82), Orange (#FF8C42)
- Fonts: Clash Display (headers), Plus Jakarta Sans (body)
- Tone: Teacher-to-teacher, direct, helpful
