# CanonKeeper Human Test Plan (Detailed)

## 1. Purpose
This plan is for manual validation of CanonKeeper end-to-end behavior with emphasis on:
- local-first operation
- evidence-first outputs
- continuity + style diagnostics
- canon confirmation workflows
- export correctness
- UI usability, recovery paths, and session persistence

This plan uses realistic long-form input and should be executed before release candidates.

## 2. Test Scope
### In scope
- Electron app startup, welcome modal, and setup flow
- Session persistence across reload (boot restore, timeout, failure recovery)
- Project creation/opening
- Sidebar gating (sections disabled until project is open)
- Adding manuscripts (`.md`, `.txt`, `.docx`)
- Progress banner and skeleton loading during processing
- Incremental reprocessing on file changes
- Scene indexing, POV confidence, and scene detail evidence
- Style report (repetition, tone drift, dialogue tics) with cross-links
- Characters & World entities/details/evidence and confirm detail actions
- Issues lifecycle (open, dismiss with reason, undo dismiss, resolve, undo resolve) with sorting, filtering, and scene cross-links
- Search behavior (answer/snippets/not_found)
- Export behavior (`md`, `json`)
- Runtime diagnostics, per-action busy states, and error queue
- Settings workspace memory controls

### Out of scope
- Cloud sync/collaboration
- Non-local storage backends
- Authoring assistance / rewriting (must not exist)

## 3. Required Test Data
Use these fixtures:
- `data/fixtures/simple_md.md`
- `data/fixtures/contradiction.md`
- `data/fixtures/pov_switch.md`
- `data/fixtures/tone_shift.md`
- `data/fixtures/novel_length_fixture.md`

Optional: add one user-provided `.docx` sample for parser sanity.

## 4. Environment Prerequisites
- Node 25 installed
- Bun installed
- Dependencies installed (`bun install`)
- Electron app starts via `bun run dev:local`
- Writable filesystem for project roots

If SQLite native mismatch appears:
- run `bun install` (or `npm rebuild better-sqlite3`), then retry.

## 5. Test Run Artifacts
Create a run folder, e.g. `output/manual-test-YYYYMMDD-HHMM/`, and capture:
- screenshots of each major view
- copied error messages (if any)
- exported files (`bible.md`, `scenes.md`, `style_report.md`, `project.json`)
- concise notes for each failed assertion

## 6. Execution Steps

### 6.1 First Launch + Welcome Modal
1. Clear `localStorage` (or use a fresh profile) so `hasSeenWelcome` is unset.
2. Launch app with `bun run dev:local`.

Expected:
- Welcome modal appears with `role="dialog"` and `aria-modal`
- Modal describes what CanonKeeper does (three bullet points)
- Pressing **Escape** or clicking **Skip** dismisses the modal
- Clicking **Get Started** dismisses the modal and routes to Setup
- Sidebar sections requiring a project (Scenes, Issues, Style, Characters & World, Search, Exports) are disabled and dimmed
- Relaunching does not show the modal again (`hasSeenWelcome` persisted)

### 6.2 Diagnostics
1. Open **Setup** view.
2. Click **Run Diagnostics** (button shows spinner while running).

Expected:
- Diagnostics section shows IPC/Worker/SQLite/Writable with contextual status icons (check/warning/error)
- Health badges use friendly labels: Connected, Unavailable, Error (not raw status codes)
- No preload/IPC missing error shown in UI

### 6.3 Project Open/Create
1. Click **Browse** for project root.
2. Choose a clean temp directory (not repository root).
3. Click **Create/Open Project**.

Expected:
- Success toast appears
- Top bar shows active project path
- Sidebar sections unlock (no longer disabled/dimmed)
- Sidebar shows numeric badges (0 counts initially) for Scenes, Issues, Characters & World
- Home view shows **Document Progress** card (empty), **Evidence Backing** card, and collapsible **Notices** section

### 6.4 Ingest Single Fixture
1. In Setup, choose `data/fixtures/contradiction.md`.
2. Click **Add Document**.
3. Observe the **Progress Banner** at the top of the app.

