import type { JSX } from "react";

type CommandPaletteItem = {
  id: string;
  label: string;
  subtitle: string;
};

type CommandPaletteProps = {
  open: boolean;
  items: CommandPaletteItem[];
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function CommandPalette({ open, items, onSelect, onClose }: CommandPaletteProps): JSX.Element | null {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <section className="command-palette">
        <header className="drawer-header">
          <strong>Command Palette</strong>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>
        <ul className="command-list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                className="command-item"
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
              >
                <strong>{item.label}</strong>
                <div>{item.subtitle}</div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
