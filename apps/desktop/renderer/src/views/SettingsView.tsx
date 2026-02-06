import type { JSX } from "react";
import type { SystemHealthCheck, WorkerStatus } from "../api/ipc";
import { StatusBadge } from "../components/StatusBadge";

type SettingsViewProps = {
  status: WorkerStatus | null;
  healthCheck: SystemHealthCheck | null;
  onRunDiagnostics: () => void;
};

export function SettingsView({ status, healthCheck, onRunDiagnostics }: SettingsViewProps): JSX.Element {
  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h2 className="page-title">Settings and Diagnostics</h2>
          <p className="page-subtitle">Environment checks and runtime health summary for troubleshooting.</p>
        </div>
      </header>

      <article className="panel stack">
        <h3>Runtime</h3>
        <div className="row">
          <StatusBadge label={status?.state ?? "disconnected"} status={status?.state ?? "down"} />
          {status?.workerState ? (
            <StatusBadge label={status.workerState} status={status.workerState} />
          ) : null}
        </div>
        <button className="primary" type="button" onClick={onRunDiagnostics}>
          Run Diagnostics
        </button>
      </article>

      {healthCheck ? (
        <article className="panel stack">
          <h3>Health Check</h3>
          <div className="row">
            <StatusBadge label={`IPC ${healthCheck.ipc}`} status={healthCheck.ipc} />
            <StatusBadge label={`Worker ${healthCheck.worker}`} status={healthCheck.worker} />
            <StatusBadge label={`SQLite ${healthCheck.sqlite}`} status={healthCheck.sqlite} />
            <StatusBadge label={`Writable ${healthCheck.writable}`} status={healthCheck.writable} />
          </div>
          {healthCheck.details.length > 0 ? (
            <ul className="list">
              {healthCheck.details.map((detail) => (
                <li className="list-item" key={detail}>
                  {detail}
                </li>
              ))}
            </ul>
          ) : (
            <p className="metric-label">All checks passed.</p>
          )}
        </article>
      ) : null}
    </section>
  );
}
