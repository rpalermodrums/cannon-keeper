import type { JSX } from "react";

type SkeletonProps = {
  width?: string;
  height?: string;
  variant?: "text" | "circle" | "rect";
  lines?: number;
  className?: string;
};

function SkeletonLine({ width, height, variant = "text", className = "" }: Omit<SkeletonProps, "lines">): JSX.Element {
  const base =
    "animate-shimmer bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 bg-[length:200%_100%]";
  const shape =
    variant === "circle"
      ? "rounded-full"
      : variant === "rect"
        ? "rounded-md"
        : "rounded-sm";

  return (
    <div
      className={`${base} ${shape} ${className}`}
      style={{
        width: width ?? (variant === "circle" ? "2.5rem" : "100%"),
        height: height ?? (variant === "circle" ? "2.5rem" : "0.875rem")
      }}
      aria-hidden="true"
    />
  );
}

export function Skeleton({ lines, ...rest }: SkeletonProps): JSX.Element {
  if (lines && lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }, (_, i) => (
          <SkeletonLine
            key={i}
            {...rest}
            width={i === lines - 1 ? "60%" : rest.width}
          />
        ))}
      </div>
    );
  }

  return <SkeletonLine {...rest} />;
}
