# PWA series

## The web app manifest [reference](https://developers.google.com/web/fundamentals/web-app-manifest)

### Tell the browser about your manifest

```html
<link rel="manifest" href="/manifest.json" />
```

### Key manifest properties

```json
{
  "short_name": "Maps", // If both are provided, short_name is used on the user's home screen, launcher, or other places where space may be limited
  "name": "Google Maps",

  "icons": [
    //  include a 192x192 pixel icon and a 512x512 pixel icon. Chrome will automatically scale the icon for the device
    {
      "src": "/images/icons-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/images/icons-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],

  "start_url": "/?utm_source=a2hs", // The start_url tells the browser where your application should start when it is launched. add a query string to the end of the start_url to track how often your installed app is launched

  "background_color": "#fafafa", // The background_color property is used on the splash screen when the application is first launched.

  "display": "standalone", // In order to show the Add to Home Screen Prompt, display must be set to standalone
  /*
    fullscreen	Opens the web application without any browser UI and takes up the entirety of the available display area.
    standalone	Opens the web app to look and feel like a standalone native app. The app runs in its own window, separate from the browser, and hides standard browser UI elements like the URL bar, etc.
    minimal-ui	This mode is similar to fullscreen, but provides the user with some means to access a minimal set of UI elements for controlling navigation (i.e., back, forward, reload, etc).
    Note: Only supported by Chrome on mobile.
    browser	A standard browser experience.
*/

  "orientation": "landscape",
  /*
    any
    natural
    landscape
    landscape-primary 
    landscape-secondary
    portrait
    portrait-primary
    portrait-secondary

    primary means don't switch till user doesn't rotate the device 180 deg
    */

  "scope": "/maps/",
  //The scope defines the set of URLs that the browser considers to be within your app, and is used to decide when the user has left the app. The scope controls the URL structure that encompasses all the entry and exit points in your web app. Your start_url must reside within the scope

  "theme_color": "#3367D6", // The theme_color sets the color of the tool bar, and may be reflected in the app's preview in task switchers The theme_color should match the meta theme color specified in your document head.

  "categories": ["books", "education", "medical"],
  "description": "Awesome application that will help you achieve your dreams.",
  "dir": "rtl", // auto ltr
  "lang": "en-US",

  "prefer_related_applications": true, // The prefer_related_applications member is a boolean value that specifies that applications listed in related_applications should be preferred over the web application
  "related_applications": [
    {
      "platform": "play",
      "url": "https://play.google.com/store/apps/details?id=com.example.app1",
      "id": "com.example.app1"
    },
    {
      "platform": "itunes",
      "url": "https://itunes.apple.com/app/example-app1/id123456789"
    }
  ],

  "screenshots": [
    // The screenshots member defines an array of screenshots intended to showcase the application. These images are intended to be used by progressive web app stores.

    {
      "src": "screenshot1.webp",
      "sizes": "1280x720",
      "type": "image/webp"
    },
    {
      "src": "screenshot2.webp",
      "sizes": "1280x720",
      "type": "image/webp"
    }
  ],

  "serviceworker": {
    "src": "./serviceworker.js",
    "scope": "/app",
    "type": "",
    "update_via_cache": "none" // Whether the user agent cache should be bypassed when fetching the service worker.
  }
}
```

### Disable user scaling _user cannot zoom_

```html
<meta
  name="viewport"
  content="width=device-width, user-scalable=no ,initial-scale=1.0, minimum-scale=1.0,  maximum-scale=1.0, shrink-to-fit=no"
/>
```

### Makes safari, IE and IOS icon also supports

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="apple-mobile-web-app-title" content="PWAGram" />
<meta
  name="msapplication-TileImage"
  content="/src/images/icons/app-icon-144x144.png"
/>
<meta name="msapplication-TileColor" content="#fff" />
<meta name="theme-color" content="#3f51b5" />
<link
  rel="apple-touch-icon"
  href="/src/images/icons/apple-icon-57x57.png"
  sizes="57x57"
/>
<link
  rel="apple-touch-icon"
  href="/src/images/icons/apple-icon-60x60.png"
  sizes="60x60"
/>
<link
  rel="apple-touch-icon"
  href="/src/images/icons/apple-icon-72x72.png"
  sizes="72x72"
/>
<link
  rel="apple-touch-icon"
  href="/src/images/icons/apple-icon-76x76.png"
  sizes="76x76"
