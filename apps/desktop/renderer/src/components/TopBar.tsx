import type { JSX } from "react";
import { Command } from "lucide-react";
import type { AppSection } from "../state/useCanonkeeperApp";
import { APP_SECTIONS } from "../state/useCanonkeeperApp";
import { Breadcrumb } from "./Breadcrumb";
import { StatusBadge } from "./StatusBadge";
import type { WorkerStatus } from "../api/ipc";

type TopBarProps = {
  activeSection: AppSection;
  projectName: string | null;
  status: WorkerStatus | null;
  statusLabel: string;
  onOpenCommandPalette: () => void;
};

export function TopBar({
  activeSection,
  projectName,
  status,
  statusLabel,
  onOpenCommandPalette
}: TopBarProps): JSX.Element {
  const section = APP_SECTIONS.find((s) => s.id === activeSection);

  const segments = [
    ...(projectName ? [{ label: projectName }] : [{ label: "No project" }]),
    ...(section ? [{ icon: section.icon, label: section.label }] : [])
  ];

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-surface-0/92 px-5 py-3 backdrop-blur-md dark:bg-surface-0/90">
      <div className="flex items-center gap-3 min-w-0">
        <Breadcrumb segments={segments} />
        <StatusBadge label={statusLabel} status={status?.state ?? "down"} />
      </div>
      <div className="flex items-center gap-2">
        <button
          className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-text-muted transition-colors hover:text-text-primary cursor-pointer dark:bg-surface-1"
          type="button"
          onClick={onOpenCommandPalette}
        >
          <Command size={14} />
          <span>Cmd+K</span>
        </button>
      </div>
    </header>
  );
}
