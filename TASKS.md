# Canvas Rosters — Build Plan (TASKS)

## Phase 1: Foundation & Canvas API Integration
**Goal:** Wire up Canvas API, verify token auth works, fetch classes and students.

- [ ] **P1.1** Create Vite project scaffold
  - `npm create vite@latest CanvasRosters -- --template react`
  - Configure build, dev server, ESM

- [ ] **P1.2** Create TokenInput component
  - Form to paste Canvas API token
  - Optional "Save token locally" checkbox
  - Basic validation (token format check)

- [ ] **P1.3** Implement Canvas API wrapper (canvasApi.js)
  - `getClasses(token)` — fetch user's Canvas courses
  - `getStudents(token, courseId)` — fetch course roster
  - Error handling (401 Unauthorized, network errors)
  - Rate limit handling

- [ ] **P1.4** Create ClassSelector component
  - Display list of user's Canvas classes
  - Allow selection via dropdown or radio
  - Show class ID + section name

- [ ] **P1.5** Test Canvas API integration
  - Manual test with real Canvas token
  - Verify data fetched correctly
  - Test error cases (bad token, no classes)

**Output:** App can authenticate with Canvas and fetch student data.

---

## Phase 2: UI Flow & Seating Configuration
**Goal:** Build the full user journey (token → class → seating config → export).

- [ ] **P2.1** Create SeatingConfig component
  - Input: rows (1–20) and columns (1–20)
  - Validation (must be positive integers)
  - Visual preview of grid size

- [ ] **P2.2** Create ExportButton component
  - Trigger XLSX generation
  - Show loading state while exporting
  - Success/error messages

- [ ] **P2.3** Build App.jsx workflow
  - Step 1: Token input (show ClassSelector if token valid)
  - Step 2: Class selection (show SeatingConfig if selected)
  - Step 3: Seating config (show ExportButton if configured)
  - Step 4: Export + download

- [ ] **P2.4** Implement localStorage encryption (encryption.js)
  - If "Save token" checked: encrypt with user password
  - If "Save token" unchecked: forget token after export
  - Decrypt on app load if encrypted token exists
  - Use crypto-js for encryption

- [ ] **P2.5** Add FBM branding to UI
  - Apply brand colors (Navy, Pink, Orange)
  - Use Plus Jakarta Sans (body), Clash Display (headers)
  - Add Foiled By Math logo (small, bottom-left)
  - Responsive design (mobile-first, but desktop-focused)

**Output:** Full user journey works. Users can export XLSX.

---

## Phase 3: XLSX Generation
**Goal:** Create beautiful, ready-to-use spreadsheets with all 4 sheets.

- [ ] **P3.1** Implement Sheet 1: Roster
  - Headers: Last Name, First Name, Student ID, Email, Enrollment Status
  - Data from Canvas API
  - Clean formatting (borders, font sizes)
  - Freeze header row

- [ ] **P3.2** Implement Sheet 2: Seating Chart
  - Grid layout (user-configured rows × columns)
  - Students sorted alphabetically by last name
  - Grid cells populated with student names (or numbers 1–n)
  - Print-friendly layout with borders

- [ ] **P3.3** Implement Sheet 3: Sign-In Sheet
  - Left column: Student names (alphabetically)
  - Remaining columns: Date headers (auto-generate 2 weeks)
  - Blank cells for sign-in
  - Header row styled

- [ ] **P3.4** Implement Sheet 4: Grade Book
  - Column A: Student names (alphabetically)
  - Remaining columns: Empty (for assignment names/grades)
  - Navy header row with bold font
  - Freeze panes (name column + header row)

- [ ] **P3.5** Optimize exceljs performance
  - Cache headers/styles to avoid duplicate creation
  - Test with large class (~150 students)
  - Minimize memory usage

- [ ] **P3.6** Test XLSX output
  - Download, open in Excel + Google Sheets
  - Verify formatting, data accuracy
  - Test with different class sizes

**Output:** XLSX files are beautiful, formatted, ready to use.

---

## Phase 4: Error Handling & UX Polish
**Goal:** Graceful errors, helpful messages, edge cases handled.

- [ ] **P4.1** Handle Canvas API errors
  - 401 Unauthorized → "Your token expired. Please paste a new one."
  - 404 Not Found → "Class not found."
  - Network errors → "Check your internet connection."
  - Rate limiting → "Canvas busy. Try again in a moment."

- [ ] **P4.2** Handle edge cases
  - Classes with 0 students
  - Very large classes (500+ students)
  - Special characters in names
  - Missing email addresses

- [ ] **P4.3** UX polish
  - Loading states (spinners, "Fetching classes...")
  - Disable buttons during API calls
  - Clear success messages ("Downloaded: Class_Rosters.xlsx")
  - Helpful tooltips for confusing fields

- [ ] **P4.4** Accessibility
  - Tab navigation works
  - Color contrast (WCAG AA)
  - Label all form inputs
  - Alt text on logo/images

- [ ] **P4.5** Mobile responsiveness
  - Stack components vertically on small screens
  - Touch-friendly buttons (48px minimum)
  - Readable on iPad
  - Desktop-first, mobile-secondary

**Output:** App handles errors gracefully. No crashes.

---

## Phase 5: Deployment & Launch
**Goal:** Deploy to Netlify, set up GitHub → auto-deploy.
**Status:** IN PROGRESS (Netlify setup started)

- [x] **P5.1** Initialize GitHub repo
  - `gh repo create CanvasRosters --public --source=. --remote=origin --push` ✓
  - Add .gitignore (node_modules, .env.local, build/) ✓
  - Create README.md (features, how to use, screenshots) ✓

- [x] **P5.2** Create Netlify config
  - netlify.toml (build command, publish dir) ✓
  - Environment variables (if any) ✓

- [ ] **P5.3** Deploy to Netlify (IN PROGRESS)
  - Connect GitHub repo to Netlify
  - Auto-deploy on push to main
  - Set up custom domain (canvasrosters.foiledbymath.com or similar)

- [ ] **P5.4** Create FBM landing page snippet
  - Add Canvas Rosters link to foiledbymath.com
  - "Try free tool → buy other products" messaging
  - Screenshot/GIF of workflow

- [ ] **P5.5** Soft launch + testing
  - Email to 5–10 teachers (beta test)
  - Gather feedback
  - Fix critical bugs

- [ ] **P5.6** Public launch
  - Announce on YouTube, email, socials
  - Monitor Netlify analytics
  - Track user feedback

**Output:** Live, public app with auto-deploy pipeline.

---

## Phase 6: Future (v2 — Paid)
**Out of scope for v1, but plan for:**
- [ ] Direct Google Sheets export (+ AppScript template)
- [ ] Custom seating chart colors/themes
- [ ] Bulk export (all classes at once)
- [ ] Enrollment filtering (active students only)
- [ ] Save templates (remember user's row/col preferences)
- [ ] Student photo integration (pull from Canvas)

---

## Priority Legend
- **High:** v1 launch critical
- **Medium:** Nice to have before v1 public launch
- **Low:** v2 features, can wait

**Current Focus:** Phase 1 (Canvas API integration)
