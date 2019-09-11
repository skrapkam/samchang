/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({ modulePathPrefix: "workbox-v3.6.3" });

workbox.core.setCacheNameDetails({ prefix: "gatsby-plugin-offline" });

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    url: "webpack-runtime-924096a0c8b8f82a9449.js",
    revision: "46b241c604edaf1728398dad47d5f96d"
  },
  {
    url: "commons.9c98874d1dc48f580424.css",
    revision: "b2f91f5abb14bbd0470fd17a4cb2086c"
  },
  {
    url: "commons-8fd78ef3c41b2a8cfd3f.js",
    revision: "8fa001628662e6b2f07d631971b4b76d"
  },
  {
    url: "app-1ad9eb187896f4190811.js",
    revision: "a298302fe8bd66674c5aea686772c414"
  },
  {
    url:
      "component---node-modules-gatsby-plugin-offline-app-shell-js-435fdaa271ab65f6ef84.js",
    revision: "8906e3ccb57cda111d7fc2922b21acd3"
  },
  {
    url: "offline-plugin-app-shell-fallback/index.html",
    revision: "6ad18baa055877757a4ce913b37dbf54"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(
  /(\.js$|\.css$|static\/)/,
  workbox.strategies.cacheFirst(),
  "GET"
);
workbox.routing.registerRoute(
  /^https?:.*\page-data\/.*\/page-data\.json/,
  workbox.strategies.networkFirst(),
  "GET"
);
workbox.routing.registerRoute(
  /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
  workbox.strategies.staleWhileRevalidate(),
  "GET"
);
workbox.routing.registerRoute(
  /^https?:\/\/fonts\.googleapis\.com\/css/,
  workbox.strategies.staleWhileRevalidate(),
  "GET"
);

/* global importScripts, workbox, idbKeyval */

importScripts(`idb-keyval-iife.min.js`);

const { NavigationRoute } = workbox.routing;

const navigationRoute = new NavigationRoute(async ({ event }) => {
  let { pathname } = new URL(event.request.url);
  pathname = pathname.replace(new RegExp(`^`), ``);

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`);
  if (!resources || !(await caches.match(`/app-1ad9eb187896f4190811.js`))) {
    return await fetch(event.request);
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request);
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`;
  return await caches.match(offlineShell);
});

workbox.routing.registerRoute(navigationRoute);

const messageApi = {
  setPathResources(event, { path, resources }) {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources));
  },

  clearPathResources(event) {
    event.waitUntil(idbKeyval.clear());
  }
};

self.addEventListener(`message`, event => {
  const { gatsbyApi } = event.data;
  if (gatsbyApi) messageApi[gatsbyApi](event, event.data);
});
