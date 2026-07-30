import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';
import { cleanupOutdatedCaches } from 'workbox-precaching';

clientsClaim();

declare let self: ServiceWorkerGlobalScope & { __WB_MANIFEST: unknown };
/**
 * We are not wrapping it in a 'message' event as per the new update.
 * @see https://developer.chrome.com/docs/workbox/modules/workbox-core#the_skipwaiting_wrapper_is_deprecated
 */
//@ts-expect-error type error
self?.skipWaiting();

/**
 * Disable cache for the generated assets.
 *
 * ! DO NOT CACHE THE GENERATED ASSETS !
 */

//@ts-expect-error unused constant
const _ignored = self.__WB_MANIFEST;

cleanupOutdatedCaches();

registerRoute(
  ({ request }) =>
    request.destination === 'image' ||
    request.destination === 'video' ||
    request.destination === 'audio',
  new StaleWhileRevalidate({
    cacheName: 'media',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
    ],
  })
);

/**
 * Cache font for 30 days.
 */
registerRoute(
  ({ request }) => request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'fonts',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
  })
);

// Network only for API routes and scripts.
registerRoute(({ url }) => url.href.includes('/api'), new NetworkOnly());
registerRoute(
  ({ request }) => request.destination === 'script',
  new NetworkOnly()
);
