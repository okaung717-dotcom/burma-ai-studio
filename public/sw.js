// Cache a small public offline shell, never private app data or static build assets.
const CACHE_VERSION = "burma-ai-studio-pwa-v3";
const CACHE_PREFIX = "burma-ai-studio-";
const CORE_ASSETS = ["/", "/manifest.webmanifest", "/burma-ai-icon.svg?v=10", "/apple-touch-icon.png?v=10"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => undefined)
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_VERSION)
        .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  // NEVER fall back to HTML for CSS, JavaScript, images, fonts, API calls,
  // or authenticated/private pages: that breaks MIME types and page styling.
  if (request.method !== "GET" || request.mode !== "navigate") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname !== "/") return;

  event.respondWith(
    fetch(request).catch(async () => {
      const cached = await caches.match("/") || await caches.match("/?source=pwa");
      return cached || Response.error();
    })
  );
});