/>
<link
  rel="apple-touch-icon"
  href="/src/images/icons/apple-icon-114x114.png"
  sizes="114x114"
/>
<link
  rel="apple-touch-icon"
  href="/src/images/icons/apple-icon-120x120.png"
  sizes="120x120"
/>
<link
  rel="apple-touch-icon"
  href="/src/images/icons/apple-icon-144x144.png"
  sizes="144x144"
/>
<link
  rel="apple-touch-icon"
  href="/src/images/icons/apple-icon-152x152.png"
  sizes="152x152"
/>
<link
  rel="apple-touch-icon"
  href="/src/images/icons/apple-icon-180x180.png"
  sizes="180x180"
/>
```

## Service worker

### service Worker lifeCycle

1. Installation **( service worker will only install if either sw file change or there is first time that install it )** -> emit install event
2. Activation **( service worker will only activated when no other service worker instance is running )** -> emit activate event
3. Idle
4. Terminate **( service worker will enter idle step again if triggered by an event then back to terminate phase again )**

### Register the serviceWorker

```js
if ("serviceWorker" in navigator)
  window.addEventListener("load", () =>
    navigator.serviceWorker
      .register("sw.js")
      .then(reg => console.info(reg), { scope: "/help/" })
      .catch(err => console.error(err))
  );
```

### Add to home screen

In order for a user to be able to install your Progressive Web App, it needs to meet the following criteria:

- The web app is not already installed.
- and prefer_related*applications is not true. \_manifest.json*
- Includes a web app manifest that includes:
  - short_name or name
  - icons must include a 192px and a 512px sized icons
  - start_url
  - display must be one of: fullscreen, standalone, or minimal-ui
  - Served over HTTPS (required for service workers)
  - Has registered a service worker with a fetch event handler

### Add to home screen Manually prompt

The `beforeinstallprompt` will be fired by chrome right before prompting

./main.js

```js
let deferredPrompt;

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault(); // preventing browser from showing the prompt

  deferredPrompt = event;

  return false;
});

// e.g. showing The prompt whenever the user clicked button

