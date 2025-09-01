import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useCaseStudyView, useInVisualScope } from "./CaseStudyViewContext";

type AnyProps = Record<string, any>;

/**
 * HOC that renders the wrapped component only when allowed by the current
 * case study view. In Process view it always renders. In Visuals view it
 * renders only when inside a <visual> block or when the element is explicitly
 * marked with data-visual or has a className containing "visual".
 */
// No wrapper div to preserve margin-collapsing behavior between blocks.

const AnimatedWrap = styled.div`
  overflow: hidden;
  will-change: opacity, transform, max-height;
  transition: opacity 220ms ease, transform 220ms ease, max-height 260ms ease;

  /* No margin normalization; spacing is controlled by next block's top margin */

  &[data-visible="true"] {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  &[data-visible="false"] {
    opacity: 0;
    transform: translateY(4px);
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
    const classNameProp: string | undefined = (props as any)["className"];
    const dataVisual = (props as any)["data-visual"]; // may be true, "true", ""

    // Visuals view: only render if explicitly marked or inside a <visual>
    // Also detect DOM-based visual scope to be robust against mapping quirks
    const domRef = useRef<HTMLDivElement | null>(null);
    const [inDomVisualScope, setInDomVisualScope] = useState(false);
    useEffect(() => {
      const el = domRef.current;
      if (!el) return;
      const hasScope = !!el.closest('[data-visual-scope]');
      setInDomVisualScope(hasScope);
    });

    // No prev-heading adjustments

    const isMarked =
      inVisualScope || inDomVisualScope ||
      dataVisual === true ||
      dataVisual === "" ||
      dataVisual === "true" ||
      (typeof classNameProp === "string" && /(^|\s)visual(\s|$)/.test(classNameProp));

    const shouldBeVisible = isProcess || isMarked;

    // Mount for animation; unmount after collapse completes
    const [mounted, setMounted] = useState<boolean>(shouldBeVisible);
    const [visible, setVisible] = useState<boolean>(shouldBeVisible);
    const [measuredHeight, setMeasuredHeight] = useState<number>(0);
    const [useAutoHeight, setUseAutoHeight] = useState<boolean>(shouldBeVisible);

    // Measure natural height of content
    const measure = () => {
      const el = domRef.current as HTMLElement | null;
      if (!el) return 0;
      // Use scrollHeight which reflects content's natural height
      return el.scrollHeight || 0;
    };

    useEffect(() => {
      if (shouldBeVisible) {
        setMounted(true);
        setUseAutoHeight(false);
        // Start from 0 height for enter
        setVisible(false);
        let rafId = 0 as number | any;
        let timeoutId: any;
        rafId = requestAnimationFrame(() => {
          const h1 = measure();
          if (h1 && h1 > 0) {
            setMeasuredHeight(h1);
            setVisible(true);
          } else {
            // Fallback: measure on next task if first read is 0
            timeoutId = setTimeout(() => {
              const h2 = measure();
              setMeasuredHeight(h2 && h2 > 0 ? h2 : 1);
              setVisible(true);
            }, 0);
          }
        });
        return () => {
          if (rafId) cancelAnimationFrame(rafId);
          if (timeoutId) clearTimeout(timeoutId);
        };
      } else {
        // Capture current height and ensure the browser applies it
        setUseAutoHeight(false);
        const h = measure();
        setMeasuredHeight(h);
        // Keep visible=true for a tick so the starting max-height is committed,
        // then flip to false to animate out.
        const timeoutId = setTimeout(() => setVisible(false), 0);
        return () => clearTimeout(timeoutId);
      }
    }, [shouldBeVisible]);

    const handleTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (e) => {
      if (e.propertyName !== "max-height") return;
      if (!visible) {
        setMounted(false);
      } else {
        // When fully visible, let the wrapper grow naturally to avoid cropping
        setUseAutoHeight(true);
      }
    };

    if (!mounted) return null;

    const ariaHidden = !visible ? true : undefined;
    const style: React.CSSProperties = useAutoHeight && visible
      ? {}
      : { maxHeight: visible ? measuredHeight : 0 };

    return (
      <AnimatedWrap ref={domRef} data-cs-wrap="true" style={style} data-visible={visible ? "true" : "false"} aria-hidden={ariaHidden} onTransitionEnd={handleTransitionEnd}>
        <Comp {...(props as P)} />
      </AnimatedWrap>
    );
  };

  Wrapped.displayName = `withViewFilter(${Comp.displayName || Comp.name || "Component"})`;
  return Wrapped;
}