Expected:
- Progress banner appears showing current stage with writer-friendly labels (e.g. "Reading your manuscript", "Finding scenes"), filename, and queue depth
- Pipeline stage dots on the Document Progress card animate through stages (ingest, scenes, style, extraction, continuity)
- Banner auto-hides with a success checkmark after processing completes
- Skeleton placeholders appear in data views before first data load
- Scenes/Style/Issues/Characters & World populate after processing; sidebar badges update with counts

### 6.5 Scene Verification
1. Go to **Scenes**.
2. Refresh scenes (button shows spinner while loading).
3. Select several scenes using click or keyboard (`Enter`/`Space`).

Expected:
- Stable scene ordering by ordinal
- POV column shows value with confidence indicator (high/medium/low); hovering shows percentage tooltip
- Setting column populated or `unknown`
- Scene detail evidence exists where metadata is classified
- Evidence drawer shows quote excerpt + passage/document location

### 6.6 Style Verification
1. Go to **Style**.
2. Refresh report (button shows spinner while loading).
3. Inspect repetition, tone drift, dialogue tic sections.

Expected:
- Repetition section shows phrase-level metrics with evidence (not `undefined` values)
- If more than 20 phrases exist, only 20 are shown with a "Showing 20 of N phrases" label and a **Show all** toggle
- Tone drift issues visible for tone-shift content, each with a **View Scene** cross-link button
- Dialogue tic issues surfaced with evidence spans and **View Scene** cross-link buttons
- Empty sections show a friendly empty-state message (not a blank area)
- No rewrite suggestions generated

### 6.7 Characters & World + Confirmation Flow
1. Go to **Characters & World**.
2. Verify entity list has proper ARIA roles (`listbox`/`option`/`aria-selected`).
3. Select an entity with detected details.
4. Open evidence for a detail.
5. Confirm detail via modal.

Expected:
- Skeleton placeholders shown before data loads
- Confirm action succeeds
- Detail status reflects confirmation
- Evidence remains attached (evidence-first guarantee)
- Continuity checks may generate/update issues on conflict

