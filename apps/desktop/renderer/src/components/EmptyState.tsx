import type { ComponentType, JSX } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  icon?: ComponentType<{ size?: number | string; className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, icon: Icon, actionLabel, onAction }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-border/60 bg-surface-2/50 px-6 py-10 text-center dark:bg-surface-1/30">
      {Icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-1 text-text-muted dark:bg-surface-2/50">
          <Icon size={24} />
        </div>
      ) : null}
      <h3 className="m-0 text-base font-semibold text-text-primary">{title}</h3>
      <p className="m-0 max-w-sm text-sm text-text-muted">{message}</p>
      {actionLabel && onAction ? (
        <button
          className="mt-1 rounded-sm border border-accent bg-accent px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-accent-strong cursor-pointer"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