const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt(); // SHOWING the prompt

    // listening to userChoice
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === "dismissed") {
        console.info("User cancelled the installation");
      } else {
        console.info("User accept the installation");
      }

      deferredPrompt = null;
    });
  }
});
```

### Cache [ reference ](https://developer.mozilla.org/en-US/docs/Web/API/Cache)

- `Cache.match(request, options)`
  Returns a Promise that resolves to the response associated with the first matching request in the Cache object.
- `Cache.matchAll(request, options)`
  Returns a Promise that resolves to an array of all matching requests in the Cache object.
- `Cache.add(request)`
  Takes a URL, retrieves it and adds the resulting response object to the given cache. This is functionally equivalent to calling fetch(), then using put() to add the results to the cache.
- `Cache.addAll(requests)`
  Takes an array of URLs, retrieves them, and adds the resulting response objects to the given cache.
- `Cache.put(request, response)`
  Takes both a request and its response and adds it to the given cache.
- `Cache.delete(request, options)`
  Finds the Cache entry whose key is the request, returning a Promise that resolves to true if a matching Cache entry is found and deleted. If no Cache entry is found, the promise resolves to false.
- `Cache.keys(request, options)`
  Returns a Promise that resolves to an array of Cache keys.

#### PreCaching

./public/sw.js

```js
self.addEventListener("install", ev => {
  ev.waitUntil(caches.open("static")).then(cache => {
    cache.add("/src/img.png"); // the key is request obj and not a string
  });
});
self.addEventListener("fetch", ev => {
  caches.match(ev.request).then(res => {
    // if no request match res = null
    if (res) return res;
    return fetch(ev.request);
  });
});
```

#### Dynamic caching

./public/sw.js

```js
self.addEventListener("fetch", ev => {
  ev.respondWith(
    caches.match(ev.request).then(res => {
      if (res) return res;
      return fetch(ev.res).then(response => {
        // make sure to return cache and response at the end
        return caches.open("dynamic").then(cache => {
          cache.put(ev.request.url, response.clone); // since response is consomme we can use it once so we cache it's clone
          return response;
        });
      });
    })
  );
});
```

#### Manual caching

e.g. cache an article whenever user clicked the save button

./app.ts

```js
saveBtn.addEventListener("click", () => {
  // caches can be access anywhere in application and NOT just service worker
  if ("caches" in window) {
    caches.open("user-save", cache => {
      cache.add("http://bin.org/article/1");
      cache.add("/img/img.jpg");
    });
  }
});
```

#### Cleanup old caches

./public/sw.js

```js
self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== "static-v2" && key !== "dynamic-v2")
            return caches.delete(key);
        })
      );
    })
  );
});
```

#### Fallback on fetch.catch

```js
self.addEventListener("fetch", ev => {
  ev.respondWith(
    caches.match(ev.request).then(res => {
      if (res) return res;
      return fetch(ev.res)
        .then(response => {
          return caches.open("dynamic").then(cache => {
            cache.put(ev.request.url, response.clone);
            return response;
          });
        })
        .catch(err => {
          return caches.open("static", cache => {
            // make sure to return

            // check and return fallback for specific pages
            if (request.url.indexOf("/help"))
              return cache.match("fallback.html"); // make sure to cache fallback in static cache before returning it
          });
        });
    })
  );
});
```

#### Catching strategies

1. Catch-only

./public/sw.js

```js
self.addEventListener("fetch", ev => {
  ev.respondWith(caches.match(ev.request).then(response => response));
});
```

2. Network-only

./public/sw.js

```js
self.addEventListener("fetch", ev => {
  ev.respondWith(fetch(ev.request));
});
```

3. Network-cache

./public/sw.js

```js
self.addEventListener('fetch', ev => {
  ev.respondWith(fetch(ev.request).then(response => {
    caches.open('dynamic').then(cache => {
      cache.put(ev.request.url , response.clone())
      return response
    })
  }).catch(() => caches.match(ev.request).then(response => {
    if(response) return response

    return caches.open('static').then(cache => {
      if (request.url.indexOf("/help"))
      return cache.match('/fallback.html')
  }))
}))
```

4. **Cache-network**

./app.ts

```tsx
useEffect(() => {
  let fetchDataLoaded = false;
  fetch(URL)
    .then(response => {
      fetchDataLoaded = true;
      return response.json();
    })
    .then(res => setState(res));

  caches
    .matchAll(URL)
    .then(response => {
      if (!fetchDateLoaded) return response.json(); // check to not overriding if date is currently fetched
    })
    .then(res => setState(res));
}, []);
```

./public/sw.js

```js
self.addEventListener(ev => {
  // for a specific url doing _fetch-first-then-catch_ strategy and for rest of the pages doing regular
  if (ev.request.url.includes(APIs.rickandmortyapi)) {
    ev.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache =>
        fetch(ev.request).then(response => {
          cache.put(ev.request.url, response.clone());
          return response;
        })
      )
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
              cache.put(ev.request.url, res.clone());
              return res;
            })
          )
          .catch(() => {
            if (request.headers.get("accept").includes("text/html")) {
              return caches
                .open(STATIC_CACHE)
                .then(cache => cache.match("/fallback.html"));
            }
          });
      })
    );
  }
});
```

#### Recursively cleaning the cache

./public/sw.js

```js
const trimCache = (cacheName, maxItem) => {
  caches.open(cacheName).then(cache =>
    cache.keys().then(keyList => {
      if (keyList.length > maxItem) {
        cache.delete(keyList[0]).then(() => trimCache(cacheName, maxItem));
      }
    })
  );
};

