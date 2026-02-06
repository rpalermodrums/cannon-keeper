import type { JSX, ReactNode } from "react";

type FilterBarProps = {
  children: ReactNode;
  actions?: ReactNode;
  resultCount?: number;
};

export function FilterBar({ children, actions, resultCount }: FilterBarProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border border-border bg-surface-2/70 p-3 dark:bg-surface-1/50">
      {children}
      <div className="ml-auto flex items-center gap-3">
        {resultCount !== undefined ? (
          <span className="text-xs text-text-muted">{resultCount} results</span>
        ) : null}
        {actions}
      </div>
    </div>
  );
}

export function FilterGroup({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  return (
    <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-xs font-medium text-text-muted">
      {label}
      {children}
    </label>
  );
}
