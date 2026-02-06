import type { JSX } from "react";
import type { UserFacingError } from "../api/ipc";

type InlineErrorProps = {
  error: UserFacingError;
  onAction?: () => void;
  onDismiss?: () => void;
};

export function InlineError({ error, onAction, onDismiss }: InlineErrorProps): JSX.Element {
  return (
    <div className="inline-error" role="alert">
      <div>
        <strong>{error.code}</strong>
        <div>{error.message}</div>
      </div>
      <div className="row">
        {error.actionLabel && onAction ? (
          <button type="button" onClick={onAction}>
            {error.actionLabel}
          </button>
        ) : null}
        {onDismiss ? (
          <button className="ghost" type="button" onClick={onDismiss}>
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );
}
