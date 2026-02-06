import type { JSX } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "system" | "light" | "dark";

type ThemeToggleProps = {
  theme: Theme;
  onChange: (theme: Theme) => void;
};

const options: ReadonlyArray<{ value: Theme; icon: typeof Sun; label: string }> = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" }
];

export function ThemeToggle({ theme, onChange }: ThemeToggleProps): JSX.Element {
  return (
    <div className="inline-flex rounded-full border border-border bg-surface-1 p-0.5">
      {options.map(({ value, icon: Icon, label }) => {
        const active = value === theme;
        return (
          <button
            key={value}
            type="button"
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer ${
              active
                ? "bg-accent text-text-inverse shadow-xs"
                : "bg-transparent text-text-secondary hover:text-text-primary"
            }`}
            title={label}
            onClick={() => onChange(value)}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export type { Theme };
