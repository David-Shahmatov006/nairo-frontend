// jsdom implements window.location and Location#href as [LegacyUnforgeable]:
// both are own, non-configurable properties, so they can neither be replaced
// (Object.defineProperty / delete) nor spied on, and assigning an href only
// yields "Not implemented: navigation (except hash changes)".
//
// The public Location wrapper delegates every access to an internal impl object
// reachable through its only symbol-keyed property, and that object's href
// accessor is an ordinary configurable one. Overriding it there records
// redirects while keeping window.location itself untouched.
type LocationImpl = { href: string };

export interface TrackedLocation {
  /** Every value assigned to window.location.href, oldest first. */
  hrefs: string[];
  restore: () => void;
}

export const trackLocationHref = (
  initialHref = "http://localhost/",
): TrackedLocation => {
  const impl = Object.getOwnPropertySymbols(window.location)
    .filter((symbol) => symbol.description === "impl")
    .map(
      (symbol) =>
        (window.location as unknown as Record<symbol, LocationImpl>)[symbol],
    )
    .find(Boolean);

  if (!impl) {
    throw new Error(
      "Could not reach the jsdom Location impl — jsdom internals changed.",
    );
  }

  const previous = Object.getOwnPropertyDescriptor(impl, "href");
  const hrefs: string[] = [];
  let current = initialHref;

  Object.defineProperty(impl, "href", {
    configurable: true,
    get: () => current,
    set: (value: string) => {
      current = String(value);
      hrefs.push(current);
    },
  });

  return {
    hrefs,
    restore: () => {
      if (previous) {
        Object.defineProperty(impl, "href", previous);
        return;
      }

      // No own descriptor before: dropping ours re-exposes jsdom's prototype accessor.
      Reflect.deleteProperty(impl, "href");
    },
  };
};
