import type { JSX } from "react";
import { AlertOctagon, X } from "lucide-react";
import type { UserFacingError } from "../api/ipc";

const ERROR_MESSAGES: Record<string, string> = {
  INGEST_FAILED:
    "We couldn't read this manuscript file. Please check that the file exists and isn't open in another program.",
  SCENE_LOAD_FAILED:
    "Scene data couldn't be loaded. Try refreshing, or go to Settings and run diagnostics.",
  EXPORT_PICK_FAILED:
    "The export folder couldn't be accessed. Please choose a different folder.",
  EXPORT_FAILED: "The export didn't complete. Please try again or choose a different folder.",
  CLAIM_CONFIRM_FAILED:
    "This fact couldn't be confirmed right now. Please try again in a moment.",
  DIAGNOSTICS_FAILED: "Diagnostics couldn't finish. Try again, or restart the app if the problem persists.",
  PROJECT_OPEN_FAILED: "We couldn't open this project. Please check the folder still exists and try again.",
  PROJECT_PICK_FAILED: "No folder was selected. Please choose a project folder to continue.",
  DOCUMENT_PICK_FAILED: "No file was selected. Please choose a manuscript file to add.",
  FIXTURE_LOAD_FAILED: "The sample manuscript couldn't be loaded.",
  FIXTURE_NOT_FOUND: "The sample manuscript file wasn't found.",
  SEARCH_FAILED: "The search didn't complete. Please try again in a moment.",
  ASK_FAILED: "Your question couldn't be answered right now. Please try again.",
  ENTITY_LOAD_FAILED: "Character and world data couldn't be loaded. Try refreshing the page.",
  ISSUE_DISMISS_FAILED: "This issue couldn't be dismissed right now. Please try again.",
  ISSUE_RESOLVE_FAILED: "This issue couldn't be resolved right now. Please try again."
};

type InlineErrorProps = {
  error: UserFacingError;
  onAction?: () => void;
  onDismiss?: () => void;
};

export function InlineError({ error, onAction, onDismiss }: InlineErrorProps): JSX.Element {
  const friendlyMessage = ERROR_MESSAGES[error.code] ?? "Something went wrong.";

  return (
    <div
      className="flex flex-wrap items-start justify-between gap-3 rounded-sm border border-danger/30 bg-danger-soft p-3 text-sm animate-fade-in"
      role="alert"
    >
      <div className="flex items-start gap-2">
        <AlertOctagon size={18} className="mt-0.5 shrink-0 text-danger" />
        <div>
          <strong className="text-danger">{friendlyMessage}</strong>
          <div className="mt-0.5 text-text-secondary">{error.message}</div>
          <details className="mt-1.5">
            <summary className="cursor-pointer text-xs text-text-muted">Technical details</summary>
            <code className="mt-1 block text-xs text-text-muted">{error.code}</code>
          </details>
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
