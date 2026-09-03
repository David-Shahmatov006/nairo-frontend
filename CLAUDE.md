# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **yarn 1** (`packageManager` field + `yarn.lock`).

```bash
yarn dev                                  # Vite dev server
yarn build                                # tsc -b (all 3 projects) then vite build
yarn lint                                 # eslint (flat config)
yarn test                                 # jest
yarn test src/utils/formatDate.test.ts    # single file
yarn test -t "formats date and time"      # single test by name
yarn test:watch / yarn test:cov
```

`VITE_API_URL` (in `.env`) is read at **module import time** by `services/interceptor.ts` and `services/socket.service.ts`; without it, axios and socket.io get `undefined` base URLs.

## Architecture

React 19 + TypeScript + Vite SPA talking to a REST + Socket.IO backend. No path aliases — imports are relative.

**Routing / shell.** All routes live in `src/App.tsx` (eagerly imported, no lazy routes). Authenticated routes are nested under `ProtectedRoute` → `MainLayoutWrapper` → `MainLayout`, which renders Header + Sidebar + `<main>` plus the globally-mounted `PostModal` and message `Toast`. `MainLayout` is also where cross-app side effects live: socket connect, the `newMessageNotification` handler, the `user/visit` achievement ping, and the `user-chats` SWR fetch. Route constants are in `src/routes.ts`, but `App.tsx` hardcodes the parametrized paths (`/chats/:chatId?`, `/user/:id`, `/post/:id`).

**Screens.** `src/screens/Main/tabs/<Tab>/index.tsx`, with tab-local pieces colocated in a sibling `components/` folder. Only genuinely shared components live in `src/components`.

**State — two Zustand stores.**
- `stores/auth.ts` — `user` + `token`, persisted under `auth-storage`. The token is *also* mirrored into `localStorage["token"]` because the axios interceptor and the socket read it from there directly. `logout()` disconnects the socket and hard-navigates to `/login`.
- `stores/app.ts` — all non-persisted UI state (theme, active tab, auth view, post modal, chats list, message toast, achievement unlock queue). It writes `theme` and `activeTab` to `localStorage` by hand.

**Data fetching.** SWR + hand-written service classes in `src/services` (one class per domain, exported as a singleton: `postService`, `chatsService`, …). Every request goes through `$api` in `services/interceptor.ts`, which attaches the bearer token and, on a 401, refreshes once against `/auth/refresh` (`withCredentials`, cookie-based) and replays the request; a failed refresh logs out. Paginated lists use `useSWRInfinite` (`hooks/usePosts.ts`, keyed `[mode, userId, page]`, `hasMore` terminates).

**Realtime.** One module-level socket (`services/socket.service.ts`) pointed at `${VITE_API_URL}/chats` with `autoConnect: false`; `connectSocket()` re-reads the token from `localStorage` on every call. Emitted: `connectUser`, `joinChat`/`leaveChat`, `sendMessage`, `updateMessage`, `deleteMessage`, `readMessages`, `typing`, `recording`. Received: `receiveMessage`, `messageUpdated`, `messageDeleted`, `messagesRead`, `typingStatus`, `recordingStatus`, `newActivity`, `newMessageNotification`. The chats screen owns most listeners; `MainLayout` owns only the notification one.

**i18n.** i18next with the HTTP backend, so translations are fetched at runtime from `public/locales/<lang>/translation.json` — **a new key must be added to all 10 locale files**, not just `en`. Language resolution order: `user.preferredLanguage` → `localStorage["language"]` → `en`, applied in `App.tsx`; supported languages come from `constants/langs.ts`.

**Styling.** Tailwind v4 loaded via `@import "tailwindcss"` + `@config "../tailwind.config.ts"` in `src/index.css`. `darkMode: "class"` — the `dark` class is toggled on `documentElement` by the app store and `App.tsx`. `tailwind.config.ts` replaces the default `screens` with a large set of explicit raw queries (`max-768px`, `min-2000px`, `tablet`, …); use those rather than `sm:`/`md:`, which do not exist here. `toggleTheme` animates with the View Transitions API and injects a `theme-circle-expand` keyframe, falling back to an instant swap when unsupported or on reduced motion.

**Achievements.** Backend endpoints (`user/visit`, post creation) return `newlyUnlocked` keys; `constants/achievements.ts` validates them against `ACHIEVEMENT_KEYS` and maps them to bundled images, then they are pushed onto the app store's queue and drained one at a time by the globally-mounted `AchievementUnlockModal`.

**Service worker.** `src/serviceWorker/index.ts` (Workbox caching rules) is currently **not wired up** — nothing registers it and `vite.config.ts` has no PWA plugin, so editing it has no runtime effect until a build/registration step is added.

## Testing

Jest (jsdom) with **Babel**, not Vite — the two toolchains are configured separately, which drives most of the setup:

- `babel-plugin-transform-vite-meta-env` rewrites `import.meta.env.VITE_*` to `process.env.VITE_*`; `src/test/env.setup.ts` (a `setupFiles`, i.e. pre-import) sets `VITE_API_URL` and polyfills `TextEncoder`/`TextDecoder` for react-router 7.
- Keep `@babel/*` pinned to 7.x — on Babel 8 that plugin fails silently and `import.meta.env` stops being substituted.
- Asset imports resolve through `src/test/assetTransform.cjs`; CSS through `identity-obj-proxy`.
- ESM-only dependencies must be added to `transformIgnorePatterns` in `jest.config.mjs` or they fail to parse.
- `src/test/` holds reusable harnesses: `location.ts` (tracks `window.location.href` assignments, since jsdom makes it unforgeable) and `mediaRecorder.ts` (fake `MediaRecorder`/`AudioContext` for voice-recording tests). `infra.test.ts` guards the setup above.
- Tests are colocated (`src/**/*.test.ts(x)`) and excluded from `tsconfig.app.json`; they typecheck under `tsconfig.test.json`.

TypeScript is strict with `noUnusedLocals`/`noUnusedParameters` and `verbatimModuleSyntax`, so type-only imports must use `import type`.
