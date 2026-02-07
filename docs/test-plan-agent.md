# CanonKeeper AI Agent Test Plan (Detailed)

## 1. Objective
This plan defines a repeatable, machine-oriented validation workflow for AI agents running in CI or local automation.

Goals:
- deterministic pass/fail checks
- explicit command sequence
- reproducible artifacts
- strong coverage of ingestion, retrieval, continuity, style, and export paths

## 2. Inputs and Fixtures
Required fixtures:
- `data/fixtures/simple_md.md`
- `data/fixtures/contradiction.md`
- `data/fixtures/pov_switch.md`
- `data/fixtures/tone_shift.md`
- `data/fixtures/novel_length_fixture.md` (exists in repo)

Per-run isolated project root:
- create temp dir under `/tmp` (or workspace temp directory)
- never reuse existing `.canonkeeper` state

## 3. Preconditions
- Node 25 runtime
- Bun dependencies installed
- Agent has filesystem read/write access to workspace + temp root
- If native module mismatch occurs, rerun install/rebuild before proceeding

## 4. Required Outputs
For each run, agent must produce:
- `output/agent-test/<timestamp>/summary.md`
- `output/agent-test/<timestamp>/assertions.json`
- `output/agent-test/<timestamp>/exports/*`
- `output/agent-test/<timestamp>/logs/*.txt`

`assertions.json` should include each check with fields:
- `id`, `status`, `expected`, `actual`, `evidence`

## 5. Command Sequence

### 5.1 Static Gates
1. `bun run lint:local`
2. `bun run typecheck:local`
3. `bun run test:local`

Hard fail on any non-zero exit.

### 5.2 Worker/API Integration Gate
Run integration tests focusing on RPC + persistence:
- `bun run --cwd apps/desktop test -- electron/worker/rpc.integration.test.ts`

Additional RPC methods that must be exercised (directly or via integration harness):
- `project.getCurrent` — returns active ProjectSummary or null
- `project.stats` — returns aggregate counts (totalPassages, totalDocuments, totalScenes, totalIssues)
- `project.evidenceCoverage` — returns evidence ratios for issues and scenes
- `project.createOrOpen` with `createIfMissing: false` — returns null for non-existent paths
- `jobs.list` — returns queued/failed jobs with type labels and timestamps
- `jobs.cancel` — removes a queued job
- `issues.undoResolve` — returns resolved issue to open status

Record test output in run logs.

### 5.3 App Flow Simulation
Use an automation harness (playwright bridge or equivalent) to execute:
1. Launch app
2. Verify welcome modal appears on first launch; dismiss it
3. Verify sidebar sections are disabled/dimmed before project open
4. Create/open isolated project
5. Verify sidebar sections become enabled after project open
6. Add `contradiction.md`
7. Verify progress banner is visible during processing (shows stage/filename/queue depth)
8. Poll status until idle
9. Verify progress banner auto-hides on completion
10. Query scenes/issues/entities/style/search/ask/export
11. Reload app; verify boot/session restore rehydrates previous project and section
12. Simulate stale project path; verify restore-failed banner with recovery actions

If UI automation is unavailable, call IPC/worker RPC directly in-process and preserve parity checks.

## 6. Deterministic Assertions

### A. Storage + Migrations
- DB file exists at `<projectRoot>/.canonkeeper/canonkeeper.db`
- `schema_migrations` table exists
- `job_queue` table exists
- `chunk_fts` virtual table exists

### B. Ingest + Search
- At least one document row created
- At least one snapshot row created
- Chunk count > 0
- FTS search for known token returns >= 1 result
- FTS search for stopword-only query (e.g., "the a an") returns empty results without error
- FTS search for query with punctuation (e.g., "hello, world!") returns results matching stripped tokens

### C. Scenes
- Scene count > 0
- Scene ordinals are strictly increasing per document
- At least one scene has evidence when metadata is non-unknown
- Every scene row includes `pov_confidence` (number, 0-1 range)

