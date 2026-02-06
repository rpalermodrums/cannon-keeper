import type { JSX } from "react";
import { AlertOctagon, X } from "lucide-react";
import type { UserFacingError } from "../api/ipc";

type InlineErrorProps = {
  error: UserFacingError;
  onAction?: () => void;
  onDismiss?: () => void;
};

export function InlineError({ error, onAction, onDismiss }: InlineErrorProps): JSX.Element {
  return (
    <div
      className="flex flex-wrap items-start justify-between gap-3 rounded-sm border border-danger/30 bg-danger-soft p-3 text-sm animate-fade-in"
      role="alert"
    >
      <div className="flex items-start gap-2">
        <AlertOctagon size={18} className="mt-0.5 shrink-0 text-danger" />
        <div>
          <strong className="text-danger">{error.code}</strong>
          <div className="mt-0.5 text-text-secondary">{error.message}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {error.actionLabel && onAction ? (
          <button
            className="rounded-sm border border-danger/40 bg-transparent px-3 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/10 cursor-pointer"
            type="button"
            onClick={onAction}
          >
            {error.actionLabel}
          </button>
        ) : null}
        {onDismiss ? (
          <button
            className="rounded-sm border border-transparent bg-transparent p-1 text-text-muted transition-colors hover:text-text-primary cursor-pointer"
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
