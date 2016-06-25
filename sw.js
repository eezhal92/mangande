importScripts('/cache-polyfill.js')

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('mangande').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/resepku.css',
                '/vue.js',
                '/jquery.min.js',
                '/moment.js',
                '/main.js',
                '/img/banner.jpg',
                '/img/bubur.jpg',
                '/img/recipe-item.jpg',
                'https://fonts.googleapis.com/css?family=Roboto:400,300',
                'http://resepku.eezhal92.com/api/v1/recipes?limit=4'
            ])
        })
    )
})

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request)
        })
    )
})