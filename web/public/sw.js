const DYNAMIC_CACHE = "dynamic-cache-v2";
const STATIC_CACHE = "static-cache-v2";

const APIs = { rickandmortyapi: "https://rickandmortyapi.com/api/character/2" };

const STATIC_DATA = [
  "/",
  "/fallback.html",
  "/static/js/1.chunk.js",
  "/static/js/bundle.js",
  "/static/js/main.chunk.js",
  "https://fonts.googleapis.com/css?family=Ma+Shan+Zheng&display=swap"
];

const trimCache = async (cacheName, maxItem) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItem) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxItem);
  }
};

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
  if (ev.request.url.includes(APIs.rickandmortyapi)) {
    ev.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache =>
        fetch(ev.request).then(response => {
          trimCache(DYNAMIC_CACHE, 10);
          cache.put(ev.request.url, response.clone());
          return response;
        })
      )
    );
  } else if (STATIC_DATA.find(req => req === ev.request.url)) {
    ev.respondWith(
      caches.open(STATIC_CACHE).then(cache => cache.match(ev.request))
    );
  } else {
    ev.respondWith(
      caches.match(ev.request).then(response => {
        if (response) {
          return response;
        }

        return fetch(ev.request)
          .then(res =>
            caches.open(DYNAMIC_CACHE).then(cache => {
              trimCache(DYNAMIC_CACHE, 10);
              cache.put(ev.request.url, res.clone());
              return res;
            })
          )
          .catch(() => {
            if (request.headers.get("accept").includes("text/html")) {
              return caches
                .open(STATIC_CACHE)
                .then(cache => cache.match("/fallback.html"));
            }
          });
      })
    );
  }
});
