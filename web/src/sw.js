self.addEventListener("install", () => {
  console.log("INSTALLED");
});

self.addEventListener("activate", ev => {
  console.log("activated");
  return self.clients.claim();
});
