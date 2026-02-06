import type { JSX } from "react";
import { Quote, X } from "lucide-react";
import type { EvidenceItem } from "../api/ipc";
import { CopyButton } from "./CopyButton";

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
    <>
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-black/20 animate-fade-in dark:bg-black/40"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed top-0 right-0 z-40 flex h-full w-full max-w-[520px] flex-col border-l border-border bg-surface-2 shadow-lg transition-transform duration-200 ease-out dark:bg-surface-1 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Quote size={16} className="shrink-0 text-accent" />
              Evidence
            </div>
            <div className="mt-0.5 truncate text-xs text-text-muted">{title}</div>
          </div>
          <button
            className="rounded-sm border border-transparent bg-transparent p-1.5 text-text-muted transition-colors hover:text-text-primary cursor-pointer"
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {evidence.length === 0 ? (
            <p className="text-center text-sm text-text-muted">No evidence excerpts available.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {evidence.map((item, index) => (
                <article
                  key={`${item.chunkId}-${index}`}
                  className="rounded-sm border border-border bg-white p-3 dark:bg-surface-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono text-xs text-text-muted">{locationLabel(item)}</div>
                    <CopyButton text={item.excerpt} label="Copy" />
                  </div>
                  <div className="mt-2 border-l-3 border-accent pl-3 text-sm italic text-text-secondary">
                    &quot;{item.excerpt}&quot;
                  </div>
                  <div className="mt-1.5 font-mono text-xs text-text-muted">
                    span {item.quoteStart}-{item.quoteEnd}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
