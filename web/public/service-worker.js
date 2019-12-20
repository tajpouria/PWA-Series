console.log("fuck");
self.addEventListener("install", () => {
  console.log("installed");
});

self.addEventListener("activation", () => {
  console.log("activated");
});
