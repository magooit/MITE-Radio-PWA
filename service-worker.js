// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('mite-radio-cache-v1').then((cache) => {
      return cache.addAll([
        './index.html',
        './manifest.json',
        './icon.png',
        // List other assets here, such as CSS, JS files, images, etc.
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
