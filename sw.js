const cache_name = "resume-cache"

const pre_cached = [".", "style.css","img/"]

self.addEventListener("install", event => {
    async function preCacheResources(){
        //eliminar cache previo
        if ('caches' in window) {
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

if (navigator.setAppBadge) {
    console.log("The App Badging API is supported!");
  }
  
navigator.setAppBadge(64).then(() => {
    console.log("The badge was added");
}).catch(e => {
  console.error("Error displaying the badge", e);
});
