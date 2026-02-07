# UX Review: CanonKeeper Desktop Application

**Date:** 2026-02-06
**Scope:** Full interface audit of the CanonKeeper Electron desktop app
**Audience:** Product and engineering team
**App version:** v0.1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Theme Critique](#2-theme-critique)
3. [Navigation Restructure](#3-navigation-restructure)
4. [Language Audit](#4-language-audit)
5. [View-by-View Recommendations](#5-view-by-view-recommendations)
6. [Component and Interaction Improvements](#6-component-and-interaction-improvements)
7. [Accessibility and Polish](#7-accessibility-and-polish)
8. [Proposed New Theme](#8-proposed-new-theme)

---

## 1. Executive Summary

CanonKeeper has a genuinely powerful engine underneath. The pipeline architecture, evidence-backed claims system, incremental processing, and crash-recoverable job queue represent sophisticated engineering. The problem is that all of this sophistication is visible to the user.

**The core finding:** CanonKeeper currently presents itself as a developer tool rather than a writer's companion. The interface exposes internal architecture (workers, queues, chunks, pipelines, spans), uses technical jargon throughout, and organizes its navigation around system capabilities rather than writer workflows. The visual theme reinforces this: teal-on-tan reads as a fintech dashboard, not a creative workspace.

Fiction writers -- the target users -- are non-technical professionals who think in chapters, characters, and scenes. They do not think in chunks, ordinals, document IDs, or pipeline stages. Every surface of the application needs to be reframed around the writer's mental model.

**What is working well:**

- The evidence-first approach is genuinely valuable and differentiating
- Keyboard navigation (Cmd+K palette, J/K list nav, bracket section nav) is excellent
- The responsive layout system (desktop/tablet/mobile) is well-implemented
- Focus trapping, ARIA roles, and reduced-motion support show accessibility awareness
- The dismiss-with-reason workflow for issues is thoughtful UX
- Fraunces as a display font is an outstanding choice for a writing tool

**What needs the most urgent attention:**

- Strip all developer-facing language from user-visible surfaces
- Consolidate 9 navigation sections down to 5
- Replace the clinical teal/tan theme with something warmer and more literary
- Redesign the Dashboard from a system monitor into a writer's home screen
- Convert Setup from a permanent nav item into a first-run onboarding flow

---

## 2. Theme Critique

### 2.1 The Current Palette Feels Clinical

The light mode palette centers on tan/parchment surfaces (`#f7f3eb`, `#f2ecdf`, `#e9dfcc`) paired with a deep teal accent (`#0f5d5d`). In isolation, these are fine colors. Together, they produce an aesthetic that reads as institutional: think banking portal, insurance dashboard, or government form. The combination of warm browns and cool teals creates visual tension rather than warmth.

The dark mode compounds this with very dark greenish surfaces (`#141a1a`, `#1a2222`, `#212b2b`) and a bright mint accent (`#3db8a0`). The result feels like a terminal emulator or a DevOps monitoring tool. The greenish tint on every surface reinforces the "code editor" impression.

**Specific color problems in `app.css`:**

| Token | Value | Problem |
|---|---|---|
| `--color-surface-0` | `#f7f3eb` | Too yellow-brown; feels aged/institutional rather than warm |
| `--color-surface-3` | `#e9dfcc` | Muddy secondary surface competes with border colors |
| `--color-accent` | `#0f5d5d` | Clinical teal reads as analytical/corporate |
| `--color-accent` (dark) | `#3db8a0` | Bright mint green screams "DevOps dashboard" |
| `--color-border` | `#d8ccba` | Brownish borders make everything feel dusty |
| `--color-text-muted` | `#5f6f6f` | Greenish muted text reinforces the teal clinical feeling |
| Body gradient | `rgba(15,93,93,0.12)` | Teal radial gradient on body is noticeable and cold |

### 2.2 How Beloved Writing Tools Handle This

The most respected writing tools share a common visual philosophy: retreat from the content. The interface should feel like high-quality paper, not a dashboard.

**Scrivener** uses a neutral gray chrome with warm white editor backgrounds. The interface disappears when you are reading. It feels like a workshop desk -- functional, not decorative.

**Ulysses** uses cool blue-grays with extremely minimal chrome. High contrast for text, very low contrast for UI elements. The reading experience dominates.

**iA Writer** takes this to its extreme: pure white or dark backgrounds with a single blue accent. Essentially zero visual noise. The content *is* the interface.

**Bear** uses warm reds and oranges for accents against neutral backgrounds. It feels literary and personal without being distracting.

**What these tools share:** They all use either a completely neutral gray palette or a warm-neutral palette for surfaces, and they all use a single, distinctive accent color sparingly. None of them use teal. None of them mix warm backgrounds with cool accents.

### 2.3 Recommendations for a New Direction

CanonKeeper is not a writing tool in the same category as the above -- it is a diagnostics and reference companion. Its UI is inherently denser and more interactive. But the emotional register should still say "literary workspace" rather than "enterprise analytics."

**Principles for the new palette:**

1. **Warm paper backgrounds:** Off-whites that feel like book pages, not aged parchment. Think `#faf9f6` rather than `#f7f3eb`. The difference is subtle but the association shifts from "old document" to "fresh page."

2. **Muted literary accent:** Replace clinical teal with a warm plum, wine, or deep clay. These colors carry literary associations (bookshop, library, ink) without being cold. A muted wine like `#7c4a6e` or a warm clay like `#8b5e3c` would serve the same functional role as the current teal while changing the emotional register entirely.

3. **Softer contrast for reading:** The current `#1d2a2a` primary text on `#f7f3eb` surfaces produces a contrast ratio of approximately 12:1. This is well above WCAG AAA (7:1) and makes long reading sessions fatiguing. A slightly softened primary like `#2d3436` on a cleaner white like `#faf9f6` would still exceed AAA while being gentler on the eyes.

4. **Neutral dark mode:** Replace the greenish dark surfaces with true neutral darks (`#1a1a1e`, `#222226`, `#2a2a2e`). The accent in dark mode should be a lighter, warmer version of the same hue -- not a completely different color (the current jump from deep teal to bright mint is jarring).

5. **Cleaner borders:** Replace the brownish `#d8ccba` borders with a neutral warm gray like `#e2e0dc`. Borders should be invisible until you need them.

Full palette specifications should be developed in a dedicated `THEME_RECOMMENDATIONS.md` document.

---

## 3. Navigation Restructure

### 3.1 The Problem with 9 Sections

The current navigation in `Sidebar.tsx` renders all 9 entries from `APP_SECTIONS`:

1. Dashboard
2. Setup
3. Search
4. Scenes
5. Issues
6. Style
7. Bible
8. Exports
9. Settings

This is too many items for two reasons. First, cognitive load: research on menu design consistently shows that 5-7 items is the upper bound of comfortable scanning. Nine items forces the user to read every label to find what they want. Second, several of these sections do not deserve permanent navigation slots because they are used rarely (Setup, Export), overlap significantly (Style and Issues), or contain minimal content (Settings).

### 3.2 Proposed 5-Section Navigation

| # | New Section | Replaces | Rationale |
|---|---|---|---|
| 1 | **Home** | Dashboard | Writer-friendly landing page: project health as a simple progress indicator, recent activity as a readable timeline, quick-resume buttons with plain labels. Drops the "Worker Status" card, "Pipeline Timeline," raw event log, and "Last Ingest" card entirely. |
| 2 | **Manuscript** | Scenes + Search (integrated) | The scene browser is the primary workspace for navigating the story. Embed the search bar directly at the top of this view so writers can find passages and browse scenes in one place. The current SearchView's "Ask" feature moves here as well, accessible via a tab or toggle ("Browse" / "Search" / "Ask"). |
| 3 | **Characters & World** | Bible | "Bible" is internal jargon (even "Book Bible" requires explanation). "Characters & World" immediately communicates what this section contains. Entity types map naturally: characters, locations (world), objects, factions. |
| 4 | **Review** | Issues + Style (merged) | All editorial feedback in one unified triage view. Use tabs or collapsible sections: "Continuity" (current Issues minus style issues), "Style" (repetition, tone, dialogue habits), and optionally "All" for a combined feed. This eliminates the current overlap where style issues appear in both the Issues view and the Style view. |
| 5 | **Settings** | Settings + Export (absorbed) + Setup diagnostics (absorbed) | Export becomes a section within Settings ("Export Your Project"). The diagnostics health check from Setup also moves here. Appearance settings remain. |

### 3.3 Setup Becomes a First-Run Wizard

The current `SetupView` should not be a permanent navigation item. It is an onboarding flow that a writer completes once per project. The recommended approach:

- When the app launches with no project loaded, display the setup flow as a full-screen guided wizard (not inside the sidebar layout).
- The wizard uses the same 3 steps (Choose Folder, Add Manuscripts, Verify) but with friendlier language and without the diagnostics step (run diagnostics silently; only surface errors).
- Once a project is open, the setup wizard is no longer accessible from the sidebar. If the user needs to add more manuscripts, they can do so from a smaller action within the Home view or from the command palette.
- The "Use Fixture" button is removed from the wizard entirely (see section 6.6).

### 3.4 Impact on Existing Components

The navigation restructure affects these files:

- `useCanonkeeperApp.ts`: `APP_SECTIONS` array reduced from 9 to 5 entries; `AppSection` union type updated
- `Sidebar.tsx`: Renders fewer items; subtitle descriptions updated
- `App.tsx`: View routing simplified; `SetupView` conditionally rendered as full-screen when no project is loaded
- `SearchView.tsx`: Integrated into a new `ManuscriptView` that combines scenes and search
- `StyleView.tsx`: Merged into a new `ReviewView` alongside Issues
- `ExportView.tsx`: Moved into `SettingsView` as a collapsible section

---

## 4. Language Audit

Every instance of technical jargon found in the renderer code, mapped to a recommended plain-language replacement.

### 4.1 View Headers and Subtitles

These strings appear as `<h2>` headings and subtitle `<p>` elements in each view file.

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `DashboardView.tsx` L120 | "Dashboard" | "Home" | |
| `DashboardView.tsx` L122 | "Monitor ingestion, inspect recent activity, and continue from your last triage context." | "Your project at a glance. Pick up where you left off." | Remove all technical terms |
| `SetupView.tsx` L68 | "Setup Wizard" | "Get Started" | Only shown during onboarding |
| `SetupView.tsx` L70 | "Complete these steps in order to prevent configuration errors and speed up first ingestion." | "Let's set up your project in a few quick steps." | |
| `SearchView.tsx` L34 | "Search and Ask" | "Search Your Manuscript" | |
| `SearchView.tsx` L36 | "Retrieval-first interactions. Ask has strict result states: answer, snippets, or not_found." | "Find passages and ask questions about your story." | The original text is a developer specification, not a user description |
| `ScenesView.tsx` L49 | "Split view for scene index and deterministic metadata evidence." | "Browse your scenes, settings, and point of view." | "Deterministic metadata evidence" is meaningless to writers |
| `IssuesView.tsx` L78 | "Evidence-backed continuity and style triage. Dismiss requires a reason and supports undo." | "Potential continuity issues found in your manuscript." | The dismiss/undo behavior is discoverable through the UI; it does not need to be stated in the subtitle |
| `StyleView.tsx` L68 | "Diagnostic-only style signals across repetition, tone drift, and dialogue tics." | "Patterns in your writing style -- repeated phrases, tone shifts, and dialogue habits." | |
| `BibleView.tsx` L94 | "Book Bible" | "Characters & World" | |
| `BibleView.tsx` L96 | "Evidence-backed claims grouped by field. Confirmed canon supersedes inferred values." | "Everything CanonKeeper knows about the people, places, and things in your story." | The confirmed/inferred behavior is shown through status badges; explaining the mechanism in the subtitle adds noise |
| `ExportView.tsx` L39 | "Run deterministic markdown/json exports with explicit progress receipts." | "Export your project data as Markdown or JSON files." | |
| `SettingsView.tsx` L29 | "Settings and Diagnostics" | "Settings" | |
| `SettingsView.tsx` L30 | "Environment checks, appearance, and runtime health summary." | "Appearance, export, and system information." | |

### 4.2 Dashboard Internals

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `DashboardView.tsx` L131 | "Worker Status" | Remove entirely | Replace with a subtle activity indicator (spinner or progress bar) in the TopBar. Writers should never see the word "worker." |
| `DashboardView.tsx` L136 | "Queue depth: {n}" | Remove entirely | Internal metric with no user value |
| `DashboardView.tsx` L161 | `{lastIngest.documentId.slice(0, 8)}` (truncated hash) | Show the document's filename instead | e.g., "chapter-03.md" |
| `DashboardView.tsx` L163 | "+{n} created / {n} updated / {n} deleted" | "Processed {total} passages" | Writers do not care about create/update/delete semantics for chunks |
| `DashboardView.tsx` L197 | "Pipeline Timeline" | "Recent Activity" | |
| `DashboardView.tsx` L203 | "Show raw events" / "Show grouped" | Remove the toggle entirely | Raw pipeline events are a developer debugging tool |
| `DashboardView.tsx` L210 | "No Pipeline Rows" | "No Activity Yet" | |
| `DashboardView.tsx` L211 | "Ingest at least one document to populate deterministic scene/style/extraction stages." | "Add a manuscript to get started." | |
| `DashboardView.tsx` L246 | "Recent Event Log" | Remove entirely, or transform into a human-readable activity feed | The raw event log with `event_type` identifiers (`info`/`warn`/`error` badges) is a developer console |
| `DashboardView.tsx` L176 | "Resume Continuity Question" | "Continue Reviewing Issues" | |
| `DashboardView.tsx` L177 | "Resume Entity" | "Continue with Characters" | |
| `DashboardView.tsx` L178 | "Resume Scene" | "Continue Reading Scenes" | |

### 4.3 App.tsx Status Bar

The persistent status bar rendered in `App.tsx` (lines 142-154) displays raw system telemetry:

| Current Text | Recommended | Notes |
|---|---|---|
| `phase:{status.phase}` | Remove or replace with a single-word activity indicator in TopBar | e.g., show "Analyzing..." when busy, nothing when idle |
| `queue:{n}` | Remove | |
| `job:{label}` | Remove | |
| `last-success:{timestamp}` | Remove | |
| `{subsystem}: {error.message}` | Show as an inline error banner only when relevant | The current format (`subsystem: message`) is a log line, not a user notification |

The entire status bar between the TopBar and main content area should be removed. Processing status should be communicated through a single subtle indicator in the TopBar (already partially done via the `StatusBadge` in `TopBar.tsx` line 56).

### 4.4 Search View

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `SearchView.tsx` L41 | "Search Chunks" | "Search Your Manuscript" | Writers do not know what chunks are |
| `SearchView.tsx` L71 | "chunk {ordinal}" badge | "Passage {ordinal}" or remove entirely | If the ordinal is not meaningful to the writer, remove it |
| `SearchView.tsx` L88 | "Ask the Bible" | "Ask About Your Story" | "Bible" is internal nomenclature |
| `SearchView.tsx` L109 | "Grounded Answer" | "Answer" | "Grounded" is an AI/ML term |
| `SearchView.tsx` L127 | "Evidence Snippets" | "Related Passages" | |
| `SearchView.tsx` L128 | "No synthesized answer yet; showing directly retrieved text." | "Here are the most relevant passages from your manuscript." | |
| `SearchView.tsx` L133 | `{path} \| chunk {ordinal}` | `{filename}, Passage {ordinal}` | Show filename only, not full path; replace "chunk" |

### 4.5 Scenes View

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `ScenesView.tsx` L20 | "POV heuristic found no first-person or explicit narrator marker." | "Point of view could not be determined automatically." | |
| `ScenesView.tsx` L23 | "No setting entity matched scene text with deterministic rules." | "Setting could not be identified automatically." | |
| `ScenesView.tsx` L25 | "Evidence-backed classification available." | Remove this line; it is the expected state and does not need a label | |
| `ScenesView.tsx` L77 | "Run ingestion and scene stage first. Unknown metadata is still shown so you can triage gaps." | "No scenes found yet. Add a manuscript to see your story's scene breakdown." | |
| `ScenesView.tsx` L135 | "Select a scene row to inspect chunk ranges and evidence-backed metadata." | "Select a scene to see its details." | |
| `ScenesView.tsx` L144 | "Range {start_char}-{end_char}" | Remove | Character offsets are meaningless to writers |
| `ScenesView.tsx` L148 | "POV {mode}" | "POV: {mode}" | Minor; keep the POV label but format as a readable phrase |
| `ScenesView.tsx` L166 | "chunk {ordinal} \| {start_char}-{end_char}" | "Passage {ordinal}" or remove the character offsets | If line numbers are available, show those instead |

### 4.6 Issues View

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `IssuesView.tsx` L172 | `{issue.type}` (raw identifiers like `tone_drift`, `dialogue_tic`, `contradiction`) | Format as human-readable labels | See type mapping table below |
| `IssuesView.tsx` L208 | `{path} \| chunk {ordinal}` | `{filename}, Passage {ordinal}` | Same pattern as Search |
| `IssuesView.tsx` L143 | "Ingest additional evidence-backed documents to generate issues." | "No issues found. Add more manuscript files to check for continuity problems." | |

**Issue type display mapping:**

| Raw Type | Displayed As |
|---|---|
| `tone_drift` | Tone Shift |
| `dialogue_tic` | Dialogue Habit |
| `contradiction` | Contradiction |
| `timeline_error` | Timeline Issue |
| `character_inconsistency` | Character Inconsistency |
| `setting_error` | Setting Inconsistency |
| `repetition` | Repetition |

### 4.7 Style View

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `StyleView.tsx` L39 | Sort option label "Ngram" | "Phrase" | |
| `StyleView.tsx` L103 | Table column header "Ngram" | "Repeated Phrase" | "Ngram" is a computational linguistics term |
| `StyleView.tsx` L83 | "Run style stage by ingesting documents first." | "Add a manuscript to see your writing style patterns." | |

### 4.8 Bible View

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `BibleView.tsx` L136 | "Run extraction or relax filters to see entities." | "No characters or locations found yet. Add a manuscript and CanonKeeper will discover them." | |
| `BibleView.tsx` L170 | "Select an entity to inspect grouped claims and evidence." | "Select a character or location to see what CanonKeeper knows about them." | |
| `BibleView.tsx` L172 | "This entity has no evidence-backed claims yet." | "No details found for this entry yet." | |
| `BibleView.tsx` L185 | `{claim.claim.value_json}` displayed in monospace | Parse and display as plain text | Showing raw JSON values to writers is a significant UX failure |

### 4.9 Export View

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `ExportView.tsx` L83 | "No Exports Yet" | "No Exports Yet" | This one is fine |
| `ExportView.tsx` L83 | "Run an export to see generated file paths and elapsed time." | "Choose a format and folder, then export your project data." | |
| `ExportView.tsx` L90 | "Elapsed: {n} ms" | Remove, or show as "Completed in {n/1000} seconds" if significant | Millisecond precision is developer-facing |

### 4.10 Evidence Drawer

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `EvidenceDrawer.tsx` L20 | `{path} \| chunk {ordinal} \| line {start}-{end}` | `{filename}, lines {start}-{end}` | Drop chunk reference; show only the filename (not full path) and line numbers |
| `EvidenceDrawer.tsx` L163 | "span {quoteStart}-{quoteEnd}" | Remove entirely | Character-level span offsets are internal data used for mapping; they have zero user value |

### 4.11 Setup View

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `SetupView.tsx` L184 | "Environment Diagnostics" | "Verify Setup" or remove step entirely | Run diagnostics silently; surface only if something fails |
| `SetupView.tsx` L136 | StatusBadge showing "blocked" | Remove; use disabled state styling instead | "Blocked" is a project management / CI term |
| `SetupView.tsx` L203 | "Diagnostics verify IPC, worker reachability, sqlite native module, and write permissions." | "Checking that everything is working correctly..." | |
| `SetupView.tsx` L208-213 | Health check grid showing "ipc", "worker", "sqlite", "writable" | Replace with a single pass/fail indicator | If all checks pass, show a green checkmark and "Everything looks good." If any fail, show a friendly error message describing the actual problem (e.g., "Could not create the project database. Check folder permissions.") |

### 4.12 Confirm Modal Dialogs

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `App.tsx` L354 | "Confirm Canon Claim" | "Confirm This Fact" | |
| `App.tsx` L355 | "This creates a confirmed claim and supersedes inferred claims for the same field/value pair while preserving evidence links." | "Mark this as confirmed. CanonKeeper will treat it as established fact for your story." | |
| `App.tsx` L361 | `field={claim.field}, evidence={claim.evidenceCount}` | Show the claim value and field name as readable text, e.g., "Eye color: blue (3 references found)" | |

### 4.13 Command Palette

| Location | Current Text | Recommended | Notes |
|---|---|---|---|
| `App.tsx` L66 | "Check IPC, worker, sqlite, and writable state" (diagnostics subtitle) | "Check that your project is working correctly" | |

---

## 5. View-by-View Recommendations

### 5.1 Dashboard (becomes "Home")

**Keep:**
- "Continue Where You Left Off" section (rename buttons per language audit)
- Project name display

**Change:**
- Replace "Worker Status" card with a single subtle activity indicator in the TopBar. When the system is processing, show a brief animated bar or spinner with a human-readable label ("Analyzing chapter-03.md..."). When idle, show nothing.
- Replace "Last Ingest" card with a simple summary: "Last updated: [relative time]" (e.g., "5 minutes ago"). Show the document name, not a truncated hash.
- Replace "Pipeline Timeline" with a clean activity feed showing completed actions in plain English: "Analyzed chapter-01.md," "Found 3 new characters," "Detected 2 continuity issues." Each entry gets a relative timestamp.

**Remove:**
- "Queue depth" display
- Raw/grouped timeline toggle and all processing state rows
- "Recent Event Log" section entirely
- All StatusBadge instances showing pipeline stages

**Add:**
- A project health summary showing counts in friendly language: "12 scenes, 8 characters, 3 locations, 2 open issues"
- A prominent "Add Manuscript" button if the project has few or no documents

### 5.2 Setup (becomes first-run wizard)

**Keep:**
- The 3-step progression (folder, manuscripts, verify)
- The browse button for folder/file selection
- The step indicator UI (numbered circles with connecting lines)

**Change:**
- Move from sidebar-navigable view to a full-screen modal/wizard that appears only when no project is loaded
- Step 3 ("Environment Diagnostics") should run silently. Show a spinner with "Setting things up..." and only surface errors in plain language.
- Replace the health check grid (ipc/worker/sqlite/writable) with a single pass/fail result
- Replace "blocked" StatusBadge with natural disabled state styling (grayed-out, reduced opacity)

**Remove:**
- "Use Fixture" button (developer tool; see section 6.6)
- Raw file path display in the input placeholder (show "Choose a folder..." instead of "/Users/.../my-novel")
- The diagnostics empty state text about "IPC, worker reachability, sqlite native module"

### 5.3 Search (integrated into Manuscript view)

**Keep:**
- The search input with icon
- The "Ask" functionality with its answer/snippets/not_found states
- Confidence indicator on answers
- Citation count

**Change:**
- Rename "Search Chunks" to "Search Your Manuscript"
- Rename "Ask the Bible" to "Ask About Your Story"
- In search results, show `{filename}` instead of full document path
- Replace "chunk {n}" badges with "Passage {n}" or remove
- Rename "Grounded Answer" to "Answer"
- Rename "Evidence Snippets" to "Related Passages"
- Rewrite the snippets explanation text (see language audit)
- In snippet results, format location as `{filename}, Passage {n}` instead of `{path} | chunk {n}`

**Remove:**
- The subtitle text about "retrieval-first interactions" and "strict result states"

### 5.4 Scenes (becomes core of Manuscript view)

**Keep:**
- The split-panel layout (scene list + detail)
- The filter/search input
- POV and setting columns in the scene table
- The "Open Evidence" button and evidence integration
- Scene text preview in detail panel

**Change:**
- Remove the `unknownReason` helper function's technical language. When POV is unknown, show "Unknown" in the POV column with no explanation row. A subtle tooltip could say "Could not be determined automatically."
- In the detail panel, replace "Range {start_char}-{end_char}" with nothing (remove it entirely) or with a word/page count if available
- Replace "chunk {ordinal} | {start_char}-{end_char}" passage metadata with "Passage {ordinal}" or just show the text preview without a header
- Rewrite the empty state from "Run ingestion and scene stage first" to "No scenes found yet. Add a manuscript to see your story's scene breakdown."
- Rewrite the no-selection state from "Select a scene row to inspect chunk ranges and evidence-backed metadata" to "Select a scene to see its details."

**Remove:**
- Character offset ranges everywhere (start_char, end_char in badges and chunk headers)
- The technical subtitle about "deterministic metadata evidence"

### 5.5 Issues (becomes part of Review view)

**Keep:**
- The filter bar with status, severity, type, and query filters
- Severity-colored left borders on issue cards
- The dismiss-with-reason workflow (this is genuinely good UX)
- The resolve action
- Evidence button on each card
- The staggered animation on card entry (`animate-slide-in-up` with delay)

**Change:**
- In the type dropdown and the type label on each card, display human-readable names instead of raw identifiers (see type mapping in section 4.6)
- In evidence preview snippets, replace `{path} | chunk {ordinal}` with `{filename}, Passage {ordinal}`
- Rewrite empty state text (see language audit)
- Reduce information density on issue cards: move the evidence preview behind a hover or expand interaction rather than always showing the first 2 evidence items inline. This addresses the problem of very dense cards showing title, description, severity, status, type, evidence, and 3 action buttons all at once.

**Remove:**
- The monospace type identifier display on each card (replace with a readable pill/badge)

### 5.6 Style (merged into Review view)

**Keep:**
- The repetition table with frequency bars (this visualization is effective)
- Tone drift section
- Dialogue habits section
- Evidence buttons on all items

**Change:**
- Rename "Ngram" column header to "Repeated Phrase"
- Rename the sort option "Ngram" to "Phrase"
- Rename "Tone Drift" to "Tone Shifts"
- Rename "Dialogue Tics" to "Dialogue Habits"
- Rewrite the empty state text

**Remove:**
- The subtitle about "diagnostic-only style signals" -- replace with natural language (see section 4)

### 5.7 Bible (becomes Characters & World)

**Keep:**
- The split-panel layout (entity list + claim detail)
- Entity type color-coding (character=teal, location=amber, object=green, faction=red)
- The collapsible `<details>` elements for grouped claims
- The confirm action on unconfirmed claims
- Filter bar with type, status, and query

**Change:**
- Rename "Book Bible" heading to "Characters & World"
- Rename "Entities" list header to "Characters & Places" or simply remove the redundant header
- In the claim detail panel, parse `value_json` and display as readable text instead of raw JSON in monospace. For example, if `value_json` is `"blue"`, display "blue". If it is `{"hair": "red", "age": 34}`, display as a formatted list.
- Rename "Claim Status" filter label to "Status" (the word "claim" adds no value here)
- Rewrite "Confirmed canon supersedes inferred values" subtitle
- Rewrite empty states (see language audit)

**Remove:**
- The word "claims" from user-visible surfaces where possible. Writers think of these as "facts" or "details," not "claims." The internal data model uses "claims" -- that is fine -- but the UI should say "details" or "facts."

### 5.8 Export (absorbed into Settings)

**Keep:**
- Format toggle (Markdown / JSON)
- Browse button for output directory
- Success/failure result display
- File list with copy buttons

**Change:**
- Move the entire Export view into SettingsView as a collapsible section with a heading like "Export Your Project"
- Replace "Elapsed: {n} ms" with "Completed in {seconds} seconds" or remove entirely
- Replace the raw file path list with filenames and a single "Open in Finder" action

**Remove:**
- The "Run deterministic markdown/json exports with explicit progress receipts" subtitle

### 5.9 Settings

**Keep:**
- Theme toggle (light/dark/system)
- Sidebar collapse preference
- About section with version

**Change:**
- Add the Export section (from 5.8) as a collapsible card
- Add a "System" section that absorbs the diagnostics health check, but display it as a simple pass/fail with an expandable "Details" disclosure if the user wants more information
- In the Runtime section, replace `StatusBadge` showing raw state identifiers (`idle`, `busy`, `restarting`, `down`) with human-readable text ("System is ready," "Processing your manuscript," "Restarting...," "Not responding")
- Rename "Runtime" section to "System Status"

**Remove:**
- The grid of ipc/worker/sqlite/writable health checks as individual cards (replace with the simplified version described above)

---

## 6. Component and Interaction Improvements

### 6.1 Evidence Drawer (`EvidenceDrawer.tsx`)

The evidence drawer is one of CanonKeeper's strongest differentiating features. Every finding is backed by a direct quote from the manuscript. This is excellent. But the presentation undermines the value by showing internal metadata.

**Current location label format** (from `locationLabel()`, line 18):
```
path/to/file.md | chunk 3 | line 12-15
```

**Recommended format:**
```
chapter-03.md, lines 12-15
```

Changes:
- Show only the filename, not the full path. Use `path.split("/").pop()` or equivalent.
- Remove the chunk reference entirely. Chunks are an internal storage concept.
- Keep line numbers -- these are meaningful to writers.
- Remove the `span {quoteStart}-{quoteEnd}` line at the bottom of each evidence card (line 163). Character-level offsets are internal mapping data.
- The pin/unpin feature is good -- keep it.
- The focus trap implementation is solid -- keep it.
- The copy button on each excerpt is useful -- keep it.

### 6.2 Issue Cards (in `IssuesView.tsx`)

Issue cards are currently very dense. Each card simultaneously displays:
1. Title (bold)
2. Description (muted text)
3. Severity badge (colored)
4. Status badge (colored)
5. Type identifier (monospace)
6. Up to 2 evidence preview snippets
7. Three action buttons (Evidence, Dismiss, Resolve)

This is too much for a list item. Recommended progressive disclosure:

**Default collapsed state:** Title, severity indicator (colored left border is sufficient -- remove the severity badge), status badge, and type label. One line.

**Expanded/selected state:** Description, evidence previews, and action buttons appear when the card is clicked or selected. This is partially implemented via the `selected` state (`ring-1 ring-accent/30 shadow-sm`) but the expanded content should be tied to selection.

**Specific changes:**
- Remove the severity badge; the left border color (`border-l-danger`, `border-l-warn`, `border-l-ok`) already communicates severity.
- Move the type identifier from monospace raw text to a small colored pill with a human-readable label.
- Show evidence previews and action buttons only for the selected/expanded card.

### 6.3 StatusBadge (`StatusBadge.tsx`)

The `StatusBadge` component is used extensively but many of its applications expose internal states to users. The component itself is well-built (the `toneClasses` mapping, pulse animation for busy states, optional icon prop). The problem is what is passed to it.

**States that should be visible to users:**
- "Open" / "Resolved" / "Dismissed" (issue status -- meaningful)
- "High" / "Medium" / "Low" (severity -- meaningful)
- "Confirmed" / "Inferred" (claim status -- meaningful, though "Inferred" should be renamed to "Detected")

**States that should NOT be visible as badges:**
- "idle" / "busy" / "down" / "restarting" (worker states)
- "ok" / "warn" / "error" (health check results)
- "ingest" / "extract" / "style" / "continuity" / "export" (pipeline stages)
- "blocked" / "ready" (setup step states)
- "missing-native" (error code)

For worker/system states, use the TopBar's existing badge but with human-readable labels: "Ready" instead of "idle", "Working..." instead of "busy", nothing instead of "down."

### 6.4 Empty States (`EmptyState.tsx`)

The `EmptyState` component is clean and well-structured. The problem is entirely in the messages passed to it. Every empty state message should be rewritten following these principles:

1. **Tell the user what to do**, not what the system expects.
   - Bad: "Ingest at least one document to populate deterministic scene/style/extraction stages."
   - Good: "Add a manuscript to get started."

2. **Use the user's language**, not the system's.
   - Bad: "Run extraction or relax filters to see entities."
   - Good: "No characters or locations found yet."

3. **Be encouraging**, not clinical.
   - Bad: "No Pipeline Rows"
   - Good: "No activity yet"

The component should also gain an optional `actionLabel` + `onAction` button for cases where the empty state has a clear next step. This is already implemented in the component props but rarely used. For example, the scenes empty state could include an "Add Manuscript" button.

### 6.5 The Persistent Status Bar (`App.tsx`, lines 142-154)

This bar sits between the TopBar and the main content area and displays:
```
phase:idle  queue:0  last-success:2/6/2026, 10:30:00 AM
```

This is a developer debug panel rendered as a permanent UI element. It should be removed entirely. The information it conveys is already partially available through the TopBar's StatusBadge.

If processing status feedback is needed, it should be:
- A thin progress bar at the very top of the window (like many web apps use for page loads)
- Or a brief toast notification when processing completes ("Finished analyzing chapter-03.md")
- Or a subtle text label in the TopBar ("Analyzing..." / nothing when idle)

### 6.6 "Use Fixture" Button (`SetupView.tsx`, line 172)

This button loads test manuscripts from `data/fixtures/` and is a developer convenience that should not appear in production builds. Two approaches:

1. **Feature flag:** Gate behind an environment variable (`VITE_DEV_TOOLS=true`) so it only appears in development.
2. **Remove from UI entirely:** Developers can load fixtures through the command palette or a keyboard shortcut (`Cmd+Shift+F`) that is not discoverable by end users.

### 6.7 Confirm Claim Modal (`App.tsx`, lines 351-364)

The confirm claim modal currently shows:
```
field=eye_color, evidence=3
```

This should display the actual claim information in readable form:
```
Eye Color: "blue"
Based on 3 references from your manuscript
```

The modal message "This creates a confirmed claim and supersedes inferred claims for the same field/value pair while preserving evidence links" should be simplified to "Mark this as confirmed. CanonKeeper will treat it as established fact for your story."

### 6.8 TopBar (`TopBar.tsx`)

The TopBar is mostly well-structured. Recommendations:

- Keep the breadcrumb navigation (`{project} > {section}`)
- Keep the Cmd+K button for the command palette
- Keep the theme toggle
- Move the StatusBadge to show only human-readable states (see 6.3)
- Consider adding a subtle processing indicator (a thin animated line) when the worker is busy

### 6.9 Command Palette (`CommandPalette.tsx`)

The command palette is well-implemented with fuzzy search, keyboard navigation, arrow key support, and category badges. Recommendations:

- Update the diagnostics item subtitle from "Check IPC, worker, sqlite, and writable state" to "Check that your project is working correctly"
- After the navigation restructure, the palette will have fewer navigation items (5 instead of 9), which makes the "Resume" category more prominent -- this is good
- Consider adding common actions: "Add Manuscript," "Export as Markdown," "Toggle Theme"

---

## 7. Accessibility and Polish

### 7.1 What Is Already Well Done

CanonKeeper has a strong accessibility foundation:

- **Focus trapping** in the evidence drawer (`EvidenceDrawer.tsx` lines 58-84): Full Tab/Shift+Tab cycle, Escape to close, focus restoration on close. This is correctly implemented.
- **ARIA attributes** on modals and drawers: `role="dialog"`, `aria-modal="true"`, `aria-label="Evidence"`. The command palette and confirm modal both use proper dialog roles.
- **Keyboard navigation:** The Cmd+K command palette, J/K for list navigation, and bracket keys for section switching provide comprehensive keyboard access. This is above average for Electron apps.
- **Reduced motion support** (`app.css` lines 171-179): `@media (prefers-reduced-motion: reduce)` correctly disables all animations. This is an important accessibility feature that many apps skip.
- **Semantic HTML:** Views use `<section>`, `<article>`, `<header>`, `<nav>`, `<main>`, `<aside>` elements appropriately. The sidebar uses `aria-label="Primary navigation"`.
- **Custom scrollbar styling** that maintains usability while matching the theme.
- **Responsive design** with three breakpoints (mobile < 768px, tablet < 1200px, desktop) and appropriate layout changes.

### 7.2 What Could Improve

**Color contrast in specific contexts:**

- Muted text (`#5f6f6f`) on surface-1 (`#f2ecdf`) produces a contrast ratio of approximately 4.0:1. This passes WCAG AA for normal text (4.5:1 minimum) only if the text is large (18px+). For the 11-12px text used in many places (`text-xs`), this falls short. Recommendation: darken muted text to at least `#4a5858` for small text contexts.
- In dark mode, muted text (`#7a7468`) on surface-2 (`#212b2b`) is approximately 3.8:1 -- below AA for any normal text size. This needs to be lightened.
- The warning color (`#8a5a05`) on warn-soft (`#f8ecd8`) in light mode is approximately 4.3:1 -- borderline. OK for badges (large text) but not for body text.

**Focus indicators:**

- Buttons use `cursor-pointer` and `transition-colors` for hover states, but no visible `:focus-visible` ring is defined beyond browser defaults. Recommendation: add a consistent `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2` utility to all interactive elements, or define it in the base layer.

**Screen reader considerations:**

- The evidence drawer's source label (line 119 in `EvidenceDrawer.tsx`) uses `text-[11px] uppercase tracking-wide` which may be hard to read for low-vision users. Consider using `sr-only` with a more readable alternative, or increasing the minimum size to 12px.
- StatusBadge's animated pulse dot (`animate-pulse-dot`) communicates "busy" visually but provides no text alternative. The `title={status}` attribute helps, but adding `aria-live="polite"` to the badge when the status changes would improve screen reader support.
- The mobile bottom navigation bar does not indicate the active section to screen readers. Add `aria-current="page"` to the active button.

**Keyboard navigation gaps:**

- In the issues view, individual issue cards are clickable `<div>` elements rather than `<button>` elements. This means they are not keyboard-focusable by default. They should either be buttons or receive `tabindex="0"` and `role="button"` with `onKeyDown` handlers for Enter/Space.
- Same issue in the scenes view: table rows are clickable but not keyboard-accessible.
- Entity list items in the Bible view are correctly `<button>` elements. This pattern should be applied consistently.

**Touch targets:**

- Several action buttons (Evidence, Dismiss, Resolve on issue cards) use `px-2 py-1` padding with `text-xs` text. The resulting touch target may be below the recommended 44x44px minimum for mobile. Consider increasing padding on mobile layout or ensuring the minimum touch area through explicit `min-h-[44px] min-w-[44px]` constraints.

### 7.3 Polish Opportunities

- **Loading states:** The `Spinner` component exists but loading states are inconsistent. Some buttons show a spinner when `busy` is true, while others just disable without visual feedback. Standardize: all primary action buttons should show a spinner inside the button when their action is in progress.
- **Transition consistency:** View transitions use `animate-fade-in` (`App.tsx` line 159) but sidebar section changes are instant. Consider a subtle crossfade between views.
- **Error states:** `InlineError` exists but error display is inconsistent. Some errors appear as inline text, some as toast notifications, some as danger-colored spans in the status bar. Standardize on: (1) inline error banners for form-level errors, (2) toast notifications for transient errors, (3) nothing in the status bar.

---

## 8. Proposed New Theme

A comprehensive new theme specification is outside the scope of this review and should be developed in a dedicated document (`docs/THEME_RECOMMENDATIONS.md`). The following summarizes the key principles and provides directional guidance.

### 8.1 Design Principles

1. **Literary, not clinical.** The app should feel like a librarian's desk, not a hospital dashboard. Warm, natural tones. No teal.

2. **Paper, not parchment.** Backgrounds should evoke clean book pages, not aged documents. The current tan/brown palette tries to feel "warm" but overshoots into "dusty."

3. **One accent color used sparingly.** The accent should carry literary associations: deep plum, wine, warm clay, or ink blue. It should appear on primary action buttons, active navigation indicators, and evidence borders -- nowhere else.

4. **Softer contrast for long reading.** Writers will spend extended time reading evidence excerpts and issue descriptions. Text contrast should meet WCAG AAA (7:1) without being as stark as the current 12:1 ratio.

5. **Dark mode as a first-class citizen.** Dark mode should use neutral dark grays (not greenish) with a warm-shifted version of the same accent (lighter, not a completely different hue).

### 8.2 Directional Palette (Light Mode)

| Token | Current | Direction | Notes |
|---|---|---|---|
| Surface (base) | `#f7f3eb` | `#faf9f6` | Clean warm white, like good paper |
| Surface (card) | `#f2ecdf` | `#f5f4f0` | Barely tinted, not visibly tan |
| Surface (input) | `#fffdf8` | `#ffffff` | Pure white for inputs stands out cleanly |
| Surface (secondary) | `#e9dfcc` | `#eceae5` | Neutral warm gray |
| Text (primary) | `#1d2a2a` | `#2d3436` | Slightly softer, no green tint |
| Text (muted) | `#5f6f6f` | `#6b7280` | Neutral gray, not greenish |
| Accent | `#0f5d5d` | `#7c4a6e` (plum) or `#8b5e3c` (clay) | Warm and literary |
| Border | `#d8ccba` | `#e2e0dc` | Nearly invisible neutral |

### 8.3 Directional Palette (Dark Mode)

| Token | Current | Direction | Notes |
|---|---|---|---|
| Surface (base) | `#141a1a` | `#1a1a1e` | Neutral dark, no green |
| Surface (card) | `#1a2222` | `#222226` | Neutral |
| Accent | `#3db8a0` | `#c48bb0` (plum) or `#c49a6c` (clay) | Lighter version of same hue, not a different color |
| Border | `#2e3838` | `#333338` | Neutral |

### 8.4 Typography (No Changes Needed)

The current typography stack is excellent:

- **IBM Plex Sans** for body text: highly readable, professional, neutral
- **Fraunces** for display/headings: a variable serif with optical sizing that carries strong literary personality. This is the single best design decision in the current UI.
- **IBM Plex Mono** for code/data: clean and readable

No changes recommended.

### 8.5 What to Keep from the Current Theme

- The shadow system with warm-tinted `rgba(18, 31, 31, ...)` shadows (adjust tint to match new palette)
- The border radius scale
- The animation tokens and keyframes
- The body gradient technique (subtle radial gradients) -- just change the colors
- The semantic color system (danger/warn/ok) with soft/strong variants
- The scrollbar styling approach

---

---

## Addendum: Live Browser Testing Findings (2026-02-06)

The following observations were made by navigating the running application in Chrome (Vite dev server on localhost:5174) and comparing it with the proposed theme preview.

### A.1 Status Bar Is Worse Than Expected

The raw status ribbon between the TopBar and main content renders as bare, unstyled text: `down`, `queue:0`, `last-success:Never`. In code this looked like a styled status bar, but in the actual rendered UI these are floating key:value pairs with minimal visual structure. This should be the first thing removed — it reads as a debug output strip.

### A.2 Command Palette Subtitles Need the Language Treatment

The `APP_SECTIONS` subtitles feed directly into the command palette (Cmd+K) as the secondary text for each item. Live rendering confirms these are prominent:

| Section | Current Subtitle | Recommended |
|---|---|---|
| Dashboard | "Pipeline overview" | "Your project at a glance" |
| Setup | "Onboarding and diagnostics" | "Get started" |
| Search | "Retrieval and ask" | "Search your manuscript" |
| Scenes | "Scene index" | "Browse scenes" |
| Issues | "Continuity and style flags" | "Review editorial issues" |
| Style | "Diagnostic metrics" | "Writing style patterns" |
| Bible | "Entities and claims" | "Characters and world" |
| Exports | "Markdown and JSON" | "Export your data" |
| Settings | "Runtime health" | "Preferences" |

The "Run Diagnostics" command shows the subtitle "Check IPC, worker, sqlite, and writable state" — this should be hidden from the palette entirely, or reworded to "Check system health."

### A.3 Setup Diagnostics Auto-Surface Developer State

Even without explicitly running diagnostics, the Setup view already displays the health check grid with "ipc: down", "worker: down", "sqlite: error", "writable: error" and the recommendation "Launch CanonKeeper through Electron or attach the RPC bridge." This is because the diagnostics results persist and are shown whenever available. For a writer opening the app outside of Electron (unlikely in production but possible), this is a wall of incomprehensible developer text. The diagnostics should only appear on explicit request and use writer-facing language.

### A.4 Setup "warn" Badge Label Leak

On Setup step 2, the `StatusBadge` renders with the text "warn" — this is the CSS tone name leaking through as the displayed label. It should display "Waiting" or "Pending" instead.

### A.5 Sidebar Keyboard Hints Rendering Artifacts

The keyboard shortcut section at the bottom of the sidebar renders with fragment issues. The `<kbd>` elements combine oddly with surrounding text, appearing as "+ palette", "/ sections", "/ list nav" in the accessibility tree. The visual rendering may be fine (not verifiable without screenshots), but the accessible text is malformed.

### A.6 Theme Preview Comparison

Comparing the current app (tan/teal) and the proposed theme (ivory/plum) side by side in Chrome confirms:

- The current `#f7f3eb` background has a noticeable yellow-brown cast that dominates the viewport
- The proposed `#FAF9F6` is perceptibly warmer and cleaner — closer to actual paper
- The current teal accent (`#0f5d5d`) reads as cold against the warm surfaces, creating visual tension
- The proposed plum accent (`#7B506F`) harmonizes naturally with the warm ivory
- The current dark mode `#141a1a` has a greenish tint visible in the browser; the proposed `#1A1A1F` is neutral
- The proposed dark mode plum (`#C48DB5`) is softer and more inviting than the current mint `#3db8a0`

### A.7 Empty State Copy (Confirmed in Live UI)

Every jargon-heavy empty state message identified in the code review was confirmed in the live rendering:

- Issues: "Ingest additional evidence-backed documents to generate issues."
- Bible: "Run extraction or relax filters to see entities."
- Style: "Run style stage by ingesting documents first."
- Dashboard Pipeline: "Ingest at least one document to populate deterministic scene/style/extraction stages."
- Export: "Run an export to see generated file paths and elapsed time."

These need the plain-language rewrites specified in Section 4.

### A.8 New Recommendation: First-Run Experience

When no project is open, the Dashboard shows a grid of empty cards ("No project opened yet", "No ingestion has run yet") plus empty timeline and event log sections. Combined with the "down" status badge, this is a bleak first impression. The app should detect the no-project state and show the Setup wizard (or a simplified welcome screen) automatically instead of an empty Dashboard.

---

*This review is based on source code analysis and live browser testing of the CanonKeeper renderer (Vite dev server) as of 2026-02-06. The live testing addendum was performed via Chrome browser automation. Component names and line numbers reference the current codebase and will need to be updated if the code changes before implementation begins.*
