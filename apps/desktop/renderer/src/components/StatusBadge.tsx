import type { JSX } from "react";

type StatusBadgeProps = {
  label: string;
  status: string;
};

function sanitize(status: string): string {
  return status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function StatusBadge({ label, status }: StatusBadgeProps): JSX.Element {
  return (
    <span className={`status-badge status-${sanitize(status)}`} title={status}>
      {label}
    </span>
  );
}
