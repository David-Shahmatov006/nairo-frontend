import { useLayoutEffect, type RefObject } from "react";

export function useAgentViewport(
  open: boolean,
  panel: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    if (!open) return;

    const body = document.body;
    const root = document.documentElement;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const bodyProperties = [
      "position", "top", "left", "width", "overflow", "overscroll-behavior",
    ];
    const rootProperties = ["overflow", "overscroll-behavior", "scroll-behavior"];
    const preserve = (style: CSSStyleDeclaration, properties: string[]) => {
      const previous = properties.map((property) => [
        property, style.getPropertyValue(property), style.getPropertyPriority(property),
      ]);
      return () => previous.forEach(([property, value, priority]) => {
        if (value) style.setProperty(property, value, priority);
        else style.removeProperty(property);
      });
    };
    const restoreBody = preserve(body.style, bodyProperties);
    const restoreRoot = preserve(root.style, rootProperties);

    // iOS can still scroll an overflow-hidden body when the keyboard opens.
    body.style.position = "fixed";
    body.style.top = `${-scrollY}px`;
    body.style.left = `${-scrollX}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";

    const viewport = window.visualViewport;
    const updateViewport = () => {
      panel.current?.style.setProperty(
        "--agent-viewport-height",
        `${viewport?.height ?? window.innerHeight}px`,
      );
      panel.current?.style.setProperty(
        "--agent-viewport-top",
        `${viewport?.offsetTop ?? 0}px`,
      );
    };
    updateViewport();
    viewport?.addEventListener("resize", updateViewport);
    viewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    return () => {
      viewport?.removeEventListener("resize", updateViewport);
      viewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
      restoreBody();
      // Restore the exact page position even when the app enables smooth scrolling.
      root.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      restoreRoot();
    };
  }, [open, panel]);
}