self.addEventListener("fetch", () => {
  // ...
  trimCache(CACHE_DYNAMIC, 10);
  cache.put(ev.request, response.clone());
  // ...
});
```

#### UnRegister the service worker

UnRegistering a service worker will automatically **flushes the cache**

./main.js

```js
document.getElementById("btn").addEventListener("click", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then(registrations => registration.map(r => r.register()));
  }
});
```

### IndexedDB

A transactional key-value DB in the browser that can access **both synchronies or ASynchronies**: the transactional means if **one action** within tha transaction **fails**, **none** of the action of that transition will applied.

#### idb

In following example we use [ idb package ](https://github.com/jakearchibald/idb) to interact with indexedDB

- import external script in serviceWorker

```js
self.importScripts(
  "https://cdn.jsdelivr.net/npm/idb@4.0.5/build/iife/with-async-ittr-min.js"
);
```

- idb usage :

  1.  open a database and object store _similar to table_

  ```js
  // (db name , db version , callback to create object store)
  const dbPromise = idb.openDB("posts-store", 1, db => {
    if (!db.objectStoreNames.contains("posts"))
      db.createObjectStore("posts", { keyPath: "id" }); // using keyPath to retrieve data from objectStore
  });
  ```

  2. open the db ,create transaction , storeData and complete transaction

  ```js
  self.addEventListener("fetch", ev => {
    // ... in this eventListener I just shown how to store data in dataBase if you interested whole cb-function body visit https://github.com/tajpouria/PWA-Series/blob/master/web/public/sw.js#L45

    dbPromise.then(db => {
      fetch(ev.request).then(res => {
        clonedRes = res.clone();
        return clonedRes.json().then(data => {
          dbPromise.then(db => {
            const tx = db.transaction("posts", "readwrite");
            const store = tx.objectStore("posts");

            store.put(data);
            return tx.done; // complete is a property and not a method
          });
        });
        return res;
      });
    });

    // ...
  });
  ```

#### Reading from idb

./utilities/idb.js

```js
const addRecord = async (st, data) =>
  dbPromise.then(db => {
    const tx = db.transaction(st, "readwrite");
    const store = tx.objectStore(st);

    store.put(data[key]);

    return tx.done;
  });
```

./utilities/idb.js

```js
const readAllRecords = st =>
  dbPromise.then(db => {
    const tx = db.transaction(st, "readwrite");
    const store = tx.objectStore(st);
    return store.getAll();
  });
```

#### Delete idb records

- clearAllRecords

./utilities/idb.js

```js
// Make sure to return the promise
const clearAllRecords = st =>
  dbPromise.then(db => {
    const tx = db.transaction(st, "readwrite");
    const store = tx.objectStore(st);
    store.clear();
    return tx.done;
  });
```

- clearSingleRecord

./utilities/idb.js

```js
const clearSingleRecord = (st, id) =>
  dbPromise
    .then(db => {
      const tx = db.transaction(st, "readwrite");
      const store = tx.store(st);
      store.delete(id);
      return tx.done;
    })
    .then(() => console.info("items deleted"));
```

## Background sync

./app.js

```ts
document
  .querySelector(".form")
  .addEventListener("submit", async submitEvent => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      const sw = await navigator.serviceWorker.ready;

      // store syncData in indexedDB
      await SyncPost.put(newPost);

      await sw.sync.register("sync-new-post");
    } else {
      postFormData(value);
    }
  });
