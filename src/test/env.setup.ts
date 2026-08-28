import { TextDecoder, TextEncoder } from "node:util";

// babel-plugin-transform-vite-meta-env rewrites import.meta.env.VITE_* to
// process.env.VITE_*, so app modules that read the API URL at import time need
// these set before any test module is loaded.
process.env.VITE_API_URL = process.env.VITE_API_URL ?? "http://localhost:4000";

// jsdom does not implement the encoding globals, and react-router 7 reads
// TextEncoder at import time, so anything rendering a router fails to load
// without them. Browsers ship both natively.
const globals = globalThis as {
  TextEncoder?: typeof globalThis.TextEncoder;
  TextDecoder?: typeof globalThis.TextDecoder;
};

globals.TextEncoder ??= TextEncoder as typeof globalThis.TextEncoder;
globals.TextDecoder ??= TextDecoder as typeof globalThis.TextDecoder;
