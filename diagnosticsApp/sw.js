const staticCacheName = "site-static";
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons"
];
// install service worker
self.addEventListener("install", evt => {
  //   console.log("Service Worker Has Been Installed");
  evt.waitUnitl(
    caches.open(staticCacheName).then(cache => {
      console.log("assests had been cached");
      cache.addAll(assets);
    })
  ); 
});

// Activate Service Worker
self.addEventListener("activate", evt => {
  console.log("service worker has been activated");
});
 
//  fetch event
self.addEventListener("fetch", evt => {
  //   console.log("fetch event", evt);
});

