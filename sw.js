const CACHE_NAME = 'marco-mkt-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/main.js',
  './manifest.json',
  './img/hero.png',
  './img/marco.png',
  './img/project_ecommerce.png',
  './img/project_saas.png',
  './img/project_branding.png',
  './img/icon-192.png',
  './img/icon-512.png'
];

// Evento de Instalación - Cachear recursos estáticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cacheando recursos estáticos');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Evento de Activación - Limpiar cachés antiguas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Limpiando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de Fetch - Red Primero con caída a Caché (para ver cambios al estar online)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Clonar la respuesta y guardarla en caché para uso sin conexión
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Guardar solo peticiones HTTP válidas (no esquemas chrome-extension, etc.)
          if (e.request.url.startsWith('http')) {
            cache.put(e.request, resClone);
          }
        });
        return response;
      })
      .catch(() => {
        // Si no hay red, servir desde caché
        return caches.match(e.request);
      })
  );
});
