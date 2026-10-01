// Service worker mínimo — só pra permitir a instalação do app (PWA).
const CACHE = 'padeiro-app-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  // só a casca do lançador é cacheada; o portal (outro domínio) passa direto pela rede
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
});
