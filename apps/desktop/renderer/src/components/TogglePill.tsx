import type { JSX } from "react";

type TogglePillOption<T extends string> = {
  value: T;
  label: string;
};

type TogglePillProps<T extends string> = {
  options: readonly TogglePillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
};

export function TogglePill<T extends string>({
  options,
  value,
  onChange,
  label,
  className = ""
}: TogglePillProps<T>): JSX.Element {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label ? <span className="text-xs font-medium text-text-muted">{label}</span> : null}
      <div className="inline-flex rounded-full border border-border bg-surface-1 p-0.5">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer ${
                active
                  ? "bg-accent text-text-inverse shadow-xs"
                  : "bg-transparent text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
