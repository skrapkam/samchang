import React from "react";
import { VisualScopeProvider } from "./CaseStudyViewContext";

// Marks its children as curated for Visuals view.
// Use a display: contents wrapper to ensure DOM presence without layout impact,
// and provide React context so consumers can detect the scope.
const VisualBlock: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <VisualScopeProvider>
      <span data-visual-scope style={{ display: 'contents' }}>{children}</span>
    </VisualScopeProvider>
  );
};

export default VisualBlock;
