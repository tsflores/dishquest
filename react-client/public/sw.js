// NourishPlan Service Worker — Phase 6.
const VERSION = 'v1';
const SHELL_CACHE = `nourish-plan-shell-${VERSION}`;
const IMAGE_CACHE = `nourish-plan-images-${VERSION}`;
const API_CACHE = `nourish-plan-api-${VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, IMAGE_CACHE, API_CACHE];

// Injected by scripts/inject-sw-precache.js post-build.
const PRECACHE_URLS = [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(['/', '/index.html', ...PRECACHE_URLS]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !CURRENT_CACHES.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // POST/PUT/DELETE: pass-through, never cached

  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/edamam/search')) return; // network-only, no cache

  if (url.pathname.startsWith('/static/images/')) {
    event.respondWith(staleWhileRevalidate(event, IMAGE_CACHE));
    return;
  }

  if (url.pathname.startsWith('/api/recipes')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (url.origin === self.location.origin && (request.mode === 'navigate' || PRECACHE_URLS.includes(url.pathname))) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match('/index.html');
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match(request);
  }
}

async function staleWhileRevalidate(event, cacheName) {
  const { request } = event;
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const revalidate = fetch(request)
    .then(async (response) => {
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  if (cached) {
    event.waitUntil(revalidate);
    return cached;
  }
  return revalidate;
}
