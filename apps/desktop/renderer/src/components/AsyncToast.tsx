import type { JSX } from "react";

export type ToastItem = {
  id: string;
  message: string;
  tone?: "info" | "success" | "error";
  actionLabel?: string;
  onAction?: () => Promise<void> | void;
};

type AsyncToastProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

export function AsyncToast({ toasts, onDismiss }: AsyncToastProps): JSX.Element {
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <p>{toast.message}</p>
          <div className="row">
            {toast.actionLabel && toast.onAction ? (
              <button
                type="button"
                onClick={() => {
                  void toast.onAction?.();
                  onDismiss(toast.id);
                }}
              >
                {toast.actionLabel}
              </button>
            ) : null}
            <button className="ghost" type="button" onClick={() => onDismiss(toast.id)}>
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
