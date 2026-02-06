import type { JSX } from "react";
import type { IngestResult, ProjectSummary, WorkerStatus } from "../api/ipc";
import { EmptyState } from "../components/EmptyState";
import { StatusBadge } from "../components/StatusBadge";

type DashboardViewProps = {
  project: ProjectSummary | null;
  status: WorkerStatus | null;
  processingState: Array<{
    document_id: string;
    snapshot_id: string;
    stage: string;
    status: string;
    error: string | null;
    updated_at: number;
    document_path: string;
  }>;
  history: {
    snapshots: Array<{
      id: string;
      document_id: string;
      document_path: string;
      version: number;
      created_at: number;
    }>;
    events: Array<{
      id: string;
      project_id: string;
      ts: number;
      level: "info" | "warn" | "error";
      event_type: string;
      payload_json: string;
    }>;
  } | null;
  lastIngest: IngestResult | null;
  continueIssueId: string | null;
  continueEntityId: string | null;
  continueSceneId: string | null;
  onJumpToIssue: () => void;
  onJumpToEntity: () => void;
  onJumpToScene: () => void;
};

function formatWorkerLabel(status: WorkerStatus | null): string {
  if (!status) {
    return "Disconnected";
  }
  return status.lastJob ? `${status.state} (${status.lastJob})` : status.state;
}

function inferStatusTone(status: WorkerStatus | null): string {
  if (!status) {
    return "down";
  }
  if (status.workerState === "down") {
    return "down";
  }
  return status.state === "busy" ? "busy" : "ok";
}

export function DashboardView({
  project,
  status,
  processingState,
  history,
  lastIngest,
  continueIssueId,
  continueEntityId,
  continueSceneId,
  onJumpToIssue,
  onJumpToEntity,
  onJumpToScene
}: DashboardViewProps): JSX.Element {
  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">
            Monitor ingestion, inspect recent activity, and continue from your last triage context.
          </p>
        </div>
      </header>

      <div className="card-grid">
        <article className="card">
          <h3>Worker Status</h3>
          <StatusBadge label={formatWorkerLabel(status)} status={inferStatusTone(status)} />
          <p className="metric-label">Queue depth: {status?.queueDepth ?? 0}</p>
        </article>
        <article className="card">
          <h3>Project</h3>
          {project ? (
            <>
              <p className="metric">{project.name}</p>
              <p className="metric-label mono">{project.root_path}</p>
            </>
          ) : (
            <p className="metric-label">No project opened yet.</p>
          )}
        </article>
        <article className="card">
          <h3>Last Ingest</h3>
          {lastIngest ? (
            <>
              <p className="metric mono">{lastIngest.documentId.slice(0, 8)}</p>
              <p className="metric-label">
                +{lastIngest.chunksCreated} created / {lastIngest.chunksUpdated} updated / {lastIngest.chunksDeleted}{" "}
                deleted
              </p>
            </>
          ) : (
            <p className="metric-label">No ingestion has run yet.</p>
          )}
        </article>
      </div>

      <article className="panel">
        <h3>Continue Where You Left Off</h3>
        <div className="row">
          <button type="button" onClick={onJumpToIssue} disabled={!continueIssueId}>
            Resume Issue
          </button>
          <button type="button" onClick={onJumpToEntity} disabled={!continueEntityId}>
            Resume Entity
          </button>
          <button type="button" onClick={onJumpToScene} disabled={!continueSceneId}>
            Resume Scene
          </button>
        </div>
      </article>

      <article className="panel">
        <h3>Pipeline Timeline</h3>
        {processingState.length === 0 ? (
          <EmptyState
            title="No Pipeline Rows"
            message="Ingest at least one document to populate deterministic scene/style/extraction stages."
          />
        ) : (
          <ul className="list">
            {processingState.map((row) => (
              <li key={`${row.document_id}-${row.stage}`} className="list-item">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <strong>{row.stage}</strong>
                  <StatusBadge label={row.status} status={row.status} />
                </div>
                <div className="metric-label mono">{row.document_path}</div>
                {row.error ? <div className="metric-label">Error: {row.error}</div> : null}
                <div className="metric-label">Updated {new Date(row.updated_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="panel">
        <h3>Recent Event Log</h3>
        {!history || history.events.length === 0 ? (
          <p className="metric-label">No recent events.</p>
        ) : (
          <ul className="list">
            {history.events.slice(0, 12).map((event) => (
              <li className="list-item" key={event.id}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="mono">{event.event_type}</span>
                  <StatusBadge label={event.level} status={event.level} />
                </div>
                <div className="metric-label">{new Date(event.ts).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
