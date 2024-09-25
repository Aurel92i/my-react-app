// Installer le service worker et mettre en cache les fichiers statiques
self.addEventListener('install', (event) => {
  console.log('Service worker installé.');
  event.waitUntil(
    caches.open('static-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico',
        '/logo192.png',
        '/logo512.png',
        '/manifest.json'
      ]);
    })
  );
});

// Activer le service worker
self.addEventListener('activate', (event) => {
  console.log('Service worker activé.');
});

// Intercepter les requêtes et renvoyer les fichiers mis en cache si disponibles
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
