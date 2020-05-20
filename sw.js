"use strict";
const cacheStorageKey = "minimal-pwa-1";
const cacheList = [
    "./",
    "./manifest.json",
    "https://cdn.bootcss.com/extjs/6.0.0/ext-all.js",
    "https://cdn.bootcss.com/extjs/6.0.0/classic/theme-crisp/resources/theme-crisp-all.css",
    "https://cdn.bootcss.com/extjs/6.0.0/classic/theme-crisp/resources/theme-crisp-all_1.css",
    "https://cdn.bootcss.com/extjs/6.0.0/classic/theme-crisp/resources/theme-crisp-all_2.css",
    "./app/model/Model.js",
    "./app/store/Store.js",
    "./app/utils/Util.js",
    "./app/view/View.js",
    "./app/controller/Main.js",
    "./app/Application.js",
    "./json/arr.json",
    "./images/app-144.png",
    "./images/favicon.ico"
];
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(cacheStorageKey)
            .then((cache) => cache.addAll(cacheList))
            .then(() => self.skipWaiting())
    );
});
self.addEventListener("fetch", (event) => {
    const matchResponse = function matchResponse(response) {
        if (response !== null && self.location.host !== "127.0.0.1") {
            return response;
        }
        return fetch(event.request.url);
    };
    event.respondWith(caches.match(event.request).then(matchResponse));
});
self.addEventListener("activate", (event) => {
    const clearCache = function clearCache(cacheNames) {
        return Promise.all(
            // 获取所有不同于当前版本名称cache下的内容
            cacheNames.filter((cacheName) => cacheName !== cacheStorageKey).map((cacheName) => caches.delete(cacheName))
        );
    };
    event.waitUntil(
        // 获取所有cache名称
        caches
            .keys()
            .then(clearCache)
            .then(() => self.clients.claim())
    );
});
