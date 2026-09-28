import * as THREE from 'three';

export function initGame() {
  // 1. Canvas 및 Scene / Camera / Renderer 설정
  let canvas = document.querySelector('#game-canvas');
  const container = document.querySelector('#canvas-container') || document.body;

  // HTML에 canvas 태그가 없으면 자동 생성하여 화면에 첨부
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    container.appendChild(canvas);
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.03);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 4, 8);
  camera.lookAt(0, 0, -5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.5);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // 3. Player Object
  const playerGeo = new THREE.ConeGeometry(0.8, 2, 4);
  const playerMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2 });
  const playerMesh = new THREE.Mesh(playerGeo, playerMat);
  playerMesh.rotation.x = Math.PI / 2;
  scene.add(playerMesh);

  // 4. Items Group
  const itemGeo = new THREE.IcosahedronGeometry(0.5, 0);
  const itemMat = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0x550022 });
  const itemMeshes = [];

  for (let i = 0; i < 15; i++) {
    const mesh = new THREE.Mesh(itemGeo, itemMat);
    scene.add(mesh);
    itemMeshes.push(mesh);
  }

  // 5. Grid Ground
  const grid = new THREE.GridHelper(200, 50, 0x00f0ff, 0x222244);
  grid.position.y = -0.5;
  scene.add(grid);

  // 6. Web Worker 물리 연산 연결
  const worker = new Worker(new URL('./physics.worker.js', import.meta.url), { type: 'module' });

  worker.onmessage = (e) => {
    if (e.data.type === 'UPDATE') {
      const { playerX, items, score } = e.data;

      // 플레이어 위치 반영
      playerMesh.position.x = playerX;

      // 아이템 위치 반영
      items.forEach((itemData, idx) => {
        if (itemMeshes[idx]) {
          itemMeshes[idx].position.set(itemData.x, itemData.y, itemData.z);
          itemMeshes[idx].rotation.x += 0.02;
          itemMeshes[idx].rotation.y += 0.02;
        }
      });

      // UI 점수 업데이트 (안전 검사)
      const scoreEl = document.querySelector('#score');
      if (scoreEl) scoreEl.innerText = score;
    }
  };

  // 7. 입력 처리 (키보드 이벤트)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') worker.postMessage({ type: 'MOVE', dir: -1 });
    if (e.key === 'ArrowRight') worker.postMessage({ type: 'MOVE', dir: 1 });
  });

  // 8. 창 크기 조절
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 9. Render Loop
  function animate() {
    requestAnimationFrame(animate);
    grid.position.z = (grid.position.z + 0.1) % 4; // 바닥 격자 스크롤 효과
    renderer.render(scene, camera);
  }

  animate();
}
