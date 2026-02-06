# CanonKeeper High-Fidelity Validation Plan

This plan is intentionally biased toward "how a writer actually uses the app" while staying executable in CI and local automation.

## Goals
- Validate evidence-first behavior end to end.
- Validate local-first desktop flows from project creation to export.
- Catch regressions in worker/background processing, IPC, and renderer UX.
- Keep deterministic checks in CI, with richer interactive checks available locally.

## Test layers

### 1. Fast deterministic gate (every PR, CI)
- Run containerized static + unit/integration checks:
  - `bun run lint`
  - `bun run typecheck`
  - `bun run test`
  - `bun run build`
- Environment: Docker Compose services baked with Buildx (`ci` group).
- Purpose: fail fast for syntax, typing, storage/pipeline logic, schema handling, and regressions already covered by Vitest.

### 2. Desktop contract gate (every PR, CI)
- Add a focused integration suite for IPC contracts:
  - `project.createOrOpen`, `project.addDocument`, `project.getStatus`
  - `bible.getEntity`, `issues.list`, `issues.resolve`, `search.ask`, `export.run`
- Run against a temporary project root and fixture documents.
- Assertions:
  - No claim surfaced without evidence.
  - Confirmed claim actions require evidence-backed source claims.
  - Ask returns only snippets or `not_found`.
  - Scene export never fabricates citations.

### 3. Simulated user journey (nightly + release candidate)
- Use Playwright against the renderer UI in a browser-hosted harness (Vite renderer mode).
- Scenario script:
  1. Open project directory.
  2. Add fixture manuscript (`simple_md.md` / `contradiction.md`).
  3. Wait for ingest completion from status panel.
  4. Navigate tabs: Dashboard → Bible → Scenes → Issues → Style → Ask.
  5. Confirm a claim from an evidence-backed entry.
  6. Resolve/dismiss an issue.
  7. Run Ask query and verify snippet citations.
  8. Export markdown/json and verify files exist + citation structure.
- Artifacts to collect:
  - Playwright trace/video/screenshots.
  - Exported files.
  - Worker event timeline JSON from `project.getHistory`.

### 4. Full desktop smoke (manual + scripted where feasible)
- Manual smoke on macOS host (closest to real user interaction):
  - `bun run dev:local`
  - Exercise native file pickers and full Electron shell behavior.
- Optional scripted smoke with Playwright Electron mode if available in environment.
- Checklist:
  - First-run project creation is clear.
  - Document add + re-ingest after file edit works.
  - Evidence highlights and line metadata are visible.
  - No prose generation in Ask responses.

## Data matrix
- Use existing fixtures plus two additions:
  - `mixed_quotes.md`: curly + straight quote dialogue attribution.
  - `large_revision.md`: multi-scene file with edits to test incremental reprocessing.
- Run each journey with:
  - NullProvider mode.
  - CloudProvider disabled (no key) to ensure graceful fallback.

## Failure triage policy
- P0: evidence-first violation, manuscript mutation, IPC contract break.
- P1: incorrect continuity/stylistic detection with evidence.
- P2: UI state refresh glitches or non-blocking UX regressions.

## Rollout cadence
- PR: layers 1 + 2.
- Nightly: layers 1 + 2 + 3.
- Pre-release: layers 1 + 2 + 3 + 4.
