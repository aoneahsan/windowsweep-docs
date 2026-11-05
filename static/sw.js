// Cache-free takeover worker. plugins/worker-fingerprint.ts writes the main bundle's name into BUILD after
// every build, so an older tab's registration.update() always sees changed bytes.
const BUILD = 'source';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') void self.skipWaiting();
});
