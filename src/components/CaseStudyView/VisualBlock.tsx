import React from "react";
import { VisualScopeProvider } from "./CaseStudyViewContext";

// Acts as a logical wrapper that marks its children as part of the Visuals view.
// Does not introduce extra DOM by default; authors can still style using attributes
// on the <visual> tag in markdown, but here we just scope the children.
const VisualBlock: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <VisualScopeProvider>{children}</VisualScopeProvider>;
};

export default VisualBlock;

