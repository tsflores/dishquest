// NourishPlan Service Worker — Phase 2 stub.
// Full caching strategy (Cache-first shell, SWR images, Network-first API) added in Phase 6.
const CACHE_NAME = 'nourish-plan-v1';
const PRECACHE_URLS = []; // injected by scripts/inject-sw-precache.js post-build

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));
self.addEventListener('fetch', () => {});
