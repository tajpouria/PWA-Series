const DYNAMIC_CACHE = window.env.REACT_APP_DYNAMIC_CACHE;
const STATIC_CACHE = window.env.REACT_APP_STATIC_CACHE;
const APIS = JSON.parse(window.env.REACT_APP_APIS);
const STATIC_DATA = [
  "/",
  "/fallback.html",
  "/static/js/1.chunk.js",
  "/favicon.ico",
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
  if (ev.request.url.indexOf(APIS.rickandmortyapi) > -1) {
    ev.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache =>
        fetch(ev.request).then(response => {
          cache.put(ev.request.url, response.clone());
          return response;
        })
      )
    );
  } else if (
    ev.respondWith(
      new RegExp("\\b" + STATIC_DATA.join("\\b|b\\") + "\\b").test(
        ev.request.url
      )
    )
  ) {
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
              return caches.open(STATIC_CACHE).then(cache => {
                if (ev.request.url.indexOf("/help"))
                  return cache.match("/fallback.html");
              });
            });
        }
      })
    );
  }
});
