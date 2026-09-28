import { defineConfig } from 'vite';

export default defineConfig({
  base: '/web-3d-game/', // 상대 경로 대신 GitHub Pages 저장소 이름 경로로 지정
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
