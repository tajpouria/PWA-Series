/** "idborm": Following code snippet is required to access the "IDB"*/
importScripts("./idborm.iife.js");
const { IDB } = idborm;

const APIs = {
  rickandmortyapi: "https://unpkg.com/idb@4.0.5/build/iife/index-min.js",
  posts: "https://pwa-gram-7c869.firebaseio.com/posts.json",
  newPost: "https://us-central1-pwa-gram-7c869.cloudfunctions.net/newPost"
};

const STATIC_CACHE = "STATIC_CACHE";
const DYNAMIC_CACHE = "DYNAMIC_CACHE";

const STATIC_DATA = [
  "/",
  "/fallback.html",
  "/static/js/0.chunk.js",
  "/static/js/1.chunk.js",
  "/static/js/bundle.js",
  "/static/js/main.chunk.js",
  "https://fonts.googleapis.com/css?family=Ma+Shan+Zheng&display=swap"
];

const PostDB = IDB.init("PostDB", 2, [
  {
    name: "Post",
    options: { keyPath: "id" }
  },
  {
    name: "SyncPost",
    options: { keyPath: "id" }
  }
]);

const { Post, SyncPost } = PostDB.objectStores;

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

self.addEventListener("activate", async ev => {
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

self.addEventListener("fetch", async ev => {
  if (ev.request.url.includes(APIs.posts)) {
    ev.respondWith(
      fetch(ev.request)
        .then(async response => {
          const clonedResponse = response.clone();

          const data = await clonedResponse.json();

          await Promise.all[Object.values(data).map(post => Post.put(post))];

          return response;
        })
        .catch(err => err)
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
            if (ev.request.headers.get("accept").includes("text/html")) {
              return caches
                .open(STATIC_CACHE)
                .then(cache => cache.match("/fallback.html"));
            }
          });
      })
    );
  }
});

self.addEventListener("sync", event => {
  if (event.tag === "sync-new-post") {
    event.waitUntil(
      SyncPost.values().then(values => {
        values.forEach(value => {
          const formData = new FormData();
          formData.append("id", value.id);
          formData.append("title", value.title);
          formData.append("location", value.location);
          formData.append("file", value.image, `${value.title}.png`);

          fetch(APIs.newPost, { method: "POST", body: formData }).then(
            async res => {
              if (res.ok) {
                const data = await res.json();
                SyncPost.delete(data.id);
              }
            }
          );
        });
      })
    );
  }
});

self.addEventListener("push", async event => {
  let data = {
    title: "New!",
    body: "Some thing new happened!",
    data: {
      url: "/"
    },
    image: "./icons/app-icon-96x96",
    vibrate: [100, 50, 200]
  };

  if (event.data) {
    data = { ...data, ...JSON.parse(event.data.text()) };
  }

  event.waitUntil(self.registration.showNotification(data.title, data));
});

self.addEventListener("notificationclick", event => {
  const notification = event.notification;

  if (notification) {
    event.waitUntil(
      clients.matchAll().then(clis => {
        const client = clis.find(c => c.visibilityState === "visible");

        if (client) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          clients.openWindow(notification.data.url);
        }
      })
    );

    notification.close();
  }
});
