module.exports = {
  globDirectory: "public/",
  globPatterns: ["**/*.{html,png,js,json}"],
  swDest: "public/sw.js",
  swSrc: "public/sw-base.js",
  globIgnores: ["icons/*.png", "*.bak.js"]
};
