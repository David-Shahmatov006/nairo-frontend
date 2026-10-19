const nairoHosts = new Set([
  "nairo.com.ua",
  "www.nairo.com.ua",
  "nairo.app",
  "www.nairo.app",
  "nairo-frontend-production.up.railway.app",
  "localhost",
  "127.0.0.1",
  "[::1]",
]);

export function resolveAgentLink(href: string, origin = window.location.origin): string {
  try {
    const url = new URL(href, origin);
    const resource = url.pathname.match(/^\/(posts?|users?)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i);
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (resource || nairoHosts.has(url.hostname) || url.origin === origin)
    ) {
      const pathname = resource
        ? `/${resource[1].toLowerCase().startsWith("post") ? "post" : "user"}/${resource[2]}`
        : url.pathname.replace(/^\/posts\//, "/post/");
      return new URL(`${pathname}${url.search}${url.hash}`, origin).href;
    }
  } catch {
    // Leave other Markdown destinations to the renderer's URL filtering.
  }
  return href;
}
