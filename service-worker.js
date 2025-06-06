const CACHE_NAME = 'offline-menu-v1';
const urlsToCache = [
  './', // index.html со всем скриптом и стилями
];

// Установка: сохраняем index.html
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Очистка старого кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.filter(name => name !== CACHE_NAME)
             .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Перехват запросов: сначала из кэша, если нет — из сети
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
