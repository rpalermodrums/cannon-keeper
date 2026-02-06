import type { ComponentType, JSX, MouseEvent } from "react";

type IconButtonProps = {
  icon: ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  text?: string;
  variant?: "default" | "ghost" | "primary" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const variantClasses = {
  default:
    "border border-border bg-surface-2 text-text-primary hover:enabled:bg-white dark:hover:enabled:bg-surface-1",
  ghost:
    "border border-transparent bg-transparent text-text-secondary hover:enabled:bg-surface-1 hover:enabled:text-text-primary",
  primary:
    "border border-accent bg-accent text-text-inverse hover:enabled:bg-accent-strong",
  danger:
    "border border-danger bg-transparent text-danger hover:enabled:bg-danger-soft"
} as const;

const sizeClasses = {
  sm: "p-1.5 rounded-sm",
  md: "p-2 rounded-sm"
} as const;

export function IconButton({
  icon: Icon,
  label,
  text,
  variant = "default",
  size = "md",
  disabled,
  className = "",
  onClick
}: IconButtonProps): JSX.Element {
  const iconSize = size === "sm" ? 16 : 18;

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 transition-colors duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon size={iconSize} />
      {text ? <span className="text-sm font-medium">{text}</span> : null}
    </button>
  );
}
