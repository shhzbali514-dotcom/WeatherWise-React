// ==========================================
// WEATHERWISE SERVICE WORKER
// PWA Offline Support + Caching
// FULLY FIXED: FetchEvent Response + Network Error
// ==========================================

const CACHE_NAME = 'weatherwise-v2'; // ⚠️ Version badha diya

// ==========================================
// BASE PATH (GitHub Pages repo name)
// ==========================================
const BASE_PATH = '/WeatherWise-React';

// Files to cache on install
const FILES_TO_CACHE = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`,
];

// ==========================================
// INSTALL EVENT
// ==========================================
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching files...');
      return cache.addAll(FILES_TO_CACHE).catch((err) => {
        console.warn('⚠️ Some files failed to cache:', err);
      });
    })
  );

  self.skipWaiting();
});

// ==========================================
// ACTIVATE EVENT
// ==========================================
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...');

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('🗑️ Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );

  self.clients.claim();
});

// ==========================================
// FETCH EVENT — FULLY FIXED
// ==========================================
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }

  // Skip API requests (always network)
  if (
    url.href.includes('api.open-meteo.com') ||
    url.href.includes('nominatim.openstreetmap.org') ||
    url.href.includes('photon.komoot.io')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ✅ Return cached version
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          // Clone + cache
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // ✅ FIX: Always return a Response object
          if (event.request.destination === 'document') {
            return caches
              .match(`${BASE_PATH}/index.html`)
              .then((cachedPage) => {
                if (cachedPage) {
                  return cachedPage;
                }
                // Fallback HTML
                return new Response(
                  '<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;background:#0a0a12;color:#fff;"><h1>🌤️ WeatherWise</h1><p>You are offline. Please check your internet connection.</p></body></html>',
                  {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                      'Content-Type': 'text/html',
                    }),
                  }
                );
              });
          }

          // ✅ Non-document requests — return 503
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
    })
  );
});

// ==========================================
// MESSAGE EVENT
// ==========================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }
});

// ==========================================
// PUSH NOTIFICATION (Optional)
// ==========================================
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'New weather update!',
    icon: `${BASE_PATH}/icon-192.png`,
    badge: `${BASE_PATH}/icon-192.png`,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || `${BASE_PATH}/`,
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'WeatherWise',
      options
    )
  );
});

// ==========================================
// NOTIFICATION CLICK
// ==========================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    // eslint-disable-next-line no-undef
    clients.openWindow(
      event.notification.data.url || `${BASE_PATH}/`
    )
  );
});