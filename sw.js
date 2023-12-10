const cache_name = "resume-cache"

const pre_cached = [".", "./style.css","./img/", './ahorcado.js', '.main.js', './main.html',]

self.addEventListener("install", event => {
    async function preCacheResources(){
        //eliminar cache previo
        if ('caches' in navigator) {
            caches.keys().then(function(cacheNames) {
              cacheNames.forEach(function(cacheName) {
                if (cacheName.startsWith(cache_name)) {
                  caches.delete(cacheName);
                }
              });
            });
          }          
        //crear cache
        const cache = await caches.open(cache_name);
        cache.addAll(pre_cached);
    }
    event.waitUntil(preCacheResources());
});

self.addEventListener("fetch", event =>  {
    async function returnCachedResource(){
        const cache = await caches.open(cache_name);
        const cachedResponse = await cache.match(event.request.url);

        if (cachedResponse){
            return cachedResponse;
        }else{
            const fetchResponse = await fetch(event.request.url);
            cache.put(event.request.url, fetchResponse.clone());
            return fetchResponse
        }
    }
    event.respondWith(returnCachedResource());
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Desenigma';
  const options = {
    body: event.data.text(),
    icon: './img/icon-512x512.png',
    badge: './img/icon-512x512.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web')
  );
});

