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
