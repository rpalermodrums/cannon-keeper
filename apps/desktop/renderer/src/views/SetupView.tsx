import type { JSX } from "react";
import type { SystemHealthCheck } from "../api/ipc";
import { EmptyState } from "../components/EmptyState";
import { StatusBadge } from "../components/StatusBadge";

type SetupViewProps = {
  busy: boolean;
  rootPath: string;
  docPath: string;
  healthCheck: SystemHealthCheck | null;
  onRootPathChange: (value: string) => void;
  onDocPathChange: (value: string) => void;
  onPickProjectRoot: () => void;
  onCreateProject: () => void;
  onPickDocument: () => void;
  onUseFixture: () => void;
  onAddDocument: () => void;
  onRunPreflight: () => void;
};

export function SetupView({
  busy,
  rootPath,
  docPath,
  healthCheck,
  onRootPathChange,
  onDocPathChange,
  onPickProjectRoot,
  onCreateProject,
  onPickDocument,
  onUseFixture,
  onAddDocument,
  onRunPreflight
}: SetupViewProps): JSX.Element {
  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h2 className="page-title">Setup Wizard</h2>
          <p className="page-subtitle">
            Step 1: Open project. Step 2: Add manuscript files. Step 3: Run diagnostics before deeper work.
          </p>
        </div>
      </header>

      <article className="panel stack">
        <h3>1. Choose Project Path</h3>
        <label>
          Project root
          <input
            value={rootPath}
            onChange={(event) => onRootPathChange(event.target.value)}
            placeholder="/Users/.../my-novel"
          />
        </label>
        <div className="row">
          <button className="primary" type="button" onClick={onCreateProject} disabled={busy || !rootPath.trim()}>
            Create / Open Project
          </button>
          <button type="button" onClick={onPickProjectRoot} disabled={busy}>
            Browse
          </button>
        </div>
      </article>

      <article className="panel stack">
        <h3>2. Add Document</h3>
        <label>
          Manuscript path (.md, .txt, .docx)
          <input
            value={docPath}
            onChange={(event) => onDocPathChange(event.target.value)}
            placeholder="/Users/.../chapter-01.md"
          />
        </label>
        <div className="row">
          <button className="primary" type="button" onClick={onAddDocument} disabled={busy || !docPath.trim()}>
            Add Document
          </button>
          <button type="button" onClick={onPickDocument} disabled={busy}>
            Browse
          </button>
          <button type="button" onClick={onUseFixture} disabled={busy}>
            Use Fixture
          </button>
        </div>
      </article>

      <article className="panel stack">
        <h3>3. Environment Diagnostics</h3>
        <div className="row">
          <button className="primary" type="button" onClick={onRunPreflight} disabled={busy}>
            Retry Diagnostics
          </button>
        </div>

        {!healthCheck ? (
          <EmptyState
            title="No Diagnostics Yet"
            message="Run diagnostics to verify IPC, worker reachability, sqlite native module, and write permissions."
          />
        ) : (
          <div className="card-grid">
            <article className="card">
              <h3>IPC</h3>
              <StatusBadge label={healthCheck.ipc} status={healthCheck.ipc} />
            </article>
            <article className="card">
              <h3>Worker</h3>
              <StatusBadge label={healthCheck.worker} status={healthCheck.worker} />
            </article>
            <article className="card">
              <h3>SQLite</h3>
              <StatusBadge label={healthCheck.sqlite} status={healthCheck.sqlite} />
            </article>
            <article className="card">
              <h3>Writable</h3>
              <StatusBadge label={healthCheck.writable} status={healthCheck.writable} />
            </article>
            {healthCheck.details.length > 0 ? (
              <article className="card" style={{ gridColumn: "1 / -1" }}>
                <h3>Recovery Guidance</h3>
                <ul className="list">
                  {healthCheck.details.map((detail) => (
                    <li key={detail} className="list-item">
                      {detail}
                    </li>
                  ))}
                </ul>
                {healthCheck.sqlite === "missing_native" ? (
                  <div className="mono">Run: bun install (or npm rebuild better-sqlite3)</div>
                ) : null}
              </article>
            ) : null}
          </div>
        )}
      </article>
    </section>
  );
}