### 6.8 Issue Lifecycle
1. Go to **Issues**.
2. Verify issue cards show relative timestamps (e.g. "Found 5m ago").
3. Use the sort controls to sort by recency, severity, and type.
4. Use the **Style only** type filter.
5. Dismiss one open issue with a reason.
6. Use toast **Undo** to reverse the dismiss.
7. Click resolve on one issue; verify inline "Mark resolved?" confirmation appears with **Confirm**/**Cancel** buttons.
8. Confirm the resolve.
9. Use the toast **Undo** to reverse the resolve.
10. If an issue has scene evidence, click the **View Scene** cross-link.

Expected:
- Sort controls reorder the list correctly
- Style filter shows only style-type issues
- Dismissed issue leaves open list and appears in dismissed filter
- Undo returns issue to open
- Inline resolve confirmation prevents accidental resolves
- Resolved issue appears in resolved filter; undo returns it to open
- View Scene navigates to the linked scene in the Scenes view
- Evidence remains viewable for each issue state

### 6.9 Search Workflow
1. Go to **Search** (header reads "Search", input has `aria-label`).
2. Ask a known-answer question from ingested text (e.g. "What color are Lina's eyes?").
3. Ask an unknown question.

Expected:
- Known question returns `answer` or `snippets` with citations/snippets (improved query handling strips stopwords and tries OR-fallback)
- Unknown question returns `not_found` without hallucinated prose
- Search spinner is independent of other view spinners (per-action busy)

### 6.10 Export Validation
1. Go to **Exports**.
2. Pick output directory.
3. Run `md` export, then `json` export (note the hint text describing JSON export contents).

Expected:
- Export success with file list and elapsed time
- Markdown files include citations/evidence references
- JSON dump includes consistent entities/scenes/issues/claims rows

### 6.11 Incremental Reprocessing
1. Edit ingested fixture text (small change in one scene).
2. Save file.
3. Wait for processing completion.

Expected:
- Debounced reprocessing triggers automatically
- Progress banner reappears showing processing stage and filename
- Document Progress card updates pipeline dots for the affected document
- Only impacted ranges/scenes appear updated
- No full reset of unrelated entities/issues

### 6.12 Session Persistence + Boot Flow
1. With a project open and data loaded, navigate to a non-default section (e.g. Issues).
2. Reload the app (`Cmd+R` or restart `bun run dev:local`).

Expected:
- Boot loading indicator appears: "Restoring your last session..." with a spinning icon
- App restores the previously open project without re-selecting a folder
- Active section is restored to the section you were on before reload
- Sidebar collapsed state is preserved
- If boot takes longer than 15 seconds, a **Skip and start fresh** button appears
- Sidebar is disabled during boot (no navigation until restore completes)

### 6.13 Boot Failure Recovery
1. Open a project, then manually rename or delete the `.canonkeeper/` directory.
2. Reload the app.

Expected:
- `bootState` becomes `restore-failed`
- App routes to Setup with a failure banner
- Banner offers **Choose Project Folder** and **Start Fresh** actions
- No orphaned empty database is created at the stale path (`createIfMissing: false`)

### 6.14 Settings — Workspace Memory
1. Go to **Settings**.
2. Find the **Your Workspace Memory** section.
3. Click **Forget Last Project**.

Expected:
- A confirmation modal appears before the action executes (destructive action guard)
- After confirming, the persisted last-project reference is cleared
- Reloading the app starts fresh (no restore attempt)

4. Open a project again, then click **Reset This Project's Saved State**.

Expected:
- A confirmation modal appears before the action executes
- After confirming, per-project UI state (filters, selections) is cleared
- The project itself remains open and functional

### 6.15 Settings — Processing Queue
1. Go to **Settings**.
2. Find the **Processing Queue** section.

Expected:
- Queued and failed jobs are listed with type labels and timestamps
- Queued jobs have a **Cancel** button
- Cancelling a job removes it from the queue

### 6.16 Error Queue Behavior
1. Trigger multiple errors in sequence (e.g. attempt operations on a corrupt fixture, or disconnect LLM mid-request).

Expected:
- Errors accumulate in the error banner (up to 5 max)
- Each error can be dismissed individually (X button per error)
- Errors include human-readable messages; raw technical details are hidden under a collapsible "Technical details" section
- New actions do not clear existing errors

### 6.17 Long-Form Stress Pass
1. Add `data/fixtures/novel_length_fixture.md`.
2. Observe progress banner during processing.
3. Wait for idle.
4. Visit Home, Scenes, Style, Characters & World, Issues, Search.

Expected:
- App remains responsive
- Progress banner shows queue depth and current stage throughout
- Skeleton placeholders appear in views before data loads
- Scene list remains navigable
- Style/continuity outputs remain evidence-backed
- Search remains grounded and does not degrade into fabricated answers

## 7. Evidence-First Audit Checklist
For 10 random details/issues/scenes:
- Verify at least one quote span exists.
- Verify quote text is present in passage excerpt.
- Verify location metadata (document path + passage ordinal) is present.

Mark each item `Pass/Fail`.

Additionally, check the **Evidence Backing** card on the Home view:
- Verify issue and scene evidence coverage percentages are displayed
- Verify color-coded indicators match actual coverage (green = high, yellow = partial, red = low)

## 8. Regression Checklist
- No `IPC not available` errors after startup
- No preload parse errors in console
- Status pill does not stick at `busy (project.subscribeStatus)` when idle
- Diagnostics do not show `require is not defined` for SQLite
- Project open does not fail with missing `job_queue`
- Welcome modal does not reappear after being dismissed
- Boot restore does not create orphaned databases at stale paths
- Sidebar sections stay disabled when no project is open
- Per-action busy spinners are isolated (e.g. search spinner does not fire during export)
- Repetition phrases never show `undefined` for ngram or count
- Resolving/dismissing issues does not clear unrelated issues (only `status = 'open'` issues cleared on reprocessing)
- Section transitions animate smoothly (no flash of stale content)
- Collapsed sidebar shows tooltip "CanonKeeper — Editorial Workstation" on CK brand icon
- Toast durations vary by tier: success 5s, error 15s, action 10s

## 9. Failure Triage Template
When filing a defect, include:
- Environment (OS, Node, Bun, commit SHA)
- Fixture path(s)
- Exact steps
- Expected vs actual
- Screenshot(s)
- Relevant console/log snippets
- Severity (`blocker/high/medium/low`)

## 10. Exit Criteria
Release candidate is acceptable when:
- All critical-path sections (6.1–6.17) pass
- Evidence-first audit has zero failures
- No blocker/high defects remain open
- Session persistence survives reload and boot failure gracefully
- Exports and Search behavior are verified on long-form fixture
