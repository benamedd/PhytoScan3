const CACHE_NAME = 'leaf-analyzer-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css', // Si vous extrayez les styles dans un fichier séparé
  '/script.js'
];

// Install event - Cache files
self.addEventListener('install', event => {
  console.log('Service Worker installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        console.log(`Fetching resource: ${event.request.url}`);
        return response || fetch(event.request);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
