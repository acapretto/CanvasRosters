# HANDOFF — CanvasRosters (Canvas Roster Export)
**Updated:** 2026-08-21

## Last Session (2026-08-21)
Added the FBM feedback widget to `index.html` (slug `canvas-rosters`). Self-injecting floating
"Feedback" button, posts to the shared `product_feedback` Supabase table. Change is in the working
tree only; needs rebuild + Netlify deploy to go live. See global memory
`reference_feedback_widget.md` for the full reference.

## Previous Session (2026-08-10)
Made the tool work **without Canvas**, which was the single biggest limit on its reach.

- Added a source picker: connect Canvas (the existing token flow) **or** paste/upload a class list.
- `PasteRoster` component — textarea or CSV upload, live preview of every parsed name, and a
  first/last swap toggle so the teacher confirms the roster before it reaches the spreadsheet.
- `parseRoster` normalizes to the Canvas student shape so nothing downstream cares about the
  source. Handles "Last, First", "First Last", CSV with headers, tab paste from Excel, dedupes,
  and reports skipped lines. Parsing is entirely local — the class list is never uploaded.
- Also committed a pre-existing uncommitted XLSX-styling refactor found in the working tree.

**Why it mattered:** every free FBM tool required Canvas, but the audience arriving from YouTube
and teacher Facebook groups is mostly on Google Classroom, Schoology, or nothing. They hit a wall
on the first click.

## Current State
**Phase:** LIVE at `canvasrosters.foiledbymath.com`.

**Working:**
- Both paths verified end to end in a browser: pasted 6 names → preview → grid → seating →
  downloaded XLSX containing all four sheets and the pasted names. Zero Canvas calls on that path.
- Parser has 9 passing test cases.

**Broken / Incomplete:**
- **The Canvas token path has still never been tested with a real Canvas token.** It has been
  outstanding since April 2026. This is the oldest open item on the project.
- `tasks.md` is **badly stale** — Phases 1-4 are entirely unchecked but demonstrably built and
  live. Do not trust it as state; it is a historical build plan. Either refresh it or delete it.

## Next Steps (ordered)
1. Test the Canvas path with a real token (~15 min). Long overdue.
2. Refresh or delete `tasks.md` so it stops misrepresenting project state.
3. Consider Google Classroom OAuth import — **deferred, see below**.

## Open Decisions
- Whether to keep `tasks.md` at all, given HANDOFF.md now carries current state.

## Deferred Ideas
- **Google Classroom OAuth roster import.** Scope needed is `classroom.rosters.readonly`.
  Blocker is not the code: **unverified apps are capped at 100 users total**, which disqualifies
  it as a publicly-marketed free tool, and verification takes days-to-weeks (restricted scopes can
  additionally require a paid independent security assessment — I could not confirm which class
  this scope falls into). The CSV path already serves Google Classroom teachers today, so OAuth
  is a convenience upgrade, not a capability unlock. Revisit only if subscribers ask for it.

## Blocked On
- Nothing.

## Notes
- Delimiter detection is the subtle part of the parser: `"Smith, John"` and
  `"John Smith,js@x.edu"` both split into two comma-separated cells. Two-column comma input is
  disambiguated on **content** (does any cell look like an email or an ID?) rather than shape.
  Unit tests caught the naive version producing students named `js@x.edu John Smith`.
