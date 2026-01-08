// Service Worker - Avukat Asistan PWA
const CACHE_NAME = 'avukat-asistan-v1';
const urlsToCache = [
  '/',
  '/globals.css',
];

// Install event - cache oluştur
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Önbellek oluşturuldu');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('[SW] Önbellek oluşturma hatası:', err);
      })
  );
  // Yeni SW'yi hemen aktif et
  self.skipWaiting();
});

// Activate event - eski cache'leri temizle
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eski önbellek siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // SW'yi tüm client'larda aktif et
  return self.clients.claim();
});

// Fetch event - Network first, cache fallback stratejisi
self.addEventListener('fetch', (event) => {
  // API istekleri için cache kullanma
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Response'u klonla (bir kere okunabilir)
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Network başarısız, cache'den dön
        return caches.match(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification alındı');

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Yeni Bildirim', body: event.data.text() };
    }
  }

  const title = data.title || 'Avukat Asistan';
  const options = {
    body: data.body || 'Yeni bir bildiriminiz var',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/',
      ...data
    },
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Eğer zaten açık bir pencere varsa onu odakla
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Yoksa yeni pencere aç
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync event (offline süreler için)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-deadlines') {
    event.waitUntil(
      // Burada offline'da eklenen süreleri sync edebiliriz
      console.log('[SW] Süreler senkronize ediliyor...')
    );
  }
});

// Periyodik background sync (hatırlatmalar için)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);

  if (event.tag === 'check-deadlines') {
    event.waitUntil(
      checkUpcomingDeadlines()
    );
  }
});

// Yaklaşan süreleri kontrol et
async function checkUpcomingDeadlines() {
  try {
    // Backend'den acil süreleri çek
    const response = await fetch('/api/sureler');
    const data = await response.json();

    if (data.success && data.data) {
      const acilSureler = data.data.filter(sure => sure.aciliyet === 'acil');

      if (acilSureler.length > 0) {
        // Bildirim gönder
        self.registration.showNotification('⚠️ Acil Süreler!', {
          body: `${acilSureler.length} adet acil süreniz var!`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200, 100, 200],
          tag: 'acil-sureler',
          requireInteraction: true,
          data: { url: '/' }
        });
      }
    }
  } catch (error) {
    console.error('[SW] Süre kontrolü hatası:', error);
  }
}

console.log('[SW] Service Worker yüklendi');
