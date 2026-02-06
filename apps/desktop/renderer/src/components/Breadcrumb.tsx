import type { ComponentType, JSX } from "react";
import { ChevronRight } from "lucide-react";

type BreadcrumbSegment = {
  icon?: ComponentType<{ size?: number | string; className?: string }>;
  label: string;
};

type BreadcrumbProps = {
  segments: BreadcrumbSegment[];
};

export function Breadcrumb({ segments }: BreadcrumbProps): JSX.Element {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-text-muted" aria-label="Breadcrumb">
      {segments.map((segment, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 ? <ChevronRight size={14} className="text-text-muted/50" /> : null}
          {segment.icon ? <segment.icon size={14} /> : null}
          <span className={i === segments.length - 1 ? "text-text-primary font-medium" : ""}>
            {segment.label}
          </span>
        </span>
      ))}
    </nav>
  );
}
