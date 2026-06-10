// 登録された瞬間に自分自身を強制解雇し、キャッシュを全消去して消滅するコード
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.registration.unregister().then(() => self.clients.claim()));