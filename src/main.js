import { initGame } from './game.js';

// Service Worker 등록 (오프라인 캐싱 및 PWA 지원)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('Service Worker Registered!', reg);
    }).catch((err) => {
      console.error('Service Worker Registration Failed:', err);
    });
  });
}

// 게임 시작
initGame();


⑧ public/sw.js (Cache-First 오프라인 캐싱)
const CACHE_NAME = 'web-game-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
