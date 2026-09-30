/* ============================================
   SERVICE WORKER — Self-destruct (kill switch)
   ============================================
   The PWA / offline feature has been removed from this site. This file exists
   only to evict the previously-installed worker from returning visitors:

   - New visitors never register a worker (the registration call was removed
     from js/init.js), so they never load this file at all.
   - Visitors who already have the old worker registered will have their
     browser fetch this file on its next update check. It deletes every cache,
     unregisters itself, and reloads open tabs so the page is served straight
     from the network.

   Safe to delete this file once existing clients have updated (roughly a few
   weeks after deploy).

   Do NOT add caching logic here.
   ============================================ */

// Take over immediately instead of waiting for the old worker's clients to close.
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      // 1. Remove every cache the old worker created.
      var keys = await caches.keys();
      await Promise.all(keys.map(function (key) {
        return caches.delete(key);
      }));

      // 2. Unregister so no worker controls the page again.
      await self.registration.unregister();

      // 3. Reload open same-origin tabs so they pick up network-fresh content.
      var clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(function (client) {
        if ('navigate' in client && client.url.indexOf(self.location.origin) === 0) {
          client.navigate(client.url);
        }
      });
    })()
  );
});
