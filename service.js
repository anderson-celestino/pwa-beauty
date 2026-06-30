const CACHE_NAME = 'meu-app-beauty-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Salvando arquivos base no cache');
      return cache.addAll([
        '/',
        '/index.html',
        '/icone-192.png',
        '/icone-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (!(event.request.url.indexOf('http') === 0)) return;

  event.respondWith(
    fetch(event.request)
      .then((respostaRede) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, respostaRede.clone());
          return respostaRede;
        });
      })
      .catch(() => {
        console.log('Sem internet! Puxando dados do cache');
        return caches.match(event.request);
      })
  );
});