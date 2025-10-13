// Service Worker para PWA
// IMPORTANTE: Incrementar versão após mudanças no código para forçar atualização do cache
const CACHE_NAME = 'financeiro-v3.0.2';
const urlsToCache = [
  '/',
  '/dashboard',
  '/gastos',
  '/offline',
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requisições com estratégia Network First para páginas HTML/JS
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Estratégia: Network First para HTML, JS, CSS (sempre buscar versão atualizada primeiro)
  // Cache First para imagens e assets estáticos
  const isNavigationOrScript = event.request.mode === 'navigate' ||
                                event.request.destination === 'script' ||
                                event.request.destination === 'style' ||
                                url.pathname.startsWith('/_next/');

  if (isNavigationOrScript) {
    // Network First: Tenta buscar da rede primeiro, fallback para cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se recebeu resposta válida, atualiza o cache
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Se falhar, tenta buscar do cache
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline');
          });
        })
    );
  } else {
    // Cache First: Para imagens e outros assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
    );
  }
});

// Push Notifications (para futuro)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification('Controle Financeiro', options)
  );
});

