/* create the service-worker.js file in the root directory of your project. Note that we don't need to add a <script src="./service-worker.js"> tag, because navigator.serviceWorker.register("./service-worker.js") does that for us. This also works in connection with script in the index.html file
Now that the browser knows about the service worker, we need to install it, adding files to the precache, so that the application can use the cache.
*/

/*array of files to cache. Note that we didn't include the images in assets. Browsers have a cache limit between 50 - 250 MB. We've prioritized caching the JavaScript and HTML files so that the site is at least functional. */
const APP_PREFIX = "FoodEvent-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js",
];

// Respond with cached resources
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // if cache is available, respond with cache
        console.log("responding with cache : " + e.request.url);
        return request;
      } else {
        // if there are no cache, try fetching request
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  );
});

// Cache resources
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Delete outdated caches
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create keeplist
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

/**Why don't we use window.addEventListener instead of self? Well, service workers run before the window object has even been created. So instead we use the self keyword to instantiate listeners on the service worker. The context of self here refers to the service worker object. 

***From module*******
To add an event listener to the activate event, we'll add the following code to service-worker.js:

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      })
Note that we haven't terminated the activate listener or the waitUntil() function yet. We have more code to add before closing those functions.

.keys() returns an array of all cache names, which we're calling keyList. keyList is a parameter that contains all cache names under <username>.github.io. Because we may host many sites from the same URL, we should filter out caches that have the app prefix. We'll capture the ones that have that prefix, stored in APP_PREFIX, and save them to an array called cacheKeeplist using the .filter() method.

Next, we need to add the current cache to the keeplist in the activate event listener, as follows:

cacheKeeplist.push(CACHE_NAME);
Remember that we set up CACHE_NAME as a global constant to help keep track of which cache to use. Finish the routine with the return statement shown in the following sample:

return Promise.all(keyList.map(function (key, i) {
  if (cacheKeeplist.indexOf(key) === -1) {
    console.log('deleting cache : ' + keyList[i] );
    return caches.delete(keyList[i]);
  }
}));
This last bit of the activate listener returns a Promise that resolves once all old versions of the cache have been deleted.

The following code shows the activate listener as it should appear now:

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      let cacheKeeplist = keyList.filter(function(key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function(key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
At this point we've registered a service worker, installed it, and told the service worker how to manage caches. We're missing one essential piece, though. The application still doesn't work offline! For offline functionality, we'll need to figure out a way to tell the browser to check the cache when there's no network connection.

*/
