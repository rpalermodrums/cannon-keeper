import type { JSX } from "react";
import type { AskResponse, SearchQueryResponse } from "../api/ipc";
import { EmptyState } from "../components/EmptyState";

type SearchViewProps = {
  busy: boolean;
  searchQuery: string;
  searchResults: SearchQueryResponse | null;
  questionText: string;
  askResult: AskResponse | null;
  onSearchQueryChange: (value: string) => void;
  onQuestionTextChange: (value: string) => void;
  onSearch: () => void;
  onAsk: () => void;
};

export function SearchView({
  busy,
  searchQuery,
  searchResults,
  questionText,
  askResult,
  onSearchQueryChange,
  onQuestionTextChange,
  onSearch,
  onAsk
}: SearchViewProps): JSX.Element {
  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h2 className="page-title">Search and Ask</h2>
          <p className="page-subtitle">
            Retrieval-first interactions. Ask has strict result states: answer, snippets, or not_found.
          </p>
        </div>
      </header>

      <article className="panel stack">
        <h3>Search Chunks</h3>
        <label>
          Query
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Mira workshop"
          />
        </label>
        <div className="row">
          <button className="primary" type="button" onClick={onSearch} disabled={busy || !searchQuery.trim()}>
            Search
          </button>
        </div>

        {searchResults ? (
          searchResults.results.length > 0 ? (
            <ul className="list">
              {searchResults.results.map((result) => (
                <li key={result.chunkId} className="list-item">
                  <div className="mono">
                    {result.documentPath} | chunk {result.ordinal}
                  </div>
                  <div className="evidence-quote">&quot;{result.snippet}&quot;</div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No Search Hits" message="Try broader terms or a neighboring scene name." />
          )
        ) : null}
      </article>

      <article className="panel stack">
        <h3>Ask the Bible</h3>
        <label>
          Question
          <input
            value={questionText}
            onChange={(event) => onQuestionTextChange(event.target.value)}
            placeholder="Where is Mira in chapter one?"
          />
        </label>
        <div className="row">
          <button className="primary" type="button" onClick={onAsk} disabled={busy || !questionText.trim()}>
            Ask
          </button>
        </div>

        {!askResult ? null : askResult.kind === "answer" ? (
          <article className="card">
            <h3>Grounded Answer</h3>
            <p>{askResult.answer}</p>
            <p className="metric-label">Confidence: {askResult.confidence.toFixed(2)}</p>
            <p className="metric-label">Citations: {askResult.citations.length}</p>
          </article>
        ) : askResult.kind === "snippets" ? (
          <article className="card">
            <h3>Evidence Snippets</h3>
            <p className="metric-label">No synthesized answer yet; showing directly retrieved text.</p>
            <ul className="list">
              {askResult.snippets.map((snippet) => (
                <li className="list-item" key={snippet.chunkId}>
                  <div className="mono">
                    {snippet.documentPath} | chunk {snippet.ordinal}
                  </div>
                  <div className="evidence-quote">&quot;{snippet.snippet}&quot;</div>
                </li>
              ))}
            </ul>
          </article>
        ) : (
          <article className="card">
            <h3>Not Found</h3>
            <p>{askResult.reason}</p>
            <p className="metric-label">Try asking with specific entities, locations, or chapter names.</p>
          </article>
        )}
      </article>
    </section>
  );
}
