const version = "v1::" //Change if you want to regenerate cache
const staticCacheName = `${version}static-resources`;

const offlineStuff = [
    '/sw',
    '/sw/src/scripts/index.js',
    '/sw/src/css/index.css',
    '/sw/src/index.js'
];

self.addEventListener('install', (event) => {
    console.log('in install');
    event.waitUntil(
        caches
            .open(staticCacheName)
            .then((cache) => {
                console.log('...offlineStuff');
                cache.add('//cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js');
                return cache.addAll(offlineStuff);
            })
            .then(() => {
                console.log('WORKER:: install completed');
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log('in activate');
    event.waitUntil(
        caches
            .keys()
            .then((keys) => {
                console.log('keys...', keys);
                return Promise.all(
                    keys
                        .filter((key) => {
                            console.log('filter...key...', key);
                            //If your cache name don't start with the current version...
                            return !key.startsWith(version);
                        })
                        .map((key) => {
                            console.log('map....key...', key);
                            //...YOU WILL BE DELETED
                            return caches.delete(key);
                        })
                );
            })
            .then(() => {
                console.log('WORKER:: activation completed. This is not even my final form');
            })
    );
});


self.addEventListener('fetch', function(event) {
    console.log('fetch...');
    event.respondWith(
        // Try the cache
        caches.match(event.request).then(function(response) {
            console.log('caches...', caches);
            return response || fetch(event.request);
        }).catch(function() {
            //Error stuff
        })
    );
});