### D. Style
- `style_report` response returns repetition/tone/dialogue payloads
- At least one style issue exists for `tone_shift.md` or `novel_length_fixture.md`
- Every repetition issue has a defined `ngram` (non-empty string) and positive `count` (> 0); no `undefined` values

### E. Characters & World + Details

- Entity list not empty after contradiction + long-form ingest
- For surfaced details in entity detail: evidence count >= 1
- Confirm detail requires `sourceClaimId` (backend RPC name)
- Confirmed detail persists and remains evidence-backed

### F. Issues Lifecycle

- Contradiction fixture yields continuity issue(s)
- Dismiss transitions issue status to dismissed
- Undo dismiss returns status to open
- Resolve transitions status to resolved
- `issues.undoResolve` returns resolved issue to open status
- `clearIssuesByType` only deletes issues with `status = 'open'`; resolved and dismissed issues are preserved
- Issue rows include timestamps; `relativeTime()` formatting produces human-readable labels

### G. Ask

- Known question returns `answer` or `snippets`
- Unknown question returns `not_found`
- No response variant includes uncited fabricated narrative
- Stopword-heavy queries are handled gracefully (stopword filtering + OR-fallback strategy)
- Punctuation in queries does not cause FTS errors

### H. Export

- `export.run(kind=md)` returns success + files list
- `export.run(kind=json)` returns success + files list
- Exported files exist on disk

### I. Long-Form Stress

After ingesting `novel_length_fixture.md`:

- Worker reaches idle state within timeout budget (configurable)
- UI/API endpoints remain responsive
- No fatal runtime errors in logs

### J. Session Persistence

- `loadSession` / `saveSession` round-trip: save envelope, reload, verify all fields restored
- `bootDecision` returns correct action for each scenario: adopt-current, restore-last, fresh-start, stale-root
- Persisted per-project UI state (filters, selections) survives app reload and is scoped by project ID
- Boot timeout fires after 15 seconds of unresolved restore; app falls back to fresh start
- Legacy migration: old flat localStorage keys are read into `_legacy` project entry and cleaned up

### K. Evidence Coverage

- `project.evidenceCoverage` returns `{ issues: { total, withEvidence }, scenes: { total, withEvidence } }`
- Ratios are consistent: `withEvidence <= total` for both domains
- `project.stats` returns non-negative integers for totalPassages, totalDocuments, totalScenes, totalIssues
- After ingestion, stats counts are > 0 for relevant domains

### L. Job Queue

- `jobs.list` returns array of queued/failed jobs with type labels and timestamps
- After enqueuing work, `jobs.list` includes pending entries
- `jobs.cancel` on a queued job removes it from the list
- `jobs.cancel` on a non-existent job ID does not error

## 7. Timeout + Retry Policy

- Poll interval: 1-2 seconds
- Stage timeout: 120 seconds for standard fixtures
- Long fixture timeout: 600 seconds (configurable by machine capacity)
- Retry flaky transport operations up to 2 attempts with backoff
- Do not retry logical assertion failures

## 8. Failure Classification

Classify failures as:

- `infra` (env/runtime/tooling)
- `pipeline` (ingest/scenes/style/extraction/continuity)
- `api` (IPC/RPC contract)
- `ui` (render interaction/state wiring)
- `data` (missing/invalid evidence or export mismatch)
- `state` (persistence/boot/session restore failures)

Include likely owner and first suspected subsystem.

## 9. Agent Safety Rules

- Never edit manuscript source fixtures during assertions
- Never mutate user project folders outside isolated temp roots
- Never auto-accept low-evidence claims as passing conditions
- On partial failure, continue remaining independent checks and emit full report

## 10. Pass Criteria

Run is `PASS` only when:

- static gates succeed
- all critical assertions (A, B, C, E, F, G, H, J, K, L) pass
- long-form stress (I) passes or is explicitly waived with reason
- no blocker-level errors in logs

## 11. Minimal Report Template (`summary.md`)

- Run metadata (timestamp, commit SHA, environment)
- Command results table
- Assertion totals (pass/fail/skipped)
- Top failures with reproduction pointers
- Export artifact paths
- Final verdict: `PASS` or `FAIL`
