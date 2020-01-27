export const APIs = {
  rickandmortyapi: "https://unpkg.com/idb@4.0.5/build/iife/index-min.js",
  posts: "https://pwa-gram-7c869.firebaseio.com/posts.json",
  subs: "https://pwa-gram-7c869.firebaseio.com/subs.json",
  newPost:
    process.env.REACT_APP_SERVE === "debug"
      ? "http://localhost:5000/pwa-gram-7c869/us-central1/newPost"
      : "https://us-central1-pwa-gram-7c869.cloudfunctions.net/newPost"
};
