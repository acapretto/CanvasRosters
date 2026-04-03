# Project Handoff
Last Updated: 2026-04-01 16:49 by queue task 000-go-retry-140635-this-is-essentially-a-lead-magnet-option-where-tea.md

## Current State
The web app is fully built (Phases 1–4 complete) and ready for live testing. A strategic evaluation was completed this session: the web app and a future Google Apps Script TpT product are complementary, not competing — ship the web app now, build the Apps Script later as a paid item.

## What Was Done (This Session)
- Strategic evaluation: Web App vs. Google Apps Script vs. AI — wrote full tradeoff analysis delivered directly to user
- Decision: Ship web app as free lead magnet; plan Apps Script as future paid TpT SKU ($5–8)
- Confirmed: No AI needed — fully deterministic programmatic logic is correct for both versions
- Identified CORS testing as the single blocking unknown before launch

## What's Left (Claude Can Do)
- Add Netlify proxy function (if CORS test fails) — 15-line serverless function in `netlify/functions/canvas-proxy.js`
- Filter sign-in sheet to weekdays only (excelGenerator.js — minor fix)
- Delete dead `public/index.html` (replaced by root-level index.html)
- Build Google Apps Script version as TpT product (separate project, ~4–6 hours)
- Connect GitHub repo to Netlify for auto-deploy (needs Netlify CLI or dashboard — can use `netlify link` then `netlify deploy --prod`)

## What's Left (Needs Andrew)
- Test with real Canvas token to confirm CORS works
- Approve Netlify deployment (run `netlify deploy --prod` or connect GitHub auto-deploy in Netlify dashboard)
- Decide on custom domain: `canvasrosters.foiledbymath.com` or `canvasrosters.netlify.app`
- Evaluate Apps Script TpT product timing (Phase 2 decision)

## Continue Immediately
NO — blocked on Andrew testing with real Canvas token before deployment makes sense.

## Blockers
- CORS: Canvas API from browser may be blocked by school network policies. Must test with real token before launch. If blocked, Claude can add Netlify proxy function in ~30 min.
- No Canvas token available to Claude — live API testing not possible.

## Decisions Made
- **Web App ships first:** Already built, zero additional work needed if CORS works. FBM brand visibility + conversion funnel value outweighs Apps Script simplicity.
- **Apps Script = separate paid TpT product:** Not a replacement for the web app — a different SKU targeting Google Sheets native users. $5–8 price point, ~4–6 hours to build.
- **No AI needed:** Fully deterministic — Canvas data in, formatted spreadsheet out. AI would add cost with zero user value.
- **CORS is the only unknown:** Netlify proxy function is the fix if needed.
