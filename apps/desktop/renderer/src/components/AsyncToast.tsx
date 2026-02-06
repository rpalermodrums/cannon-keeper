import type { JSX } from "react";
import { AlertOctagon, CheckCircle, Info, X } from "lucide-react";

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

const toneConfig = {
  info: { icon: Info, classes: "border-border" },
  success: { icon: CheckCircle, classes: "border-ok/40" },
  error: { icon: AlertOctagon, classes: "border-danger/40" }
} as const;

export function AsyncToast({ toasts, onDismiss }: AsyncToastProps): JSX.Element {
  return (
    <div className="fixed right-5 bottom-4 z-60 flex flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const config = toneConfig[toast.tone ?? "info"];
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            className={`flex min-w-[260px] max-w-[420px] items-start gap-3 rounded-sm border bg-surface-2 p-3 shadow-md animate-slide-in-up dark:bg-surface-1 ${config.classes}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0 text-text-muted" />
            <div className="flex-1">
              <p className="m-0 text-sm text-text-secondary">{toast.message}</p>
              {toast.actionLabel && toast.onAction ? (
                <button
                  className="mt-1.5 rounded-sm border border-accent/40 bg-transparent px-2 py-0.5 text-xs font-medium text-accent transition-colors hover:bg-accent-soft cursor-pointer"
                  type="button"
                  onClick={() => {
                    void toast.onAction?.();
                    onDismiss(toast.id);
                  }}
                >
                  {toast.actionLabel}
                </button>
              ) : null}
            </div>
            <button
              className="shrink-0 rounded-sm border border-transparent bg-transparent p-0.5 text-text-muted transition-colors hover:text-text-primary cursor-pointer"
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
