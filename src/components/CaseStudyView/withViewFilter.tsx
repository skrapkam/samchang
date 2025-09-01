import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { useCaseStudyView, useInVisualScope } from "./CaseStudyViewContext";

type AnyProps = Record<string, any>;

/**
 * HOC that renders the wrapped component only when allowed by the current
 * case study view. In Process view it always renders. In Visuals view it
 * renders only when inside a <visual> block or when the element is explicitly
 * marked with data-visual or has a className containing "visual".
 */
const AnimatedWrap = styled.div`
  overflow: hidden;
  will-change: opacity, transform, max-height;
  transition: opacity 220ms ease, transform 220ms ease, max-height 260ms ease;

  &[data-visible="true"] {
    opacity: 1;
    transform: translateY(0);
    max-height: 9999px; /* large enough to accommodate content */
    pointer-events: auto;
  }

  &[data-visible="false"] {
    opacity: 0;
    transform: translateY(4px);
    max-height: 0;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export default function withViewFilter<P extends AnyProps>(Comp: React.ComponentType<P>) {
  const Wrapped: React.FC<P> = (props: P) => {
    const { view } = useCaseStudyView();
    const inVisualScope = useInVisualScope();

    // Always visible in Process view
    const isProcess = view === "process";
    const className: string | undefined = (props as any)["className"];
    const dataVisual = (props as any)["data-visual"]; // may be true, "true", ""

    // Visuals view: only render if explicitly marked or inside a <visual>
    const isMarked =
      inVisualScope ||
      dataVisual === true ||
      dataVisual === "" ||
      dataVisual === "true" ||
      (typeof className === "string" && /(^|\s)visual(\s|$)/.test(className));

    const visible = isProcess || isMarked;
    const ariaHidden = !visible ? true : undefined;

    return (
      <AnimatedWrap data-visible={visible ? "true" : "false"} aria-hidden={ariaHidden}>
        <Comp {...(props as P)} />
      </AnimatedWrap>
    );
  };

  Wrapped.displayName = `withViewFilter(${Comp.displayName || Comp.name || "Component"})`;
  return Wrapped;
}
