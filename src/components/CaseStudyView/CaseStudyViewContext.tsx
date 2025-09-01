import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CaseStudyView = "visuals" | "process";

type ViewContextValue = {
  view: CaseStudyView;
  setView: (v: CaseStudyView) => void;
};

const ViewContext = createContext<ViewContextValue | null>(null);

export const CASE_STUDY_VIEW_STORAGE_KEY = "caseStudyView";

export const CaseStudyViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setViewState] = useState<CaseStudyView>("visuals");

  // Hydrate from localStorage or URL param on mount
  useEffect(() => {
    try {
      const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const qp = (urlParams && urlParams.get("view")) as CaseStudyView | null;
      const stored = (typeof window !== "undefined" ? (localStorage.getItem(CASE_STUDY_VIEW_STORAGE_KEY) as CaseStudyView | null) : null);
      if (qp === "visuals" || qp === "process") {
        setViewState(qp);
      } else if (stored === "visuals" || stored === "process") {
        setViewState(stored);
      } else {
        setViewState("visuals");
      }
    } catch {
      setViewState("visuals");
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(CASE_STUDY_VIEW_STORAGE_KEY, view);
      }
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-case-study-view", view);
      }
    } catch {/* ignore */}
  }, [view]);

  const setView = (v: CaseStudyView) => setViewState(v);

  const value = useMemo(() => ({ view, setView }), [view]);
  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

export const useCaseStudyView = () => {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useCaseStudyView must be used within CaseStudyViewProvider");
  return ctx;
};

// A nested context to detect when we're inside a <visual> section
const VisualScopeContext = createContext<boolean>(false);

export const VisualScopeProvider: React.FC<{ children: React.ReactNode }>= ({ children }) => {
  return <VisualScopeContext.Provider value={true}>{children}</VisualScopeContext.Provider>;
};

export const useInVisualScope = () => useContext(VisualScopeContext);

