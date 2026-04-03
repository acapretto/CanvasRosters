# Canvas Rosters — Lessons Learned

- [2026-04-01] Vite requires index.html at the project root, not in public/. The public/ folder is for static assets only (favicon, etc.). Original setup had it wrong — had to create root-level index.html for build to work.

- [2026-04-01] Canvas API domain is school-specific — never hardcode canvas.instructure.com. Each district/school has its own subdomain (school.instructure.com) or custom domain. Always make domain a user-configurable input.

- [2026-04-01] CORS is an unknown risk. Canvas API calls from the browser may be blocked by some school instances. This must be tested with a real token before launch. If blocked, a Netlify serverless function proxy is the fix.

- [2026-04-01] exceljs bundles to ~1.2MB. The chunk size warning is expected and acceptable for v1. If load time becomes an issue, switch to dynamic import() for the excelGenerator module.

- [2026-04-01] Web App vs. Apps Script: These are complementary products, not competing. The web app is a free lead magnet (FBM brand, conversion funnel). A Google Apps Script version is a viable paid TpT SKU ($5-8) that sidesteps CORS entirely by running server-side. Build web app first, Apps Script second.

- [2026-04-01] No AI needed here. The entire Canvas Rosters workflow is deterministic: fetch data, sort alphabetically, format cells. Evaluating AI for this type of tool is a distraction — programmatic logic is always correct for purely structural data transformation tasks.
