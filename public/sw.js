if (workbox) {
  console.log(`Workbox is loaded!`);
  workbox.precaching.precacheAndRoute(self.__precacheManifest)

  workbox.routing.registerRoute(
    /(\/)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'index',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  )
  workbox.routing.registerRoute(
    /\.(js)$/,
    workbox.strategies.StaleWhileRevalidate({
      cacheName: 'scripts',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  )

  let list = []
  for (let i = 1; i <= 151; i++) {
    list.push(`./cries/${i}.ogg`)
  }

  workbox.precaching.precacheAndRoute(list, {
    directoryIndex: './',
  })

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  )

  workbox.routing.registerRoute(
    /\.(json)$/,
    workbox.strategies.StaleWhileRevalidate({
      cacheName: 'apidata',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  )
  workbox.routing.registerRoute(
    /\.(ogg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'sounds',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  )

  workbox.routing.registerRoute(
    /\.(?:css|woff|woff2)$/,
    workbox.strategies.StaleWhileRevalidate({
      cacheName: 'style',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  )

}
else {
  console.log(`Workbox didn't load`);
}
