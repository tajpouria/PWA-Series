const DYNAMIC_CACHE = "dynamic-cache-v1";
const STATIC_CACHE = "static-cache-v1";

const APIs = { rickandmortyapi: "https://rickandmortyapi.com/api/character/2" };

const STATIC_DATA = [
  "/",
  "/fallback.html",
  "/static/js/1.chunk.js",
  "/static/js/bundle.js",
  "/static/js/main.chunk.js",
  "https://fonts.googleapis.com/css?family=Ma+Shan+Zheng&display=swap"
];

self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      cache.addAll(STATIC_DATA);
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
  if (ev.request.url.indexOf(APIs.rickandmortyapi) > -1) {
    ev.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache =>
        fetch(ev.request).then(response => {
          cache.put(ev.request.url, response.clone());
          return response;
        })
      )
    );
  } else {
    ev.respondWith(
      caches.match(ev.request).then(response => {
        if (response) {
          return response;
        } else {
          return fetch(ev.request)
            .then(res => {
              return caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(ev.request.url, res.clone());
                return res;
              });
            })
            .catch(() => {
              return caches
                .open(STATIC_CACHE)
                .then(cache => cache.match("/fallback.html"));
            });
        }
      })
    );
  }
});
