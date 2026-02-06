import type { JSX } from "react";
import type { EvidenceItem } from "../api/ipc";

type EvidenceDrawerProps = {
  open: boolean;
  title: string;
  evidence: EvidenceItem[];
  onClose: () => void;
};

function locationLabel(item: EvidenceItem): string {
  const pathPart = item.documentPath ?? "unknown document";
  const chunkPart = item.chunkOrdinal !== null ? `chunk ${item.chunkOrdinal}` : "chunk ?";
  const linePart =
    item.lineStart !== null
      ? `line ${item.lineStart}${item.lineEnd && item.lineEnd !== item.lineStart ? `-${item.lineEnd}` : ""}`
      : "line ?";
  return `${pathPart} | ${chunkPart} | ${linePart}`;
}

export function EvidenceDrawer({ open, title, evidence, onClose }: EvidenceDrawerProps): JSX.Element {
  return (
    <aside className={`evidence-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <header className="drawer-header">
        <div>
          <strong>Evidence</strong>
          <div>{title}</div>
        </div>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </header>
      <div className="drawer-body">
        {evidence.length === 0 ? (
          <p>No evidence excerpts available.</p>
        ) : (
          evidence.map((item, index) => (
            <article key={`${item.chunkId}-${index}`} className="evidence-card">
              <div className="mono">{locationLabel(item)}</div>
              <div className="evidence-quote">&quot;{item.excerpt}&quot;</div>
              <div className="mono">
                span {item.quoteStart}-{item.quoteEnd}
              </div>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