```

./public/serviceWorker.js

```ts
self.addEventListener("sync", event => {
  if (event.tag === "sync-new-post") {
    // listening to a specific tag
    event.waitUntil(
      SyncPost.values().then(values => {
        values.forEach(value => {
          // loop over stored request inside the indexedDB
          sendFormData(value).then(async res => {
            if (res.ok) {
              // delete request from objectStore when it resolved
              const data = await res.json();
              await SyncPost.delete(data.id);
            }
          });
        });
      })
    );
  }
});
```

## Push notification

### requestPermission

./src/App.tsx

```ts
if ("Notification" in window) {
  Notification.askPermission(result => {
    if (result !== "granted") {
      // Permission denied
    } else {
      // CONFIGURE PUSH SUBSCRIPTION should handled here

      new Notification(notification_title, {
        // https://developer.mozilla.org/en-US/docs/Web/API/notification/Notification
        body: notification_body
      });

      // or send show notification from the serviceWorker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
          serviceWorkerRegistration.showNotification(notification_title, {
            // notifications options
          });
        });
      }
    }
  });

  var notification_options = {
    body,
    icon: PATH_TO_ICON,
    image: PATH_TO_IMAGE,
    dir: auto | ltr | ltr,
    lang: "en-US", //  BCP: 47
    vibrate: [100, 50, 200], // [vibrate ms, pause ms, vibrate ms ] vibrate-pause-vibrate-pause-...
    badge: PATH_TO_BADGE, // Android top bar badge 96x96 is recommended

    tag: "NOTIFICATION_TAG", // kinda id for notification i.e. if two notification have same tag only the last one will shown
    renotify: true, // if set to true even if second notification have same tag to previous one it will cause vibrate the phone

    actions: [
      { action: "confirm", title, icon: PATH_TO_ICON },
      { action: "cancel", title, icon: PATH_TO_ICON }
    ],

    data: {
      // meta Date
      [string]: any
    }
  };
}
```

### Listening to notification in serviceWorker

./public/sw.js

```js
self.addEventListener("notificationclick", event => {
  const notification = event.notification;
  const action = event.action;

  if (action === "confirm") {
    console.log("Confirmation was chosen");
    notification.close();
  } else {
    event.waitUntil(
      clients.matchAll().then(clis => {
        const client = clis.find(c => c.visibilityState === "visible");

        if (client) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

self.addEventListener("notificationclose", event => {
  console.log("Notification close event", event);
});
```

### Configure push subscription and Storing subscription

> yarn add web-push

#### generate vapid key

> ./node_modules/.bin/web-push generate-vapid-keys

```sh
=======================================

Public Key:
BGloLj23J2ILplF07sVJwMb9XiHsl8gVGjPxrdMN4H9YiqHLoPYJUjYcXtlxrNcQhxJ4tNQOzzymeJxf2t5F1Vo

Private Key:
cehQ4_2VuA4WOOkB45IpxwpymRmgpAAZo7r4zvSLTZ0

=======================================
```

./src/App.tsx

```tsx

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const configurePushSubscription = async () => {
  if ("serviceWorker" in navigator) {
    const swReg = await navigator.serviceWorker.ready;

    const sub = await swReg.pushManager.getSubscription();

    if (sub === null) {

      const convertedVapidKey = urlBase64ToUint8Array(Public Key)

      const newSub = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

        // POST REQUEST to store newSub to database
    } else {
      // We have subscription
    }
  }
};
```

### Send notification from server

./functions/index.js

```js
const webPush = require("web-push");

exports.newPost = functions.https.onRequest(async (req, res) => {
  webPush.setVapidDetails("mailto:email@email.com", PublicKey, PrivateKey);

  const subs = await admin()
    .database()
    .ref("/subscriptions")
    .once("value");

  // subs is an Object but since we're using firebase SDK we access forEach

  subs.forEach(sub => {
    const pushConfig = {
      endPoint: sub.val().endpoint,
      keys: {
        auth: sub.val().auth,
        p256dh: sub.val().p256dh
      }
    };

    webPush.sendNotification(
      pushConfig,
      JSON.stringify({
        title: "New Post",
        content: "New Post Added!",
        url: "/posts"
      })
    );
  });
});
```

### Listening to push massages

./public/sw.js

```js
self.addEventListener("push", async event => {
  let data = { title: "New!", content: "Some thing new happened!", url: "/" };

  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.content,
      data: {
        url: data.url
      }
    })
  );
});
```

## Native device features

### Accessing device camera

./Feed.tsx

```tsx
const Feed = () => {
  const videoRef = React.useRef() as React.RefObject<HTMLVideoElement>;

  React.useEffect(() => {
    if ("getUserMedia" in navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          videoRef.current!.srcObject = stream;
        })
        .catch(() => {
          // NOT PERMITTED
        });
    }
  }, []);

  return <video ref={videoRef} autoPlay></video>;
};
```

### handling capture

./Feed.tsxjk

```tsx
const Feed = () => {
  function handleCapture() {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");

      context?.drawImage(
        video,
        0,
        0,
        canvas.width,
        video.videoHeight / (video.videoWidth / canvas.width)
      );

      // @ts-ignore
      video.srcObject.getVideoTracks().forEach(track => track.stop());
    }
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: takePic ? "block" : "none" }} />

      <video ref={videoRef} autoPlay />

      <button onClick={handleCapture}>Capture</button>
    </>
  );
};
```

### Sundry

#### FormData https://javascript.info/formdata

If HTML form element is provided, it automatically captures its fields.

The special thing about FormData is that network methods, such as fetch, can accept a FormData object as a body. It’s encoded and sent out with `Content-Type: form/multipart`.

```js
const formDate = new FormData();

formData.append(fieldName, fieldVal), formData.add("file", fileVal, fileName); // as it were a name of the file in user’s filesystem,

formDate.remove(fieldName);

formData.get(name);

formData.has(name);

// The difference is that .set removes all fields with the given name
formData.set(name, value), formData.set(name, blob, fileName);

fetch("/article/formdata/post/user-avatar", {
  method: "POST",
  body: fromData
});
```
