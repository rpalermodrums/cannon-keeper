# CanonKeeper Testing Execution Prompt (For Next Agent)

You are the testing agent for CanonKeeper. Your mission is to execute a thorough, evidence-driven validation pass using `/Users/ryanpalermo/projects/cannon-keeper/docs/testing-plan.md` as the source of truth.

## Primary Objective
Validate CanonKeeper end-to-end with the highest fidelity possible in this environment, prioritizing:
1. Evidence-first correctness and trust boundaries.
2. Realistic user workflows from project setup to export.
3. Reliable, reproducible execution in the current Docker + Bun setup.

## Repository + Tooling Context
- Repo root: `/Users/ryanpalermo/projects/cannon-keeper`
- Package manager: `bun`
- Default scripts are dockerized via Compose + Buildx Bake.
- CI mirrors dockerized commands.
- Canonical runbook: `/Users/ryanpalermo/projects/cannon-keeper/docs/testing-plan.md`

## Required Approach
Work top-to-bottom through the testing plan and execute what is currently marked as implemented, then implement and run what is still planned where feasible.

### Phase A: Baseline Deterministic Validation (must run)
Run the CI-equivalent commands exactly:

```bash
bun run docker:bake:ci
bun run docker:lint
bun run docker:typecheck
bun run docker:test
bun run docker:build
```

Also run local fallback checks to compare behavior:

```bash
bun run lint:local
bun run typecheck:local
bun run build:local
CANONKEEPER_ALLOW_UNSUPPORTED_NODE=1 bun run test:local
```

Record any mismatch between dockerized and local outcomes.

### Phase B: IPC Contract Testing (must implement/expand)
Add and run dedicated RPC/IPC integration coverage per `testing-plan.md` Layer 2 for:
- `project.createOrOpen`
- `project.addDocument`
- `project.getStatus`
- `project.getProcessingState`
- `bible.getEntity`
- `issues.list`
- `issues.resolve`
- `search.ask`
- `export.run`

Minimum assertions:
- No surfaced claims without evidence.
- `canon.confirmClaim` requires evidence-backed `sourceClaimId`.
- Ask returns only `snippets` or `not_found`.
- Scene export never fabricates citations.

### Phase C: Simulated User Journey (implement if feasible)
Use Playwright (prefer the local Playwright skill workflow) to automate the end-user path from the testing plan:
- Open/select project
- Add fixtures
- Wait for ingest completion
- Traverse all main tabs
- Confirm claim / resolve issue
- Ask question and verify citations
- Export outputs and verify content shape

Capture artifacts:
- trace
- screenshots/video
- exported files
- `project.getHistory` snapshot

If full Playwright automation is blocked by environment constraints, provide the maximum achievable partial automation plus an explicit manual checklist and gaps.

### Phase D: Fixture/Data Matrix Completion
Use existing fixtures and add missing fixtures from the testing plan if absent:
- `mixed_quotes.md`
- `large_revision.md`

Validate NullProvider / no-key cloud-disabled behavior.

## Deliverables (required)
Create a testing report markdown file at:
- `/Users/ryanpalermo/projects/cannon-keeper/docs/testing-report.md`

Report structure:
1. **Environment**
2. **Commands Executed**
3. **Results by Test Layer**
4. **Defects Found** (severity P0/P1/P2 from testing plan)
5. **Coverage Gaps / Blockers**
6. **Artifacts Produced** (paths)
7. **Recommended Next Actions**

If defects are found:
- Include exact reproduction steps.
- Include impacted files/modules.
- Include expected vs actual behavior.

## Constraints
- Do not weaken evidence-first requirements.
- Do not remove or dilute test assertions to make failures pass.
- Prefer adding tests and tooling over ad-hoc manual confidence.
- Keep changes scoped to testing/harness/docs unless a blocker absolutely requires a minimal product fix.

## Completion Criteria
Task is complete only when:
- Baseline dockerized and local validation results are documented.
- IPC contract testing coverage is expanded and executed.
- User-journey automation/manual fidelity results are documented.
- `docs/testing-report.md` is complete and actionable.
- All new/updated test artifacts are committed in logical commits.
