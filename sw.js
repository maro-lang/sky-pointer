// =============================================================================
// sw.js - Minimal service worker for Sky Pointer (GitHub Pages only).
//
// Why it exists: on Android, a web page can only show a system notification
// through a service worker (registration.showNotification). This worker does
// nothing else: it does not cache files, so every visit loads the newest app.
//
// Used by: src/events.js (registerServiceWorker). Copied to docs/sw.js by build.py.
// =============================================================================

// Take control right away after an update (no waiting for old tabs to close).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// Tapping the notification brings the app to the front (or opens it).
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if ("focus" in client) return client.focus();
    }
    return self.clients.openWindow("./");
  })());
});
