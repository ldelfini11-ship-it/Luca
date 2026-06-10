self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Recebe push do Apps Script (Web Push)
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e) {}

  const title = data.title || 'Hábitos — Luca';
  const options = {
    body: data.body || 'Lembrete',
    icon: data.icon || undefined,
    badge: data.badge || undefined,
    data: data.data || { url: './' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './';

  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of allClients) {
      if ('focus' in c) {
        c.focus();
        return;
      }
    }
    if (clients.openWindow) await clients.openWindow(url);
  })());
});
