import { useEffect, useRef, type JSX, type ReactNode } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  danger,
  children,
  onConfirm,
  onCancel
}: ConfirmModalProps): JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    if (!el) return;
    const focusable = el.querySelector<HTMLElement>("button, input, textarea, select");
    focusable?.focus();
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 animate-fade-in dark:bg-black/50"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <section
        ref={dialogRef}
        className="w-full max-w-[560px] rounded-lg border border-border bg-surface-2 p-5 shadow-lg animate-scale-in dark:bg-surface-1"
      >
        <h3 className="mt-0 mb-2 font-display text-lg font-bold">{title}</h3>
        <p className="mb-3 text-sm text-text-secondary">{message}</p>
        {children}
        <div className="mt-4 flex justify-end gap-2.5">
          <button
            className="rounded-sm border border-border bg-surface-2 px-4 py-2 text-sm text-text-primary transition-colors hover:bg-white cursor-pointer dark:bg-surface-2 dark:hover:bg-surface-0"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-sm border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              danger
                ? "border-danger bg-danger text-white hover:bg-danger-strong"
                : "border-accent bg-accent text-text-inverse hover:bg-accent-strong"
            }`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
