const STATIC_CACHE = "static-cache-v1";
const DYNAMIC_CACHE = "dynamic-cache-v1";

self.addEventListener("install", () => {
  ev.waitUntil(caches.open(STATIC_CACHE)).then(cache => {
    cache.addAll([
      "/",
      "/static/js/bundle.js",
      "/img/img-small.png",
      "/img/img-medium.png",
      "/img/img-large.png",
      "/favicon.ico",
      "https://fonts.googleapis.com/css?family=Ma+Shan+Zheng&display=swap"
    ]);
  });
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
  caches.match(ev.request).then(res => {
    if (res) return res;

    return fetch(ev.res).then(response => {
      return caches.open(DYNAMIC_CACHE).then(cache => {
        cache.put(ev.request.url, response.clone);

        return response;
      });
    });
  });
});
