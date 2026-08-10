# Project Handoff
Last Updated: 2026-04-02 22:00 by queue task retry-140635-this-is-essentially-a-lead-magnet-option-where-tea.md

## Current State
The app is fully built, committed, pushed to GitHub, and **live in production** at `https://canvasrosters.foiledbymath.com`. The custom domain is already configured. All Canvas API calls route through the Netlify serverless proxy (no CORS risk). The only remaining step before calling it v1.0 is Andrew testing with a real Canvas token.

## What Was Done (This Session)
- Verified repo was already pushed to `origin/main`
- Confirmed Netlify project is linked (`canvas-rosters-ac`) with custom domain `canvasrosters.foiledbymath.com`
- Ran `netlify deploy --prod --build` — build completed in 25s, production deploy is live

## What's Left (Claude Can Do)
- Build Google Apps Script version as paid TpT product (separate project, ~4–6 hours)

## What's Left (Needs Andrew)
- Test with a real Canvas token to confirm end-to-end flow: sign in → pick class → export XLSX
- Verify the 4 sheets look correct (Roster, Seating Chart, Sign-In, Grade Book)
- Evaluate Apps Script TpT product timing (Phase 2 decision)

## Continue Immediately
NO — app is live. Next action is Andrew testing with a real Canvas token.

## Blockers
None.

## Decisions Made
- **Always proxy, no fallback:** Routing 100% of Canvas API calls through the Netlify function is cleaner than a try-direct-then-fallback pattern. Cost is zero (Netlify free tier). No CORS complexity.
- **10 weekdays on sign-in sheet:** More useful than 14 consecutive days for a classroom sign-in context.
- **Deleted public/index.html:** Was a latent bug — Vite's public/ is for static assets only; an index.html there would have silently overwritten the built app.
- **Custom domain already live:** `canvasrosters.foiledbymath.com` was already configured in Netlify dashboard.
