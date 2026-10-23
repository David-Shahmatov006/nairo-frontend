import { act, renderHook } from "@testing-library/react";
import { useAgentViewport } from "./useAgentViewport";

it("locks the page, follows the keyboard viewport, and restores scroll and styles", () => {
  const viewport = Object.assign(new EventTarget(), { height: 800, offsetTop: 0 });
  const originalViewport = Object.getOwnPropertyDescriptor(window, "visualViewport");
  const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");
  Object.defineProperty(window, "visualViewport", { configurable: true, value: viewport });
  Object.defineProperty(window, "scrollY", { configurable: true, value: 420 });
  const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  const panel = { current: document.createElement("section") };
  document.body.style.position = "relative";
  document.documentElement.style.scrollBehavior = "smooth";
  const { rerender, unmount } = renderHook(
    ({ open }) => useAgentViewport(open, panel),
    { initialProps: { open: false } },
  );
  expect(document.body.style.position).toBe("relative");
  rerender({ open: true });
  expect(document.body.style.position).toBe("fixed");
  expect(document.body.style.top).toBe("-420px");
  expect(panel.current.style.getPropertyValue("--agent-viewport-height")).toBe("800px");
  act(() => {
    viewport.height = 360;
    viewport.offsetTop = 52;
    viewport.dispatchEvent(new Event("resize"));
  });
  expect(panel.current.style.getPropertyValue("--agent-viewport-height")).toBe("360px");
  expect(panel.current.style.getPropertyValue("--agent-viewport-top")).toBe("52px");
  rerender({ open: false });
  expect(document.body.style.position).toBe("relative");
  expect(document.body.style.top).toBe("");
  expect(document.documentElement.style.overflow).toBe("");
  expect(document.documentElement.style.scrollBehavior).toBe("smooth");
  expect(scrollTo).toHaveBeenCalledWith(0, 420);
  viewport.height = 700;
  viewport.dispatchEvent(new Event("resize"));
  expect(panel.current.style.getPropertyValue("--agent-viewport-height")).toBe("360px");
  unmount();
  document.body.removeAttribute("style");
  document.documentElement.removeAttribute("style");
  if (originalViewport) Object.defineProperty(window, "visualViewport", originalViewport);
  else Reflect.deleteProperty(window, "visualViewport");
  if (originalScrollY) Object.defineProperty(window, "scrollY", originalScrollY);
});
