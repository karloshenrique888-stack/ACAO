const CACHE_NAME = 'treino-atributos-pro-plus-v1';
const ASSETS = [
  'index.html','calendar.html','treino.html','historico.html','relatorio.html','mensal.html','settings.html','perfis.html',
  'app.css','app.js','login.js','calendar.js','treino.js','historico.js','relatorio.js','mensal.js','settings.js','perfis.js',
  'manifest.json','icons/icon-192.png','icons/icon-512.png','icons_ex/ball.svg','icons_ex/cones.svg','icons_ex/ladder.svg','icons_ex/sprint.svg','icons_ex/brain.svg'
];
self.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); });
self.addEventListener('activate', (event) => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))); });
self.addEventListener('fetch', (event) => { event.respondWith(caches.match(event.request).then(r => r || fetch(event.request))); });
