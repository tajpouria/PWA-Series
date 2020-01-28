/** "idborm": Following code snippet is required to access the "IDB"*/
importScripts("./idborm.iife.js");

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

const { StaleWhileRevalidate } = workbox.strategies;
const { IDB } = idborm;

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

const APIs = {
  rickandmortyapi: "https://unpkg.com/idb@4.0.5/build/iife/index-min.js",
  posts: "https://pwa-gram-7c869.firebaseio.com/posts.json",
  // newPost: "http://localhost:5000/pwa-gram-7c869/us-central1/newPost",
  newPost: "https://us-central1-pwa-gram-7c869.cloudfunctions.net/newPost"
};

const DYNAMIC_CACHE = "DYNAMIC_CACHE";

const trimCache = async (cacheName, maxItem) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItem) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxItem);
  }
};

workbox.routing.registerRoute(
  /.*(?:fonts.googleapis)\.com.*$/,
  new StaleWhileRevalidate({
    cacheName: "google-fonts",
    cacheExpiration: {
      maxEntries: 3,
      maxAgeSeconds: 60 * 60 * 24 * 30
    }
  })
);

workbox.routing.registerRoute(
  /.*\/static\/js\/.*.js$/,
  new StaleWhileRevalidate({ cacheName: "bundle-js" })
);

// CUSTOM HANDLERS

workbox.routing.registerRoute(APIs.posts, args =>
  fetch(args.event.request)
    .then(async response => {
      const clonedResponse = response.clone();

      const data = await clonedResponse.json();

      await Promise.all[Object.values(data).map(post => Post.put(post))];

      return response;
    })
    .catch(err => err)
);

workbox.routing.registerRoute(
  routeData => routeData.request.headers.get("accept").includes("text/html"), // Execute handler if return true
  args =>
    fetch(args.event.request)
      .then(res =>
        caches.open(DYNAMIC_CACHE).then(cache => {
          trimCache(DYNAMIC_CACHE, 10);

          cache.put(args.event.request.url, res.clone());

          return res;
        })
      )
      .catch(() => {
        return caches.match("/fallback.html").then(fallback => fallback);
      })
);

workbox.precaching.precacheAndRoute([]);

// BACKGROUND SYNCING
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
