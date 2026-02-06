import type { JSX, ReactNode } from "react";

type FilterBarProps = {
  children: ReactNode;
  actions?: ReactNode;
};

export function FilterBar({ children, actions }: FilterBarProps): JSX.Element {
  return (
    <div className="filter-bar">
      {children}
      {actions ? <div className="row">{actions}</div> : null}
    </div>
  );
}

export function FilterGroup({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  return (
    <label className="filter-group">
      {label}
      {children}
    </label>
  );
}
