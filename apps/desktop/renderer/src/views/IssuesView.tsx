import type { JSX } from "react";
import type { IssueSummary } from "../api/ipc";
import { EmptyState } from "../components/EmptyState";
import { FilterBar, FilterGroup } from "../components/FilterBar";
import { StatusBadge } from "../components/StatusBadge";

type IssueFilters = {
  status: "open" | "dismissed" | "resolved" | "all";
  severity: "all" | "low" | "medium" | "high";
  type: string;
  query: string;
};

type IssuesViewProps = {
  busy: boolean;
  issues: IssueSummary[];
  selectedIssueId: string;
  filters: IssueFilters;
  onFiltersChange: (next: IssueFilters) => void;
  onRefresh: () => void;
  onSelectIssue: (issueId: string) => void;
  onRequestDismiss: (issue: IssueSummary) => void;
  onResolve: (issueId: string) => void;
  onOpenEvidence: (title: string, issue: IssueSummary) => void;
};

export function IssuesView({
  busy,
  issues,
  selectedIssueId,
  filters,
  onFiltersChange,
  onRefresh,
  onSelectIssue,
  onRequestDismiss,
  onResolve,
  onOpenEvidence
}: IssuesViewProps): JSX.Element {
  const filtered = issues.filter((issue) => {
    const statusMatch = filters.status === "all" || issue.status === filters.status;
    const severityMatch = filters.severity === "all" || issue.severity === filters.severity;
    const typeMatch = !filters.type || issue.type === filters.type;
    const query = filters.query.trim().toLowerCase();
    const queryMatch =
      query.length === 0 ||
      `${issue.title} ${issue.description} ${issue.type}`.toLowerCase().includes(query);
    return statusMatch && severityMatch && typeMatch && queryMatch;
  });

  const knownTypes = Array.from(new Set(issues.map((issue) => issue.type))).sort();

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h2 className="page-title">Issues</h2>
          <p className="page-subtitle">
            Evidence-backed continuity and style triage. Dismiss requires a reason and supports undo.
          </p>
        </div>
        <button className="primary" type="button" onClick={onRefresh} disabled={busy}>
          Refresh Issues
        </button>
      </header>

      <FilterBar
        actions={
          <button
            type="button"
            className="ghost"
            onClick={() =>
              onFiltersChange({
                status: "open",
                severity: "all",
                type: "",
                query: ""
              })
            }
          >
            Reset Filters
          </button>
        }
      >
        <FilterGroup label="Status">
          <select
            value={filters.status}
            onChange={(event) => onFiltersChange({ ...filters, status: event.target.value as IssueFilters["status"] })}
          >
            <option value="open">Open</option>
            <option value="dismissed">Dismissed</option>
            <option value="resolved">Resolved</option>
            <option value="all">All</option>
          </select>
        </FilterGroup>
        <FilterGroup label="Severity">
          <select
            value={filters.severity}
            onChange={(event) =>
              onFiltersChange({ ...filters, severity: event.target.value as IssueFilters["severity"] })
            }
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </FilterGroup>
        <FilterGroup label="Type">
          <select value={filters.type} onChange={(event) => onFiltersChange({ ...filters, type: event.target.value })}>
            <option value="">All</option>
            {knownTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup label="Query">
          <input
            value={filters.query}
            onChange={(event) => onFiltersChange({ ...filters, query: event.target.value })}
            placeholder="Search title or description"
          />
        </FilterGroup>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState title="No Matching Issues" message="Adjust filters or ingest additional evidence-backed documents." />
      ) : (
        <ul className="list">
          {filtered.map((issue) => (
            <li
              className={`list-item ${selectedIssueId === issue.id ? "active" : ""}`}
              key={issue.id}
              onClick={() => onSelectIssue(issue.id)}
            >
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>{issue.title}</strong>
                  <div className="metric-label">{issue.description}</div>
                </div>
                <div className="row">
                  <StatusBadge label={issue.severity} status={issue.severity} />
                  <StatusBadge label={issue.status} status={issue.status} />
                </div>
              </div>

              <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                <div className="mono">{issue.type}</div>
                <div className="row">
                  <button type="button" onClick={() => onOpenEvidence(issue.title, issue)}>
                    Evidence ({issue.evidence.length})
                  </button>
                  <button type="button" onClick={() => onRequestDismiss(issue)} disabled={issue.status !== "open"}>
                    Dismiss
                  </button>
                  <button type="button" onClick={() => onResolve(issue.id)} disabled={issue.status !== "open"}>
                    Resolve
                  </button>
                </div>
              </div>

              {issue.evidence.length > 0 ? (
                <div className="card-grid" style={{ marginTop: 10 }}>
                  {issue.evidence.slice(0, 2).map((item, idx) => (
                    <article className="card" key={`${issue.id}-e-${idx}`}>
                      <div className="mono">
                        {item.documentPath ?? "unknown"} | chunk {item.chunkOrdinal ?? "?"}
                      </div>
                      <div className="evidence-quote">&quot;{item.excerpt}&quot;</div>
                    </article>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export type { IssueFilters };
