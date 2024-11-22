const cacheName = 'sophrologic-cache-v1';
const resourcesToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/assets/icons/icon192.png',
  '/assets/icons/icon512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(resourcesToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
