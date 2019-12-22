self.addEventListener("install", e => {
  console.log("installing service worker", e);
});

self.addEventListener("activate", e => {
  console.log("activate , service worker", e);
});

self.addEventListener("fetch", e => {
  // e.respondWith(null);
  e.respondWith(fetch(e.request));
});
