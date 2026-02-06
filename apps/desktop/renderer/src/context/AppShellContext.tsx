import { createContext, useCallback, useContext, useEffect, useState, type JSX, type ReactNode } from "react";
import type { AppSection } from "../state/useCanonkeeperApp";
import { APP_SECTIONS } from "../state/useCanonkeeperApp";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

type AppShellContextValue = {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

const AppShellContext = createContext<AppShellContextValue>({
  activeSection: "dashboard",
  setActiveSection: () => {},
  commandPaletteOpen: false,
  setCommandPaletteOpen: () => {},
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {}
});

function nextSection(current: AppSection, delta: number): AppSection {
  const index = APP_SECTIONS.findIndex((s) => s.id === current);
  if (index < 0) return "dashboard";
  const next = (index + delta + APP_SECTIONS.length) % APP_SECTIONS.length;
  return APP_SECTIONS[next]!.id;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
}

export function AppShellProvider({ children }: { children: ReactNode }): JSX.Element {
  const [activeSection, setActiveSectionRaw] = useState<AppSection>(() =>
    readStorage<AppSection>("canonkeeper.activeSection", "dashboard")
  );
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsedRaw] = useState(() =>
    readStorage<boolean>("canonkeeper.sidebarCollapsed", false)
  );

  const setActiveSection = useCallback((section: AppSection) => {
    setActiveSectionRaw(section);
    writeStorage("canonkeeper.activeSection", section);
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedRaw(collapsed);
    writeStorage("canonkeeper.sidebarCollapsed", collapsed);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        return;
      }
      if (isEditableElement(e.target)) return;
      if (e.key === "[") {
        e.preventDefault();
        setActiveSectionRaw((current) => {
          const next = nextSection(current, -1);
          writeStorage("canonkeeper.activeSection", next);
          return next;
        });
      }
      if (e.key === "]") {
        e.preventDefault();
        setActiveSectionRaw((current) => {
          const next = nextSection(current, 1);
          writeStorage("canonkeeper.activeSection", next);
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AppShellContext.Provider
      value={{
        activeSection,
        setActiveSection,
        commandPaletteOpen,
        setCommandPaletteOpen,
        sidebarCollapsed,
        setSidebarCollapsed
      }}
    >
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell(): AppShellContextValue {
  return useContext(AppShellContext);
}
