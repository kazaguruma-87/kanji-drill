// 更新するたびにこの数値を v1, v2, v3... と書き換えることで、スマホに強制アップデートをかけます
const CACHE_NAME = 'k-shiki-v1';
const ASSETS = [
  './',
  './index.html'
];

// インストール時に最新のファイルを強制キャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 古いバージョンのキャッシュを自動削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.claim();
});

// 画面を開くたび、まずはネットワーク（GitHub）から最新を取りに行く（最重要）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // ネットがつながるなら、最新版をキャッシュに保存しつつ画面に返す
        if (response && response.status === 200) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      })
      .catch(() => {
        // 完全にオフラインの時だけ、手元のキャッシュから出す
        return caches.match(event.request);
      })
  );
});