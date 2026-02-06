import { useMemo, useState, type JSX } from "react";
import type { EvidenceItem, IssueSummary, StyleReport } from "../api/ipc";
import { EmptyState } from "../components/EmptyState";

type RepetitionEntry = {
  ngram: string;
  count: number;
  examples?: Array<{
    chunkId: string;
    quoteStart: number;
    quoteEnd: number;
    documentPath?: string | null;
    chunkOrdinal?: number | null;
    excerpt?: string;
    lineStart?: number | null;
    lineEnd?: number | null;
  }>;
};

type StyleViewProps = {
  busy: boolean;
  report: StyleReport | null;
  styleIssues: IssueSummary[];
  onRefresh: () => void;
  onOpenIssueEvidence: (title: string, issue: IssueSummary) => void;
  onOpenMetricEvidence: (title: string, evidence: EvidenceItem[]) => void;
};

function toRepetitionEntries(report: StyleReport | null): RepetitionEntry[] {
  if (!report?.repetition || typeof report.repetition !== "object") {
    return [];
  }
  const top = (report.repetition as { top?: RepetitionEntry[] }).top;
  return Array.isArray(top) ? top : [];
}

export function StyleView({
  busy,
  report,
  styleIssues,
  onRefresh,
  onOpenIssueEvidence,
  onOpenMetricEvidence
}: StyleViewProps): JSX.Element {
  const [sortBy, setSortBy] = useState<"count" | "ngram">("count");
  const entries = useMemo(() => {
    const base = toRepetitionEntries(report);
    return [...base].sort((a, b) => {
      if (sortBy === "count") {
        return b.count - a.count;
      }
      return a.ngram.localeCompare(b.ngram);
    });
  }, [report, sortBy]);

  const toneIssues = styleIssues.filter((issue) => issue.type === "tone_drift");
  const dialogueIssues = styleIssues.filter((issue) => issue.type === "dialogue_tic");

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h2 className="page-title">Style Report</h2>
          <p className="page-subtitle">
            Diagnostic-only style signals across repetition, tone drift, and dialogue tics.
          </p>
        </div>
        <button className="primary" type="button" onClick={onRefresh} disabled={busy}>
          Refresh Style
        </button>
      </header>

      {!report ? (
        <EmptyState title="No Style Data" message="Run style stage by ingesting documents first." />
      ) : (
        <>
          <article className="panel stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h3>Repetition</h3>
              <label>
                Sort
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "count" | "ngram")}>
                  <option value="count">Count</option>
                  <option value="ngram">Ngram</option>
                </select>
              </label>
            </div>

            {entries.length === 0 ? (
              <p className="metric-label">No repetition metrics found.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Ngram</th>
                      <th>Count</th>
                      <th>Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.slice(0, 20).map((entry) => {
                      const evidence: EvidenceItem[] = (entry.examples ?? [])
                        .filter((example): example is NonNullable<typeof example> => Boolean(example))
                        .map((example) => ({
                          chunkId: example.chunkId,
                          quoteStart: example.quoteStart,
                          quoteEnd: example.quoteEnd,
                          excerpt: example.excerpt ?? "",
                          documentPath: example.documentPath ?? null,
                          chunkOrdinal: example.chunkOrdinal ?? null,
                          lineStart: example.lineStart ?? null,
                          lineEnd: example.lineEnd ?? null
                        }));
                      return (
                        <tr key={entry.ngram}>
                          <td>{entry.ngram}</td>
                          <td>{entry.count}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => onOpenMetricEvidence(`Repetition: ${entry.ngram}`, evidence)}
                              disabled={evidence.length === 0}
                            >
                              Open ({evidence.length})
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className="panel stack">
            <h3>Tone Drift</h3>
            {toneIssues.length === 0 ? (
              <p className="metric-label">No tone drift issues detected.</p>
            ) : (
              <ul className="list">
                {toneIssues.map((issue) => (
                  <li className="list-item" key={issue.id}>
                    <strong>{issue.title}</strong>
                    <div>{issue.description}</div>
                    <button type="button" onClick={() => onOpenIssueEvidence(issue.title, issue)}>
                      Open Evidence ({issue.evidence.length})
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="panel stack">
            <h3>Dialogue Tics</h3>
            {dialogueIssues.length === 0 ? (
              <p className="metric-label">No dialogue tic issues detected.</p>
            ) : (
              <ul className="list">
                {dialogueIssues.map((issue) => (
                  <li className="list-item" key={issue.id}>
                    <strong>{issue.title}</strong>
                    <div>{issue.description}</div>
                    <button type="button" onClick={() => onOpenIssueEvidence(issue.title, issue)}>
                      Open Evidence ({issue.evidence.length})
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </>
      )}
    </section>
  );
}
