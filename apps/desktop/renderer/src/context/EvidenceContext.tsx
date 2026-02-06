import { createContext, useCallback, useContext, useState, type JSX, type ReactNode } from "react";
import type { EvidenceItem } from "../api/ipc";

type EvidenceDrawerState = {
  open: boolean;
  title: string;
  evidence: EvidenceItem[];
};

type EvidenceContextValue = EvidenceDrawerState & {
  openEvidence: (title: string, evidence: EvidenceItem[]) => void;
  closeEvidence: () => void;
};

const EvidenceContext = createContext<EvidenceContextValue>({
  open: false,
  title: "",
  evidence: [],
  openEvidence: () => {},
  closeEvidence: () => {}
});

export function EvidenceProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<EvidenceDrawerState>({
    open: false,
    title: "",
    evidence: []
  });

  const openEvidence = useCallback((title: string, evidence: EvidenceItem[]) => {
    setState({ open: true, title, evidence });
  }, []);

  const closeEvidence = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <EvidenceContext.Provider value={{ ...state, openEvidence, closeEvidence }}>
      {children}
    </EvidenceContext.Provider>
  );
}

export function useEvidence(): EvidenceContextValue {
  return useContext(EvidenceContext);
}
