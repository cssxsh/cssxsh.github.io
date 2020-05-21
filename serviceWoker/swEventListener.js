"use strict";

const {resources} = self;
self.listeners = {
    "install": (event) => {
        event.waitUntil(
            caches
                .open(resources.cacheStorageKey)
                .then((cache) => cache.addAll(resources.cacheList))
                .then(() => self.skipWaiting())
        );
    },
    "fetch": (event) => {
        const cacheNewResponse = function cacheNewResponse(newResponse) {
            return caches.open(resources.cacheStorageKey).then((cache) => {
                cache.put(event.request, newResponse.clone());
                return newResponse;
            });
        };
        const matchResponse = function matchResponse(response) {
            return response || fetch(event.request.url).then(cacheNewResponse);
        };
        event.respondWith(caches.match(event.request).then(matchResponse));
    },
    "activate": (event) => {
        const clearCache = function clearCache(cacheNames) {
            return Promise.all(
                // 获取所有不同于当前版本名称cache下的内容
                cacheNames.filter((cacheName) => cacheName !== resources.cacheStorageKey).map((cacheName) => caches.delete(cacheName))
            );
        };
        event.waitUntil(
            // 获取所有cache名称
            caches
                .keys()
                .then(clearCache)
                .then(() => self.clients.claim())
        );
    },
    "message": (event) => {
        const postData = event.data;
        if ("type" in postData) {
            const {type} = postData;
            if (type === "setCacheKey") {
                self.resources.cacheStorageKey = postData.key;
                self.listeners.install();
            }
        }
    }
};
