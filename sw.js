const CACHE_NAME = 'ninja-run-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/index.tsx',
    '/App.tsx',
    '/types.ts',
    '/constants.ts',
    '/hooks/useGameLoop.ts',
    '/components/Ninja.tsx',
    '/components/Obstacle.tsx',
    '/components/Ground.tsx',
    '/components/ScoreDisplay.tsx',
    '/components/GameOverScreen.tsx',
    '/components/StartScreen.tsx',
    '/components/PowerUp.tsx',
    'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});