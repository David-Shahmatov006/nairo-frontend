import { useSyncExternalStore } from "react";

// Mirrors the `max-768px` screen in tailwind.config.ts. Reading
// window.innerWidth instead lets JS and CSS disagree at the breakpoint and
// never updates on rotation, which leaves the chat layout half mobile.
const MOBILE_QUERY = "(max-width: 767px)";

const subscribe = (onStoreChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onStoreChange);

  return () => query.removeEventListener("change", onStoreChange);
};

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;

const getServerSnapshot = () => false;

export const useIsMobile = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
