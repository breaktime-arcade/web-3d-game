import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // 상대 경로로 설정하여 모든 asset 경로 자동 맞춤
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
