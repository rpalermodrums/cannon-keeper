import type { JSX } from "react";
import { CheckCircle, FolderOpen, FolderSearch, RefreshCw } from "lucide-react";
import type { SystemHealthCheck } from "../api/ipc";
import { EmptyState } from "../components/EmptyState";
import { Spinner } from "../components/Spinner";
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

const steps = [
  { num: 1, label: "Choose Project" },
  { num: 2, label: "Add Document" },
  { num: 3, label: "Diagnostics" }
] as const;

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
    <section className="flex flex-col gap-4">
      <header>
        <h2 className="m-0 font-display text-2xl font-bold">Setup Wizard</h2>
        <p className="mt-1 text-sm text-text-muted">
          Step 1: Open project. Step 2: Add manuscript files. Step 3: Run diagnostics before deeper work.
        </p>
      </header>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-0 py-2">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent bg-accent-soft text-xs font-bold text-accent-strong">
                {step.num}
              </div>
              <span className="text-xs text-text-muted">{step.label}</span>
            </div>
            {i < steps.length - 1 ? (
              <div className="mx-3 h-0.5 w-12 bg-border" />
            ) : null}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      <article className="flex flex-col gap-3 rounded-md border border-border bg-white/75 p-4 shadow-sm dark:bg-surface-2/60">
        <h3 className="m-0 text-sm font-semibold">1. Choose Project Path</h3>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Project root
          <div className="flex gap-2">
            <input
              className="flex-1"
              value={rootPath}
              onChange={(e) => onRootPathChange(e.target.value)}
              placeholder="/Users/.../my-novel"
            />
            <button
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm transition-colors hover:enabled:bg-white cursor-pointer disabled:opacity-50 dark:bg-surface-1"
              type="button"
              onClick={onPickProjectRoot}
              disabled={busy}
            >
              <FolderSearch size={16} />
              Browse
            </button>
          </div>
        </label>
        <button
          className="self-start rounded-sm border border-accent bg-accent px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-accent-strong cursor-pointer disabled:opacity-50"
          type="button"
          onClick={onCreateProject}
          disabled={busy || !rootPath.trim()}
        >
          {busy ? <Spinner size="sm" /> : "Create / Open Project"}
        </button>
      </article>

      {/* Step 2 */}
      <article className="flex flex-col gap-3 rounded-md border border-border bg-white/75 p-4 shadow-sm dark:bg-surface-2/60">
        <h3 className="m-0 text-sm font-semibold">2. Add Document</h3>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Manuscript path (.md, .txt, .docx)
          <div className="flex gap-2">
            <input
              className="flex-1"
              value={docPath}
              onChange={(e) => onDocPathChange(e.target.value)}
              placeholder="/Users/.../chapter-01.md"
            />
            <button
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm transition-colors hover:enabled:bg-white cursor-pointer disabled:opacity-50 dark:bg-surface-1"
              type="button"
              onClick={onPickDocument}
              disabled={busy}
            >
              <FolderSearch size={16} />
              Browse
            </button>
          </div>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-sm border border-accent bg-accent px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-accent-strong cursor-pointer disabled:opacity-50"
            type="button"
            onClick={onAddDocument}
            disabled={busy || !docPath.trim()}
          >
            {busy ? <Spinner size="sm" /> : "Add Document"}
          </button>
          <button
            className="rounded-sm border border-border bg-surface-2 px-3 py-2 text-sm transition-colors hover:enabled:bg-white cursor-pointer disabled:opacity-50 dark:bg-surface-1"
            type="button"
            onClick={onUseFixture}
            disabled={busy}
          >
            Use Fixture
          </button>
        </div>
      </article>

      {/* Step 3 */}
      <article className="flex flex-col gap-3 rounded-md border border-border bg-white/75 p-4 shadow-sm dark:bg-surface-2/60">
        <h3 className="m-0 text-sm font-semibold">3. Environment Diagnostics</h3>
        <button
          className="inline-flex items-center gap-1.5 self-start rounded-sm border border-accent bg-accent px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-accent-strong cursor-pointer disabled:opacity-50"
          type="button"
          onClick={onRunPreflight}
          disabled={busy}
        >
          <RefreshCw size={16} />
          {busy ? "Running..." : "Retry Diagnostics"}
        </button>

        {!healthCheck ? (
          <EmptyState
            icon={FolderOpen}
            title="No Diagnostics Yet"
            message="Run diagnostics to verify IPC, worker reachability, sqlite native module, and write permissions."
          />
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["ipc", "worker", "sqlite", "writable"] as const).map((key) => (
              <div key={key} className="flex flex-col items-center gap-2 rounded-sm border border-border bg-surface-2/50 p-3 dark:bg-surface-1/50">
                <CheckCircle size={20} className={healthCheck[key] === "ok" ? "text-ok" : "text-danger"} />
                <span className="text-xs font-medium uppercase tracking-wide text-text-muted">{key}</span>
                <StatusBadge label={healthCheck[key]} status={healthCheck[key]} />
              </div>
            ))}
            {healthCheck.details.length > 0 ? (
              <div className="col-span-full rounded-sm border border-border bg-surface-2/50 p-3 dark:bg-surface-1/50">
                <h4 className="m-0 mb-2 text-sm font-semibold">Recovery Guidance</h4>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                  {healthCheck.details.map((detail) => (
                    <li key={detail} className="text-sm text-text-secondary">{detail}</li>
                  ))}
                </ul>
                {healthCheck.sqlite === "missing_native" ? (
                  <div className="mt-2 font-mono text-xs text-text-muted">Run: bun install (or npm rebuild better-sqlite3)</div>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </article>
    </section>
  );
}
