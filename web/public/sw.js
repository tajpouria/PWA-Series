const DYNAMIC_CACHE = "dynamic-cache-v2";
const STATIC_CACHE = "static-cache-v2";

self.importScripts(
  "https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js"
);

const POSTS_OBJECT_STORE = "POSTS_OBJECT_STORE";
self.importScripts("./idb.js");

console.log(POSTS_OBJECT_STORE);

const APIs = {
  rickandmortyapi: "https://unpkg.com/idb@4.0.5/build/iife/index-min.js",
  posts: "https://pwa-gram-7c869.firebaseio.com/posts.json"
};

const STATIC_DATA = [
  "/",
  "/fallback.html",
  "/static/js/0.chunk.js",
  "/static/js/1.chunk.js",
  "/static/js/bundle.js",
  "/static/js/main.chunk.js",
  "https://fonts.googleapis.com/css?family=Ma+Shan+Zheng&display=swap",
  "https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js"
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
  if (ev.request.url.includes(APIs.posts)) {
    ev.respondWith(
      fetch(ev.request).then(async response => {
        const clonedResponse = response.clone();
        clonedResponse.json().then(async data => {
          const db = await dbPromise;
          const tx = db.transaction(POSTS_OBJECT_STORE, "readwrite");
          const store = tx.objectStore(POSTS_OBJECT_STORE);

          for (let key in data) {
            store.put(data[key]);
          }

          return tx.complete;
        });
        return response;
      })
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
