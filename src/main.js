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
