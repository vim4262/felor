/* ============================================================
   SERVICE WORKER - Cache et performance
   Stratégie: Cache First pour les assets, Network First pour HTML
   ============================================================ */

const CACHE_NAME = 'portfolio-ekoe-s4-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/competences.html',
  '/projets.html',
  '/parcours.html',
  '/contact.html',
  '/404.html',
  '/styles-variables.css',
  '/styles-base.css',
  '/styles-components.css',
  '/styles-navigation.css',
  '/styles-main.css',
  '/styles-competences.css',
  '/styles-projets.css',
  '/styles-parcours.css',
  '/styles-contact.css',
  '/main.js',
  '/config.js',
  '/form-validation.js',
  '/analytics.js',
  '/data.json',
  '/assets/favicon.svg',
  // Fonts will be cached automatically
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache ouvert');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((error) => {
        console.error('[SW] Erreur lors du cache:', error);
      })
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorer les requêtes non-GET et les autres origines
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Stratégie différente selon le type de ressource
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    // Network First pour les pages HTML
    event.respondWith(networkFirstStrategy(event.request));
  } else if (ASSETS_TO_CACHE.some(asset => url.pathname.endsWith(asset.split('/').pop()))) {
    // Cache First pour les assets statiques
    event.respondWith(cacheFirstStrategy(event.request));
  } else {
    // Network First par défaut
    event.respondWith(networkFirstStrategy(event.request));
  }
});

// Stratégie Cache First
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Erreur Cache First:', error);
    throw error;
  }
}

// Stratégie Network First
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Gestion des messages (pour la mise à jour manuelle)
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});