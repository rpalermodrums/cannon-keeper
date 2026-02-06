import type { JSX } from "react";
import type { ExportResult } from "../api/ipc";
import { EmptyState } from "../components/EmptyState";

type ExportViewProps = {
  busy: boolean;
  exportDir: string;
  exportKind: "md" | "json";
  lastResult: ExportResult | null;
  onExportDirChange: (value: string) => void;
  onExportKindChange: (kind: "md" | "json") => void;
  onPickExportDir: () => void;
  onRunExport: () => void;
};

export function ExportView({
  busy,
  exportDir,
  exportKind,
  lastResult,
  onExportDirChange,
  onExportKindChange,
  onPickExportDir,
  onRunExport
}: ExportViewProps): JSX.Element {
  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h2 className="page-title">Exports</h2>
          <p className="page-subtitle">Run deterministic markdown/json exports with explicit progress receipts.</p>
        </div>
      </header>

      <article className="panel stack">
        <label>
          Output directory
          <input value={exportDir} onChange={(event) => onExportDirChange(event.target.value)} placeholder="/Users/.../exports" />
        </label>

        <label>
          Export kind
          <select value={exportKind} onChange={(event) => onExportKindChange(event.target.value as "md" | "json")}>
            <option value="md">Markdown bundle</option>
            <option value="json">JSON dump</option>
          </select>
        </label>

        <div className="row">
          <button className="primary" type="button" onClick={onRunExport} disabled={busy || !exportDir.trim()}>
            Run Export
          </button>
          <button type="button" onClick={onPickExportDir} disabled={busy}>
            Browse
          </button>
        </div>
      </article>

      {!lastResult ? (
        <EmptyState title="No Exports Yet" message="Run an export to see generated file paths and elapsed time." />
      ) : lastResult.ok ? (
        <article className="panel stack">
          <h3>Last Export Succeeded</h3>
          <p className="metric-label">Elapsed: {lastResult.elapsedMs} ms</p>
          <ul className="list">
            {lastResult.files.map((file) => (
              <li className="list-item mono" key={file}>
                {file}
              </li>
            ))}
          </ul>
        </article>
      ) : (
        <article className="panel stack">
          <h3>Last Export Failed</h3>
          <p>{lastResult.error}</p>
        </article>
      )}
    </section>
  );
}
