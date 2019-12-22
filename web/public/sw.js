const STATIC_CACHE = "static-cache-v2";
const DYNAMIC_CACHE = "dynamic-cache-v2";

self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      cache.addAll([
        "/",
        "/static/js/1.chunk.js",
        "/favicon.ico",
        "/static/js/bundle.js",
        "/static/js/main.chunk.js",
        "https://fonts.googleapis.com/css?family=Ma+Shan+Zheng&display=swap"
      ]);
    })
  );
});

self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener("fetch", ev => {
  ev.respondWith(
    caches.match(ev.request).then(response => {
      if (response) {
        return response;
      } else {
        return fetch(ev.request).then(res => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(ev.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});
