const staticCacheName = "site-static";
const assets = [
    "/",
    "/index.html",
    "/pages/diagnostics-manager.html",
    "/pages/system-state.html",
    "/assets/js/app.js",
    "/assets/js/chart-streaming.min.js",
    "/assets/js/chart.min.js",
    "/assets/js/moment.js",
    "/assets/js/materialize.min.js",
    "/assets/css/materialize.min.css",
    "/assets/css/style.css",
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

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request);
        })
    );
});