import type { JSX } from "react";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
};

const sizeMap = {
  sm: "h-4 w-4 border-[2px]",
  md: "h-6 w-6 border-[2px]",
  lg: "h-8 w-8 border-[3px]"
} as const;

export function Spinner({ size = "md", label }: SpinnerProps): JSX.Element {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <span
        className={`${sizeMap[size]} animate-spin rounded-full border-accent/30 border-t-accent`}
      />
      {label ? <span className="text-sm text-text-muted">{label}</span> : null}
      <span className="sr-only">{label ?? "Loading"}</span>
    </span>
  );
}
