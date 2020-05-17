let cacheStorageKey = 'minimal-pwa-1'
let cacheList = [
    './',
    './manifest.json',
    'https://cdn.bootcss.com/extjs/6.0.0/ext-all.js',
    'https://cdn.bootcss.com/extjs/6.0.0/classic/theme-crisp/resources/theme-crisp-all.css',
    './app/model/Model.js',
    './app/store/Store.js',
    './app/utils/Util.js',
    './app/view/View.js',
    './app/controller/Main.js',
    './app/Application.js',
    './json/arr.json',
    './images/app-144.png',
    './images/favicon.ico'
]
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheStorageKey)
            .then(cache => cache.addAll(cacheList))
            .then(() => self.skipWaiting())
    )
});
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            if (response != null) {
                return response
            }
            return fetch(e.request.url)
        })
    )
})
self.addEventListener('activate', function (e) {
    e.waitUntil(
        //获取所有cache名称
        caches.keys().then(cacheNames => {
            return Promise.all(
                // 获取所有不同于当前版本名称cache下的内容
                cacheNames.filter(cacheNames => {
                    return cacheNames !== cacheStorageKey
                }).map(cacheNames => {
                    return caches.delete(cacheNames)
                })
            )
        }).then(() => {
            return self.clients.claim()
        })
    )
})